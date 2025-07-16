const Cart = require('../model/cart.model');
const Product = require('../model/product.model')
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
function addDiscountPriceToCart(cart) {
    if (!cart) return cart;
    const c = cart.toObject ? cart.toObject() : { ...cart };
    if (Array.isArray(c.products)) {
        c.products = c.products.map(item => {
            if (item.product_id) {
                item.product_id = addDiscountPrice(item.product_id);
            }
            return item;
        });
    }
    return c;
}
function addDiscountPriceToCarts(carts) {
    return carts.map(addDiscountPriceToCart);
}

// Create a new cart
exports.createCart = async (req, res) => {
    try {
        const cart = new Cart(req.body);
        const savedCart = await cart.save();
        res.status(201).json(savedCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all carts
exports.getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.find()
            .populate('user_id')
            .populate('products.product_id');
        res.status(200).json(addDiscountPriceToCarts(carts));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single cart by ID
exports.getCartById = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id)
            .populate('user_id')
            .populate('products.product_id');
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        res.status(200).json(addDiscountPriceToCart(cart));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a cart by ID (supports partial updates)
exports.updateCart = async (req, res) => {
    try {
        const { id } = req.params;
        const { product_id, quantity, ...otherData } = req.body || {};

        // If updating specific product in cart
        if (product_id && quantity !== undefined) {
            const cart = await Cart.findById(id);
            if (!cart) {
                return res.status(404).json({ error: 'Cart not found' });
            }

            // Validate product before updating
            const product = await Product.findById(product_id)
                .populate('category_id')
                .populate('subcategory_id');

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            if (!product.active) {
                return res.status(400).json({ error: 'Product is not active' });
            }

            if (!product.category_id || !product.category_id.active) {
                return res.status(400).json({ error: 'Product category is not active' });
            }

            if (!product.subcategory_id || !product.subcategory_id.active) {
                return res.status(400).json({ error: 'Product subcategory is not active' });
            }

            if (product.stock < quantity) {
                return res.status(400).json({ error: 'Insufficient stock available' });
            }

            // Find and update specific product in cart
            const productIndex = cart.products.findIndex(p =>
                p.product_id.toString() === product_id
            );

            if (productIndex === -1) {
                return res.status(404).json({ error: 'Product not found in cart' });
            }

            cart.products[productIndex].quantity = quantity;
            await cart.save();

            const updatedCart = await Cart.findById(id)
                .populate('user_id')
                .populate('products.product_id');

            return res.status(200).json(addDiscountPriceToCart(updatedCart));
        }

        // For full cart update (existing functionality)
        const updatedCart = await Cart.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        )
            .populate('user_id')
            .populate('products.product_id');

        if (!updatedCart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        res.status(200).json(addDiscountPriceToCart(updatedCart));
    } catch (error) {
        console.error('Cart update error:', error);
        res.status(400).json({ error: error.message });
    }
};

// Delete a cart by ID
exports.deleteCart = async (req, res) => {
    try {
        const deletedCart = await Cart.findByIdAndDelete(req.params.id);
        if (!deletedCart) return res.status(404).json({ error: 'Cart not found' });
        res.status(200).json({ message: 'Cart deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add or update product in cart
exports.addOrUpdateProduct = async (req, res) => {
    try {
        const { user_id, product_id, quantity } = req.body;

        // Check if product exists and is active
        const product = await Product.findById(product_id)
            .populate('category_id')
            .populate('subcategory_id');

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (!product.active) {
            return res.status(400).json({ error: 'Product is not active' });
        }

        // Check if category and subcategory are active
        if (!product.category_id || !product.category_id.active) {
            return res.status(400).json({ error: 'Product category is not active' });
        }

        if (!product.subcategory_id || !product.subcategory_id.active) {
            return res.status(400).json({ error: 'Product subcategory is not active' });
        }

        // Check stock availability
        if (product.stock < (quantity || 1)) {
            return res.status(400).json({ error: 'Insufficient stock available' });
        }

        let cart = await Cart.findOne({ user_id });
        const qtyToAdd = quantity ? Number(quantity) : 1;

        if (!cart) {
            cart = new Cart({ user_id, products: [{ product_id, quantity: qtyToAdd }] });
        } else {
            const productIndex = cart.products.findIndex(p => p.product_id.toString() === product_id);
            if (productIndex > -1) {
                const newQuantity = (cart.products[productIndex].quantity || 0) + qtyToAdd;
                if (newQuantity > product.stock) {
                    return res.status(400).json({ error: 'Insufficient stock available' });
                }
                cart.products[productIndex].quantity = newQuantity;
            } else {
                cart.products.push({ product_id, quantity: qtyToAdd });
            }
        }

        const savedCart = await cart.save();
        const populatedCart = await Cart.findById(savedCart._id)
            .populate('user_id')
            .populate('products.product_id');

        res.status(200).json(addDiscountPriceToCart(populatedCart));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Remove product from cart
exports.removeProduct = async (req, res) => {
    try {
        const { user_id, product_id } = req.body;
        const cart = await Cart.findOne({ user_id });
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        cart.products = cart.products.filter(p => p.product_id.toString() !== product_id);
        await cart.save();

        const updatedCart = await Cart.findById(cart._id)
            .populate('user_id')
            .populate('products.product_id');

        res.status(200).json(addDiscountPriceToCart(updatedCart));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update product quantity in cart
exports.updateProductQuantity = async (req, res) => {
    try {
        const { user_id, product_id, quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: 'Quantity must be at least 1' });
        }

        // Check if product exists and is active
        const product = await Product.findById(product_id);
        if (!product || !product.active) {
            return res.status(400).json({ error: 'Product not available' });
        }

        // Check stock availability
        if (product.stock < quantity) {
            return res.status(400).json({ error: 'Insufficient stock available' });
        }

        const cart = await Cart.findOne({ user_id });
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        const productIndex = cart.products.findIndex(p => p.product_id.toString() === product_id);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        cart.products[productIndex].quantity = quantity;
        await cart.save();

        const updatedCart = await Cart.findById(cart._id)
            .populate('user_id')
            .populate('products.product_id');

        res.status(200).json(addDiscountPriceToCart(updatedCart));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Clear cart
exports.clearCart = async (req, res) => {
    try {
        const { user_id } = req.body;
        const cart = await Cart.findOne({ user_id });
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        cart.products = [];
        await cart.save();

        res.status(200).json({ message: 'Cart cleared successfully', cart });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get user's cart
exports.getUserCart = async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await Cart.find({ user_id: id })
            .populate('products.product_id');

        if (!cart) {
            return res.status(400).json({ status: true, message: 'Cart not found' });
        }

        res.status(200).json(addDiscountPriceToCart(cart));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 