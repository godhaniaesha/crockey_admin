const Order = require('../model/order.model');
const Cart = require('../model/cart.model');
const Product = require('../model/product.model');

// Place a new order from cart
exports.placeOrder = async (req, res) => {
    try {
        const { user_id, paymentType, shippingAddress } = req.body;
        const cart = await Cart.findOne({ user_id }).populate('products.product_id');
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }
        let totalAmount = 0;
        const orderProducts = [];
        for (const item of cart.products) {
            if (!item.product_id) continue;
            if (item.product_id.stock < item.quantity) {
                return res.status(400).json({ error: `Insufficient stock for product: ${item.product_id.name}` });
            }
            totalAmount += item.product_id.price * item.quantity;
            orderProducts.push({
                product_id: item.product_id._id,
                quantity: item.quantity,
                priceAtOrder: item.product_id.price
            });
        }
        // Decrement stock
        for (const item of cart.products) {
            await Product.findByIdAndUpdate(item.product_id._id, { $inc: { stock: -item.quantity } });
        }
        // Create order
        const order = new Order({
            user_id,
            products: orderProducts,
            totalAmount,
            paymentType,
            shippingAddress
        });
        const savedOrder = await order.save();
        // Clear only ordered products from cart
        const orderedProductIds = orderProducts.map(p => p.product_id.toString());
        cart.products = cart.products.filter(item => !orderedProductIds.includes(item.product_id._id.toString()));
        await cart.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all orders (optionally filter by user)
exports.getAllOrders = async (req, res) => {
    try {
        const filter = {};
        if (req.query.user) filter.user_id = req.query.user;
        const orders = await Order.find(filter)
            .populate('user_id')
            .populate('products.product_id');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user_id')
            .populate('products.product_id');
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus },
            { new: true }
        );
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { paymentStatus } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { paymentStatus },
            { new: true }
        );
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus: 'cancelled' },
            { new: true }
        );
        if (!order) return res.status(404).json({ error: 'Order not found' });
        // Optionally: increment stock back for cancelled order
        for (const item of order.products) {
            await Product.findByIdAndUpdate(item.product_id, { $inc: { stock: item.quantity } });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}; 