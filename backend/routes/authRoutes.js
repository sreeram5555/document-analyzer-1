
import express from "express";
import {
  register,
  verifyEmail,
  resendOtp,
  login,
  sendResetOtp,
  resetPassword,
  logout,
  me,
} from "../controllers/authController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.post("/forgot-password", sendResetOtp);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);
router.get("/me", userAuth, me);

export default router;
