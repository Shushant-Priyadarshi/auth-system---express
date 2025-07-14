import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";

const verifyJwt = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(400, "Unauthorized request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userFromDB = await prisma.user.findUnique({
      where: {
        email: decodedToken?.email,
      },
    });
    if (!userFromDB) {
      throw new ApiError(400, "Invalid access token");
    }
    const { password: _, refreshToken: __, ...userSafeData } = userFromDB;
    req.user = userSafeData;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
export { verifyJwt };
