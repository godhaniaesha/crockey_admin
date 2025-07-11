const express = require('express');
const router = express.Router();
const {
    createSubcategory,
    getAllSubcategories,
    getSubcategoryById,
    updateSubcategory,
    deleteSubcategory
} = require('../controller/subcategory.controller');
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

// All subcategory management routes require admin access
router.post('/', requireAdmin, upload.single('image'), createSubcategory);
router.get('/', getAllSubcategories); // Public access for viewing subcategories
router.get('/:id', getSubcategoryById); // Public access for viewing subcategory
router.put('/:id', requireAdmin, upload.single('image'), updateSubcategory);
router.delete('/:id', requireAdmin, deleteSubcategory);

module.exports = router; 