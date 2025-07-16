const Order = require('../model/order.model');
const Cart = require('../model/cart.model');
const Product = require('../model/product.model');
const SellerPayout = require('../model/sellerPayout.model');
const Register = require('../model/register.model');

// Helper to add discountPrice to product(s)
function addDiscountPrice(product) {
    if (!product) return product;
    const p = product.toObject ? product.toObject() : { ...product };
    const price = p.price || 0;
    const discount = p.discount || 0;
    p.discountPrice = price - (price * discount / 100);
    return p;
}
function addDiscountPriceToOrder(order) {
    if (!order) return order;
    const o = order.toObject ? order.toObject() : { ...order };
    if (Array.isArray(o.products)) {
        o.products = o.products.map(item => {
            if (item.product_id) {
                item.product_id = addDiscountPrice(item.product_id);
            }
            return item;
        });
    }
    return o;
}
function addDiscountPriceToOrders(orders) {
    return orders.map(addDiscountPriceToOrder);
}

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
        
        // Group products by seller
        const sellerGroups = {};
        
        for (const item of cart.products) {
            if (!item.product_id) continue;
            if (item.product_id.stock < item.quantity) {
                return res.status(400).json({ error: `Insufficient stock for product: ${item.product_id.name}` });
            }
            
            const productTotal = item.product_id.price * item.quantity;
            totalAmount += productTotal;
            
            orderProducts.push({
                product_id: item.product_id._id,
                quantity: item.quantity,
                priceAtOrder: item.product_id.price
            });
            
            // Group by seller
            const sellerId = item.product_id.user_id.toString();
            if (!sellerGroups[sellerId]) {
                sellerGroups[sellerId] = {
                    seller_id: item.product_id.user_id,
                    products: [],
                    totalAmount: 0
                };
            }
            
            sellerGroups[sellerId].products.push({
                product_id: item.product_id._id,
                quantity: item.quantity,
                priceAtOrder: item.product_id.price,
                totalPrice: productTotal
            });
            sellerGroups[sellerId].totalAmount += productTotal;
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
        
        // Create seller payouts and update seller income
        const sellerPayouts = [];
        for (const sellerId in sellerGroups) {
            const group = sellerGroups[sellerId];
            const commission = group.totalAmount * 0.10; // 10% commission
            const sellerAmount = group.totalAmount - commission;
            
            // Update seller's income in register model
            await Register.findByIdAndUpdate(
                group.seller_id,
                { $inc: { income: sellerAmount } }
            );
            
            const payout = new SellerPayout({
                order_id: savedOrder._id,
                seller_id: group.seller_id,
                buyer_id: user_id,
                products: group.products,
                totalAmount: group.totalAmount,
                commission: commission,
                sellerAmount: sellerAmount
            });
            
            sellerPayouts.push(await payout.save());
        }
        
        // Clear only ordered products from cart
        const orderedProductIds = orderProducts.map(p => p.product_id.toString());
        cart.products = cart.products.filter(item => !orderedProductIds.includes(item.product_id._id.toString()));
        await cart.save();
        
        res.status(201).json({
            order: savedOrder,
            sellerPayouts: sellerPayouts
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get seller's payouts
exports.getSellerPayouts = async (req, res) => {
    try {
        const sellerId = req.user._id;
        const payouts = await SellerPayout.find({ seller_id: sellerId })
            .populate('order_id')
            .populate('buyer_id', 'username email phone_number')
            .populate('products.product_id')
            .sort({ createdAt: -1 });
        
        res.status(200).json(payouts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update payout status (admin only)
exports.updatePayoutStatus = async (req, res) => {
    try {
        const { payoutStatus } = req.body;
        const payout = await SellerPayout.findByIdAndUpdate(
            req.params.id,
            { 
                payoutStatus,
                payoutDate: payoutStatus === 'paid' ? new Date() : null
            },
            { new: true }
        );
        
        if (!payout) return res.status(404).json({ error: 'Payout not found' });
        res.status(200).json(payout);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all payouts (admin only)
exports.getAllPayouts = async (req, res) => {
    try {
        const payouts = await SellerPayout.find()
            .populate('seller_id', 'username email')
            .populate('buyer_id', 'username email')
            .populate('order_id')
            .populate('products.product_id')
            .sort({ createdAt: -1 });
        
        res.status(200).json(payouts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get seller income and withdrawal info
exports.getSellerIncome = async (req, res) => {
    try {
        const sellerId = req.user._id;
        const seller = await Register.findById(sellerId).select('income withdrawn bankDetails');
        
        if (!seller) {
            return res.status(404).json({ error: 'Seller not found' });
        }
        
        res.status(200).json({
            income: seller.income,
            withdrawn: seller.withdrawn,
            availableBalance: seller.income - seller.withdrawn,
            bankDetails: seller.bankDetails
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update seller bank details
exports.updateBankDetails = async (req, res) => {
    try {
        const sellerId = req.user._id;
        const { accountHolder, accountNumber, bankName, ifscCode } = req.body;
        
        const seller = await Register.findByIdAndUpdate(
            sellerId,
            { 
                bankDetails: { accountHolder, accountNumber, bankName, ifscCode }
            },
            { new: true }
        );
        
        if (!seller) {
            return res.status(404).json({ error: 'Seller not found' });
        }
        
        res.status(200).json({
            message: 'Bank details updated successfully',
            bankDetails: seller.bankDetails
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Request withdrawal
exports.requestWithdrawal = async (req, res) => {
    try {
        const sellerId = req.user._id;
        const { amount } = req.body;
        
        const seller = await Register.findById(sellerId);
        if (!seller) {
            return res.status(404).json({ error: 'Seller not found' });
        }
        
        const availableBalance = seller.income - seller.withdrawn;
        if (availableBalance < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }
        
        if (!seller.bankDetails || !seller.bankDetails.accountNumber) {
            return res.status(400).json({ error: 'Please update your bank details first' });
        }
        
        // Update withdrawn amount
        await Register.findByIdAndUpdate(
            sellerId,
            { $inc: { withdrawn: amount } }
        );
        
        res.status(200).json({
            message: 'Withdrawal request submitted successfully',
            amount: amount,
            newBalance: availableBalance - amount
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all sellers income (admin only)
exports.getAllSellersIncome = async (req, res) => {
    try {
        const sellers = await Register.find({ role: 'seller' })
            .select('username email income withdrawn bankDetails createdAt')
            .sort({ income: -1 });
        
        res.status(200).json(sellers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get seller's product orders
exports.getSellerOrders = async (req, res) => {
    try {
        const sellerId = req.user._id;
        
        // First, get all products owned by this seller
        const sellerProducts = await Product.find({ user_id: sellerId }).select('_id');
        const sellerProductIds = sellerProducts.map(product => product._id);
        
        // Find orders that contain any of the seller's products
        const orders = await Order.find({
            'products.product_id': { $in: sellerProductIds }
        })
        .populate('user_id', 'username email phone_number') // Buyer info
        .populate('products.product_id') // Product details
        .sort({ createdAt: -1 }); // Most recent first
        
        // Filter and format the response to show only seller's products in each order
        const formattedOrders = orders.map(order => {
            const sellerProductIdStrings = sellerProductIds.map(id => id.toString());
            const sellerProductsInOrder = order.products.filter(product => {
                const prodId = product.product_id._id ? product.product_id._id.toString() : product.product_id.toString();
                return sellerProductIdStrings.includes(prodId);
            });
            
            const totalSellerAmount = sellerProductsInOrder.reduce((sum, product) => 
                sum + (product.priceAtOrder * product.quantity), 0
            );
            
            return {
                _id: order._id,
                buyer: order.user_id,
                sellerProducts: sellerProductsInOrder,
                totalSellerAmount,
                orderStatus: order.orderStatus,
                paymentStatus: order.paymentStatus,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            };
        });
        
        res.status(200).json(formattedOrders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user's own orders
exports.getUserOrders = async (req, res) => {
    try {
        console.log(req.user,'req.user');
        const userId = req.user._id; // From JWT token - user object has _id property
        
        const orders = await Order.find({ user_id: userId })
            .populate('products.product_id')
            .sort({ createdAt: -1 }); // Most recent first
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all orders (optionally filter by user)
exports.getAllOrders = async (req, res) => {
    try {
        const filter = {};
        if (req.query.user) filter.user_id = req.query.user;
        const orders = await Order.find(filter)
        .populate('user_id')
        .populate({
            path: 'products.product_id',
            populate: {
                path: 'user_id', // This is the seller!
                model: 'Register'
            }
        });
        res.status(200).json(addDiscountPriceToOrders(orders));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        console.log(req.user,'req.user');
        const userId = req.user._id;
        const order = await Order.findById(req.params.id)
            .populate('products.product_id');
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.status(200).json(addDiscountPriceToOrder(order));
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