const express = require('express');
const router = express.Router();
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getLowStockProducts,
    toggleProductStatus,
    getAllProductsforshop
} = require('../controller/product.controller');
const { 
    requireAdmin, 
    requireAdminOrSeller, 
    requireProductOwnership,
    authenticateToken 
} = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');
const authenticate = require('../middleware/authenticate');

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
router.get('/', authenticate, getAllProducts);
router.get('/getall',  getAllProductsforshop);

// Get low stock products (admin only) - must come before /:id route
router.get('/low-stock', requireAdmin, getLowStockProducts);

// Toggle product status (admin or seller with ownership) - must come before /:id route
router.patch('/:id/toggle-status', requireProductOwnership, toggleProductStatus);

// Read one product (public access)
router.get('/:id', getProductById);

// Update product (admin or seller with ownership)
router.put('/:id', requireProductOwnership, upload.array('images',5), updateProduct);

// Delete product (admin or seller with ownership)
router.delete('/:id', requireProductOwnership, deleteProduct);

module.exports = router; 