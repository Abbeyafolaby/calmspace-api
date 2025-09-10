import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullname: { 
        type: String, 
        required: true,
        trim: true,
        minlength: [2, 'Full name must be at least 2 characters'],
        maxlength: [100, 'Full name cannot exceed 100 characters']
    },
    nickname: { 
    type: String,
    trim: true,
    default: null,
    minlength: [2, 'Nickname must be at least 2 characters'],
    maxlength: [30, 'Nickname cannot exceed 30 characters']
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true,
        match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address'
        ]
    },
    password: { 
        type: String, 
        required: function() { return !this.googleId; },
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't include password in queries by default
    },
    googleId: { 
        type: String,
        sparse: true
    },
    otp: { 
        type: String,
        select: false
    },
    otpExpiry: { 
        type: Date,
        select: false
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
}, { 
    timestamps: true 
});


export default mongoose.model("User", UserSchema);