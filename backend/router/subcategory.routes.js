const express = require('express');
const router = express.Router();
const {
    createSubcategory,
    getAllSubcategories,
    getSubcategoryById,
    updateSubcategory,
    deleteSubcategory
} = require('../controller/subcategory.controller');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Create
router.post('/', upload.single('image'), createSubcategory);
// Read all
router.get('/', getAllSubcategories);
// Read one
router.get('/:id', getSubcategoryById);
// Update
router.put('/:id', upload.single('image'), updateSubcategory);
// Delete
router.delete('/:id', deleteSubcategory);

module.exports = router; 