import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import prisma from "../utils/prisma.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";
import {
  sendVerificationEmail,
  generateOTP,
  sendPasswordResetEmail,
} from "../utils/sendMail.js";
import { googleClient } from "../app.js";

//register user
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  if (
    !email ||
    !password ||
    !name ||
    [email, password, name].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existedUser) {
    throw new ApiError(400, "User already exist with this email");
  }

  //otp generate
  const otp = generateOTP();

  //save otp to database for 10 min
  await prisma.oTP.create({
    data: {
      email: email,
      otp: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins from now
    },
  });
  //send verification main
  await sendVerificationEmail(email, otp, name);

  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUser = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Otp send to email please verify to continue."));
});

//verify-otp
const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    throw new ApiError(400, "email and otp required");
  }
  const existingOtp = await prisma.oTP.findFirst({
    where: { email, otp },
    orderBy: { createdAt: "desc" },
  });

  if (!existingOtp || existingOtp.expiresAt < new Date()) {
    throw new ApiError(400, "otp expired or Invalid");
  }

  await prisma.user.update({
    where: { email },
    data: { emailVerified: true },
  });

  await prisma.oTP.deleteMany({ where: { email } });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Email verified successfully."));
});

//login user helper function
const generateAccessAndRefreshToken = async (userId) => {
  try {
    if (!userId) {
      throw new ApiError(400, "User id is required to generate token");
    }
    const userFromDB = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!userFromDB) {
      throw new ApiError(400, "User not found");
    }
    const accessToken = generateAccessToken(userFromDB);
    const refreshToken = generateRefreshToken(userFromDB);

    //userFromDB.refreshToken = refreshToken;
    await prisma.user.update({
      where: {
        id: userFromDB.id,
      },
      data: {
        refreshToken: refreshToken,
      },
    });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generate access and refresh token"
    );
  }
};

//login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new ApiError(400, "email is required");
  }
  if (!password) {
    throw new ApiError(400, "password is required");
  }

  const userFromDB = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!userFromDB) {
    throw new ApiError(
      400,
      "Account does not exist with this email. Please register first"
    );
  }

  if (!userFromDB.emailVerified) {
    throw new ApiError(403, "Please verify your email before logging in.");
  }

  if (!(await bcrypt.compare(password, userFromDB.password))) {
    throw new ApiError(400, "Password is wrong. Please try again");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    userFromDB.id
  );

  const userResponse = {
    id: userFromDB.id,
    name: userFromDB.name,
    email: userFromDB.email,
    emailVerified: userFromDB.emailVerified,
  };

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        {
          user: userResponse,
          accessToken,
        },
        "Logged In successfully"
      )
    );
});

//logout
const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(400, "Invalid user");
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      refreshToken: null,
    },
  });
  return res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .status(200)
    .json(new ApiResponse(200, "Logged out successfully"));
});

//refresh access token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized access");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (!decodedToken) {
      throw new ApiError(401, "Invalid refresh token! Unauthorized request");
    }
    const userFromDB = await prisma.user.findUnique({
      where: {
        id: decodedToken.userId,
      },
    });

    if (!userFromDB) {
      throw new ApiError(
        401,
        "Invalid refresh token! user not found in database"
      );
    }

    if (incomingRefreshToken !== userFromDB?.refreshToken) {
      throw new ApiError(401, "Refresh token expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(userFromDB.id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          201,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully!"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

//forgot password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "email is required");
  }
  //check if the email exist or not
  const userFromDB = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!userFromDB) {
    throw new ApiError(
      400,
      "No account found with provided email. Please register first."
    );
  }
  //generate a token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 1000 * 60 * 15);

  //update the db with generated reset token and expiry time
  await prisma.user.update({
    where: {
      email: userFromDB.email,
    },
    data: {
      resetToken: resetToken,
      resetTokenExpiry: expiry,
    },
  });

  //make a fronted link
  const resetFrontendLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  //a link is sent to email
  await sendPasswordResetEmail(
    userFromDB.email,
    resetFrontendLink,
    userFromDB.name
  );

  res
    .status(200)
    .json(
      new ApiResponse(200, null, "Reset link hase been sent to your email.")
    );
});

//reset password
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    throw new ApiError(400, "token or new password is missing");
  }
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gte: new Date(),
      },
    },
  });
  if (!user) {
    throw new ApiError(400, "Token expired or invalid");
  }

  const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
  const updatedUser = await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      password: hashedNewPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });
  if (!updatedUser) {
    throw new ApiError(500, "Something went wrong while updating the user.");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Password has been successfully Changed. Login now"
      )
    );
});

//get profile
const getUserProfile = asyncHandler(async (req, res) => {
  res
    .status(201)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

//oauth controller
const googleOAuthLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    throw new ApiError(400, "No google credentials found");
  }
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { name, email, email_verified } = payload;

  const userExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  let user;
  if (!userExist) {
    const userCreated = await prisma.user.create({
      data: {
        name,
        email,
        emailVerified: email_verified,
      },
    });
    if (!userCreated) {
      throw new ApiError(500, "Something went wrong while saving the user");
    }
  }else{
    user=userExist
  }
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken: refreshToken,
    },
  });

  const userResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
  };

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        {
          user: userResponse,
          accessToken,
        },
        "Logged In successfully"
      )
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  refreshAccessToken,
  verifyOTP,
  forgotPassword,
  resetPassword,
  googleOAuthLogin,
};
