const express = require('express');
const router = express.Router();
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getLowStockProducts
} = require('../controller/product.controller');

// Create
router.post('/', createProduct);
// Read all
router.get('/', getAllProducts);
// Read one
router.get('/:id', getProductById);
// Update
router.put('/:id', updateProduct);
// Delete
router.delete('/:id', deleteProduct);
// Get low stock products
router.get('/low-stock', getLowStockProducts);

module.exports = router; 