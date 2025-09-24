import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail, resendEmail } from "../utils/sendEmail.js";
import { validationResult } from "express-validator";
import generateOTP from "../utils/generateOtp.js";

// Register user
export const signup = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, password } = req.body;
        const existingUser = await User.findOne({ 
            $or: [{ email } ] 
        });
        
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ msg: "Email already exists" });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const otp = generateOTP();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

        const user = await User.create({
            fullname,
            email,
            password: hashedPassword,
            otp,
            otpExpiry
        });

        // send OTP via email
        await sendEmail(
            email,
            "Verify your Calmspace account",
            `
                <h2>Welcome to CalmSpace</h2>
                <p>Your OTP for account verification is: <strong>${otp}</strong></p>
                <p>This OTP will expire in 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `
        );

        res.status(201).json({ 
            msg: "Signup successful. Check your email for OTP.",
            email: email 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// verify user with OTP
export const verifyOtp = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const { email, otp } = req.body;
        const user = await User.findOne({ email }).select("+otp +otpExpiry");

        if (!user) return res.status(404).json({ msg: "User not found" });

        if (user.isVerified) {
        return res.status(400).json({ msg: "User already verified" });
        }

        if (!user.otp || user.otpExpiry < Date.now()) {
        return res.status(400).json({ msg: "OTP has expired. Please request a new one." });
        }

        if (user.otp === otp) {
        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        return res.json({ msg: "Account verified successfully" });
        } else {
        return res.status(400).json({ msg: "Invalid OTP" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Resend OTP
export const resendOtp = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;
        const user = await User.findOne({ email }).select("+otp +otpExpiry");
        
        if (!user) return res.status(404).json({ msg: "User not found" });
        if (user.isVerified) return res.status(400).json({ msg: "User already verified" });

        if (!user.otp || user.otpExpiry < Date.now()) {
        return res.status(400).json({ msg: "OTP has expired. Please request a new one." });
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000;

        await user.save();

        // send OTP via email
        await resendEmail(
            email,
            "Resend OTP - Verify your Calmspace account",
            `
                <h2>OTP Resent</h2>
                <p>Your new OTP for account verification is: <strong>${otp}</strong></p>
                <p>This OTP will expire in 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `
        );
        
        res.json({ msg: "OTP resent. Check your email." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Onboarding - complete profile
export const completeProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, nickname } = req.body;

        const user = await User.findOne({ email });
        if (!user || !user.isVerified) {
            return res.status(400).json({ error: "User not verified" });
        }

        user.nickname = nickname;
        await user.save();

        res.json({ 
            msg: "Onboarding complete",
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                nickname: user.nickname
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
};

// login User
export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(400).json({ msg: "User not found!" });

        if (!user.isVerified) {
            return res.status(403).json({ 
                msg: "Your email isn't verified! Please verify your email first",
                needsVerification: true,
                email: user.email
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Your Password is incorrect" }); 

        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: "7d" }
        );

        res.json({ 
            msg: "Login successful",
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                nickname: user.nickname
            },
            token: token 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Google OAuth callback
export const googleCallback = async (req, res) => {
    try {
        const profile = req.user; // Passport attaches profile here

        let user = await User.findOne({ googleId: profile.id });
        let isNewUser = false;

        if (!user) {
            // New user - create account
            user = await User.create({
                fullname: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                isVerified: true, // Google emails are verified
            });
            isNewUser = true;
        }

        // Issue JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Redirect based on user status
        let frontendURL;
        if (isNewUser) {
            // New user - redirect to onboarding
            frontendURL = process.env.NODE_ENV === 'production' 
                ? `https://calmspace1.netlify.app/onboarding1.html?token=${token}`
                : `http://127.0.0.1:5500/onboarding1.html?token=${token}`;
        } else {
            // Existing user - redirect to main app
            frontendURL = process.env.NODE_ENV === 'production' 
                ? `https://calmspace1.netlify.app/dashboard.html?token=${token}`
                : `http://127.0.0.1:5500/dashboard.html?token=${token}`;
        }
        
        res.redirect(frontendURL);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Google authentication failed" });
    }
};

// Get current user
export const me = async (req, res) => {
    try {
        console.log(' /me endpoint called, user ID:', req.user.id);
        
        const user = await User.findById(req.user.id).select("-password -otp -otpExpiry");
        
        if (!user) {
            console.log('❌ User not found in database');
            return res.status(404).json({ message: "User not found" });
        }
        
        console.log('✅ User found:', { id: user._id, email: user.email, nickname: user.nickname });
        
        res.json({
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            nickname: user.nickname,
            isVerified: user.isVerified,
            createdAt: user.createdAt
        });
    } catch (err) {
        console.error('💥 /me endpoint error:', err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Logout user
export const logout = (req, res) => {
    // Since JWT is stateless, logout can be handled on client side by deleting the token
    res.json({ msg: "Logged out successfully" });
};
