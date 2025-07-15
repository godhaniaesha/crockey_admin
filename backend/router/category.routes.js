const express = require('express');
const router = express.Router();
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../controller/category.controller');
const { uploadHandlers, handleMulterError, convertJfifToJpeg } = require('../middleware/imageupload');

// For single image upload with field name 'image'
router.post(
    '/',
    uploadHandlers.single('image'),
    convertJfifToJpeg,
    handleMulterError,
    createCategory
);

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

router.put(
    '/:id',
    uploadHandlers.single('image'),
    convertJfifToJpeg,
    handleMulterError,
    updateCategory
);

router.delete('/:id', deleteCategory);
router.patch('/:id/toggle-status', require('../controller/category.controller').toggleCategoryStatus);

module.exports = router; 