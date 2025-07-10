const express = require('express');
const router = express.Router();
const {
    createSubcategory,
    getAllSubcategories,
    getSubcategoryById,
    updateSubcategory,
    deleteSubcategory
} = require('../controller/subcategory.controller');

// Create
router.post('/', createSubcategory);
// Read all
router.get('/', getAllSubcategories);
// Read one
router.get('/:id', getSubcategoryById);
// Update
router.put('/:id', updateSubcategory);
// Delete
router.delete('/:id', deleteSubcategory);

module.exports = router; 