const express = require('express');
const router = express.Router();
const {
    createCart,
    getAllCarts,
    getCartById,
    updateCart,
    deleteCart,
    addOrUpdateProduct,
    removeProduct,
    getUserCart
} = require('../controller/cart.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All cart routes require user authentication
router.post('/', authenticateToken, createCart);
router.get('/', authenticateToken, getAllCarts);
router.get('/get-user-cart/:id', authenticateToken, getUserCart);
router.get('/:id', authenticateToken, getCartById);
router.put('/:id', authenticateToken, updateCart);
router.delete('/:id', authenticateToken, deleteCart);
router.post('/add-or-update', authenticateToken, addOrUpdateProduct);
router.post('/remove', authenticateToken, removeProduct);

module.exports = router; 