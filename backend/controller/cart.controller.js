const Cart = require('../model/cart.model');

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
        res.status(200).json(carts);
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
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a cart by ID
exports.updateCart = async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate('user_id')
            .populate('products.product_id');
        if (!updatedCart) return res.status(404).json({ error: 'Cart not found' });
        res.status(200).json(updatedCart);
    } catch (error) {
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
        let cart = await Cart.findOne({ user_id });
        const qtyToAdd = quantity ? Number(quantity) : 1;
        if (!cart) {
            cart = new Cart({ user_id, products: [{ product_id, quantity: qtyToAdd }] });
        } else {
            const productIndex = cart.products.findIndex(p => p.product_id.toString() === product_id);
            if (productIndex > -1) {
                cart.products[productIndex].quantity = (cart.products[productIndex].quantity || 0) + qtyToAdd;
            } else {
                cart.products.push({ product_id, quantity: qtyToAdd });
            }
        }
        const savedCart = await cart.save();
        res.status(200).json(savedCart);
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
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}; 