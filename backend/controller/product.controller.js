const Product = require('../model/product.model');

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const productData = {
            ...req.body,
            images: req.files ? req.files.map(f => f.filename) : []
        };
        const product = new Product(productData);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('user_id')
            .populate('category_id')
            .populate('subcategory_id');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('user_id')
            .populate('category_id')
            .populate('subcategory_id');
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(f => f.filename);
        }
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get low stock products
exports.getLowStockProducts = async (req, res) => {
    try {
        const seller = req.query.seller;
        const filter = {};
        if (seller) {
            filter.user_id = seller;
        }
        // Get all products for seller (or all)
        const products = await Product.find(filter)
            .populate('user_id')
            .populate('category_id')
            .populate('subcategory_id');
        // Filter by each product's lowstock value
        const lowStockProducts = products.filter(p => p.stock <= (p.lowstock || 5));
        res.status(200).json(lowStockProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 