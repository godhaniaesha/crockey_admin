const express = require('express');
const router = express.Router();
const {
    createCart,
    getAllCarts,
    getCartById,
    updateCart,
    deleteCart,
    addOrUpdateProduct,
    removeProduct
} = require('../controller/cart.controller');

// Create
router.post('/', createCart);
// Read all
router.get('/', getAllCarts);
// Read one
router.get('/:id', getCartById);
// Update
router.put('/:id', updateCart);
// Delete
router.delete('/:id', deleteCart);
// Add or update product in cart
router.post('/add-or-update', addOrUpdateProduct);
// Remove product from cart
router.post('/remove', removeProduct);

module.exports = router; 