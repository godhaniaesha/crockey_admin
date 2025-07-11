const express = require('express');
const router = express.Router();
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../controller/category.controller');
const { requireAdmin } = require('../middleware/auth.middleware');
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

// All category management routes require admin access
router.post('/', requireAdmin, upload.single('image'), createCategory);
router.get('/', getAllCategories); // Public access for viewing categories
router.get('/:id', getCategoryById); // Public access for viewing category
router.put('/:id', requireAdmin, upload.single('image'), updateCategory);
router.delete('/:id', requireAdmin, deleteCategory);

module.exports = router; 