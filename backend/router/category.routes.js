const express = require('express');
const router = express.Router();
const { 
    createCategory, 
    getAllCategories, 
    getCategoryById, 
    updateCategory, 
    deleteCategory 
} = require('../controller/category.controller');

// Create
router.post('/', createCategory);
// Read all
router.get('/', getAllCategories);
// Read one
router.get('/:id', getCategoryById);
// Update
router.put('/:id', updateCategory);
// Delete
router.delete('/:id', deleteCategory);

module.exports = router; 