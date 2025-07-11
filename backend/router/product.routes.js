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
const { 
    requireAdmin, 
    requireAdminOrSeller, 
    requireSellerOwnership,
    authenticateToken 
} = require('../middleware/auth.middleware');
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

// Create product (admin or seller only)
router.post('/', requireAdminOrSeller, upload.array('images',5), createProduct);

// Read all products (public access)
router.get('/', getAllProducts);

// Read one product (public access)
router.get('/:id', getProductById);

// Update product (admin or seller with ownership)
router.put('/:id', requireAdminOrSeller, requireSellerOwnership, upload.array('images',5), updateProduct);

// Delete product (admin or seller with ownership)
router.delete('/:id', requireAdminOrSeller, requireSellerOwnership, deleteProduct);

// Get low stock products (admin only)
router.get('/low-stock', requireAdmin, getLowStockProducts);

module.exports = router; 