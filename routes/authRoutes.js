import express from "express";
import { signup, verifyOtp, completeProfile, resendOtp, login, logout } from "../controllers/authController.js";
import { validateSignup, validateLogin, validateOtp, validateCompleteProfile } from "../middleware/validation.js";

const router = express.Router();


router.post("/signup", validateSignup, signup);
router.post("/verify-otp", validateOtp, verifyOtp);
router.post("/complete-profile", validateCompleteProfile, completeProfile);
router.post("/login", validateLogin, login);
router.post("/resend-otp", validateOtp, resendOtp);
router.post("/logout", logout);

export default router;