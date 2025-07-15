const Product = require('../model/product.model');
const Category = require('../model/category.model');
const Subcategory = require('../model/subcategory.model');
// Helper to add discountPrice to product(s)
function addDiscountPrice(product) {
    if (!product) return product;
    const p = product.toObject ? product.toObject() : { ...product };
    const price = p.price || 0;
    const discount = p.discount || 0;
    p.discountPrice = price - (price * discount / 100);
    return p;
}
function addDiscountPriceToArray(products) {
    return products.map(addDiscountPrice);
}

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        // Check if category and subcategory are active
        const category = await Category.findById(req.body.category_id);
        const subcategory = await Subcategory.findById(req.body.subcategory_id);
        
        if (!category || !category.active) {
            return res.status(400).json({ error: 'Category is not active' });
        }
        
        if (!subcategory || !subcategory.active) {
            return res.status(400).json({ error: 'Subcategory is not active' });
        }
        
        const productData = {
            ...req.body,
            images: req.files ? req.files.map(f => f.filename) : [],
            active: req.body.active !== undefined ? req.body.active : true
        };
        const product = new Product(productData);
        const savedProduct = await product.save();
        res.status(201).json(addDiscountPrice(savedProduct));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all products (only active ones by default)
exports.getAllProducts = async (req, res) => {
    try {
        const filter = {};
        
        // Only filter by active if not 'all'
        if (req.query.active === undefined || req.query.active === 'true') {
            filter.active = true;
        } else if (req.query.active === 'true' || req.query.active === 'false') {
            filter.active = false;
        }
        // If req.query.active === 'all', do not filter by active
        const products = await Product.find(filter)
            .populate('user_id')
            .populate('category_id')
            .populate('subcategory_id');
        
        // Filter products where category and subcategory are active
        const filteredProducts = products.filter(product => {
            return product.category_id && product.category_id.active && 
                   product.subcategory_id && product.subcategory_id.active;
        });
        
        res.status(200).json(addDiscountPriceToArray(filteredProducts));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get active products only (for public display)
exports.getActiveProducts = async (req, res) => {
    try {
        const products = await Product.find({ active: true })
            .populate('user_id')
            .populate('category_id')
            .populate('subcategory_id');
        
        // Filter products where category and subcategory are active
        const activeProducts = products.filter(product => {
            return product.category_id && product.category_id.active && 
                   product.subcategory_id && product.subcategory_id.active;
        });
        
        res.status(200).json(addDiscountPriceToArray(activeProducts));
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
        res.status(200).json(addDiscountPrice(product));
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
        
        // Check if category and subcategory are active when updating
        if (req.body.category_id) {
            const category = await Category.findById(req.body.category_id);
            if (!category || !category.active) {
                return res.status(400).json({ error: 'Category is not active' });
            }
        }
        
        if (req.body.subcategory_id) {
            const subcategory = await Subcategory.findById(req.body.subcategory_id);
            if (!subcategory || !subcategory.active) {
                return res.status(400).json({ error: 'Subcategory is not active' });
            }
        }
        
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(addDiscountPrice(updatedProduct));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Toggle product active status
exports.toggleProductStatus = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        product.active = !product.active;
        await product.save();
        
        res.status(200).json({
            message: `Product ${product.active ? 'activated' : 'deactivated'} successfully`,
            product: addDiscountPrice(product)
        });
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
        res.status(200).json(addDiscountPriceToArray(lowStockProducts));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 