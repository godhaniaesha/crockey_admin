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

// Create
router.post('/', createWishlist);
// Read all
router.get('/', getAllWishlists);
// Read one
router.get('/:id', getWishlistById);
// Update
router.put('/:id', updateWishlist);
// Delete
router.delete('/:id', deleteWishlist);
// Add product to wishlist
router.post('/add', addProduct);
// Remove product from wishlist
router.post('/remove', removeProduct);

module.exports = router; 