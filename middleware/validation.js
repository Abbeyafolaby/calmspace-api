import { body } from 'express-validator';

export const validateSignup = [
    body('fullname')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number and one special character')
];

export const validateLogin = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

export const validateOtp = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('otp')
        .isLength({ min: 6, max: 6 })
        .withMessage('OTP must be exactly 6 digits')
        .isNumeric()
        .withMessage('OTP must contain only numbers')
];

export const validateCompleteProfile = [
    body("email")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),

    body("nickname")
        .trim()
        .notEmpty()
        .withMessage("Nickname is required")
        .isLength({ min: 2, max: 30 })
        .withMessage("Nickname must be between 2 and 30 characters")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("Nickname can only contain letters, numbers, and underscores"),
];