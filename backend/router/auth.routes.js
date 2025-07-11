const express = require('express');
const router = express.Router();
const { AuthController } = require('../controller');
const { 
    authenticateToken, 
    requireAdmin, 
    requireSeller, 
    requireUser,
    requireOwnership 
} = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        // Accept only images
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// ==================== AUTHENTICATION ROUTES ====================

// Register new user
router.post('/register', upload.single('profileImage'), AuthController.RegisterUser);

// Login user
router.post('/login', AuthController.login);

// Forgot password - send OTP
router.post('/forgot-password', AuthController.forgotPassword);

// Verify OTP for password reset
router.post('/verify-password-reset-otp', AuthController.verifyPasswordResetOTP);

// Reset password after OTP verification
router.post('/reset-password', AuthController.resetPassword);

// Change user profile (requires authentication and ownership)
router.put('/change-profile/:userId', authenticateToken, requireOwnership, upload.single('profileImage'), AuthController.changeProfile);

// Logout user (requires authentication)
router.post('/logout', authenticateToken, AuthController.logoutUser);

// Generate new token (refresh token)
router.post('/refresh-token', AuthController.generateNewToken);

// Check authentication
router.get('/check-auth', authenticateToken, AuthController.authnticateCheck);

// ==================== USER MANAGEMENT ROUTES (ADMIN ONLY) ====================

// Get all users (admin only)
router.get('/users', requireAdmin, AuthController.getAllUsers);

// Get user by ID (admin only)
router.get('/users/:id', requireAdmin, AuthController.getUserById);

// Update user (admin only)
router.put('/users/:id', requireAdmin, upload.single('profileImage'), AuthController.updateUser);

// Delete user (admin only)
router.delete('/users/:id', requireAdmin, AuthController.deleteUser);

// Create user (admin function)
router.post('/create-user', requireAdmin, upload.single('profileImage'), AuthController.createUser);

// ==================== SELLER REGISTRATION ROUTES ====================

// Verify GST number
router.post('/verify-gst', AuthController.verifyGST);

// Add business details
router.post('/add-business-details', AuthController.addBusinessDetails);

// Send OTP for seller verification
router.post('/send-otp', AuthController.sendOTP);

// Verify OTP for seller registration
router.post('/verify-otp', AuthController.verifyOTP);

// Add store details
router.post('/add-store-details', AuthController.addStoreDetails);

// Add bank details
router.post('/add-bank-details', AuthController.addBankDetails);

// Add pickup address
router.post('/add-pickup-address', AuthController.addPickupAddress);

// Accept terms and conditions
router.post('/accept-terms', AuthController.acceptTermsAndConditions);

// Get seller registration progress (requires authentication and ownership)
router.get('/seller-progress/:userId', authenticateToken, requireOwnership, AuthController.getSellerRegistrationProgress);

// ==================== ERROR HANDLING MIDDLEWARE ====================

// Handle multer errors
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 5MB.'
            });
        }
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    
    if (error.message === 'Only image files are allowed!') {
        return res.status(400).json({
            success: false,
            message: 'Only image files are allowed!'
        });
    }
    
    next(error);
});

module.exports = router;
