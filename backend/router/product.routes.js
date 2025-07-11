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

// Create
router.post('/', upload.array('images',5), createProduct); // up to 5 images
// Read all
router.get('/', getAllProducts);
// Read one
router.get('/:id', getProductById);
// Update
router.put('/:id', upload.array('images',5), updateProduct);
// Delete
router.delete('/:id', deleteProduct);
// Get low stock products
router.get('/low-stock', getLowStockProducts);

module.exports = router; 