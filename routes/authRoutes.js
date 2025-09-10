import express from "express";
import { signup, verifyOtp, completeProfile, resendOtp, login, logout, me, googleCallback } from "../controllers/authController.js";
import { validateSignup, validateLogin, validateOtp, validateCompleteProfile } from "../middleware/validation.js";
import passport from "../config/passport.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/verify-otp", validateOtp, verifyOtp);
router.post("/complete-profile", validateCompleteProfile, completeProfile);
router.post("/login", validateLogin, login);
router.post("/resend-otp", validateOtp, resendOtp);
router.post("/logout", logout);
router.get("/me", authMiddleware, me);

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false }), googleCallback);

export default router;
