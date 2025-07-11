const mongoose = require("mongoose");

const registerSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "seller", "user"],
        default: "user"
    },
    profileImage: {
        type: String,
        default: ""
    },
    // Seller income tracking
    income: {
        type: Number,
        default: 0
    },
    withdrawn: {
        type: Number,
        default: 0
    },
    bankDetails: {
        accountHolder: String,
        accountNumber: String,
        bankName: String,
        ifscCode: String
    },
    // OTP fields for password reset
    resetPasswordOTP: {
        type: String,
        default: null
    },
    resetPasswordExpiry: {
        type: Date,
        default: null
    },
    otpVerified: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
        default: null
    }
}, { timestamps: true })

module.exports = mongoose.model("Register", registerSchema);
