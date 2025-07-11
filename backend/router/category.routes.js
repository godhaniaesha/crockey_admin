const express = require('express');
const router = express.Router();
const { 
    createCategory, 
    getAllCategories, 
    getCategoryById, 
    updateCategory, 
    deleteCategory 
} = require('../controller/category.controller');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // or your desired upload folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
// Create
router.post('/',upload.single('image'), createCategory);
// Read all
router.get('/', getAllCategories);
// Read one
router.get('/:id', getCategoryById);
// Update
router.put('/:id', upload.single('image'), updateCategory);
// Delete
router.delete('/:id', deleteCategory);

module.exports = router; 