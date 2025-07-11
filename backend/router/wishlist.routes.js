const express = require('express');
const router = express.Router();
const {
    createWishlist,
    getAllWishlists,
    getWishlistById,
    updateWishlist,
    deleteWishlist,
    addProduct,
    removeProduct
} = require('../controller/wishlist.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All wishlist routes require user authentication
router.post('/', authenticateToken, createWishlist);
router.get('/', authenticateToken, getAllWishlists);
router.get('/:id', authenticateToken, getWishlistById);
router.put('/:id', authenticateToken, updateWishlist);
router.delete('/:id', authenticateToken, deleteWishlist);
router.post('/add', authenticateToken, addProduct);
router.post('/remove', authenticateToken, removeProduct);

module.exports = router; 