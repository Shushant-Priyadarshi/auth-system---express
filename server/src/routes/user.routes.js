import { Router } from "express";
import {
  forgotPassword,
  getUserProfile,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resetPassword,
  verifyOTP,
} from "../controller/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/verify-otp").post(verifyOTP);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/user-profile").get(verifyJwt, getUserProfile);
router.route("/refresh-access-token").post(refreshAccessToken);
router.route("/forgot-password").post(forgotPassword);
router.route("/change-password").post(resetPassword)

export default router;
