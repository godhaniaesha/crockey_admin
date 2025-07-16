const Order = require('../model/order.model');
const Product = require('../model/product.model');
const Category = require('../model/category.model');
const Register = require('../model/register.model');

// Dashboard summary
exports.summary = async (req, res) => {
    try {
        let orderMatch = {};
        let productMatch = {};
        console.log(req.user,'req.user');
        
        if (req.user.role !== 'admin') {
            // Only seller's products
            productMatch = { user_id: req.user._id };
            // Get all product IDs for this seller
            const sellerProducts = await Product.find(productMatch, '_id');
            const sellerProductIds = sellerProducts.map(p => p._id);
            // Only orders containing this seller's products
            orderMatch = { 'products.product_id': { $in: sellerProductIds } };
        }
        // Orders aggregation
        const ordersAgg = await Order.aggregate([
            { $unwind: '$products' },
            { $match: orderMatch },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalAmount' },
                    count: { $sum: 1 }
                }
            }
        ]);
        // Products count
        const totalProducts = await Product.countDocuments(productMatch);

        res.json({
            totalSales: ordersAgg[0]?.total || 0,
            totalOrders: ordersAgg[0]?.count || 0,
            totalRevenue: ordersAgg[0]?.total || 0,
            totalProducts
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Sales overview (monthly sales for current year)
exports.salesOverview = async (req, res) => {
    try {
        const year = new Date().getFullYear();
        let match = { createdAt: { $gte: new Date(year, 0, 1), $lt: new Date(year + 1, 0, 1) } };

        if (req.user.role !== 'admin') {
            // Only seller's products
            const sellerProducts = await Product.find({ user_id: req.user._id }, '_id');
            const sellerProductIds = sellerProducts.map(p => p._id);
            match['products.product_id'] = { $in: sellerProductIds };
        }

        const sales = await Order.aggregate([
            { $unwind: '$products' },
            { $match: match },
            { $group: {
                _id: { $month: '$createdAt' },
                total: { $sum: '$totalAmount' },
                count: { $sum: 1 }
            } },
            { $sort: { '_id': 1 } }
        ]);
        // Fill missing months
        const monthly = Array(12).fill(0).map((_, i) => {
            const found = sales.find(s => s._id === i + 1);
            return { month: i + 1, total: found ? found.total : 0, count: found ? found.count : 0 };
        });
        res.json(monthly);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Category distribution
exports.categoryDistribution = async (req, res) => {
    try {
        let match = {};
        if (req.user.role !== 'admin') {
            match = { user_id: req.user._id };
        }
        const dist = await Product.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$category_id",
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    category: { $ifNull: ["$category.name", "Unknown"] },
                    count: 1
                }
            }
        ]);
        res.json(dist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Top products by sales count
exports.topProducts = async (req, res) => {
    try {
        let match = {};
        if (req.user.role !== 'admin') {
            match = { user_id: req.user._id };
        }

        // Get product IDs for this seller
        const sellerProducts = await Product.find(match, '_id name');
        const sellerProductIds = sellerProducts.map(p => p._id);

        const top = await Order.aggregate([
            { $unwind: '$products' },
            { $match: req.user.role === 'admin' ? {} : { 'products.product_id': { $in: sellerProductIds } } },
            {
                $group: {
                    _id: '$products.product_id',
                    sales: { $sum: '$products.quantity' }
                }
            },
            { $sort: { sales: -1 } },
            { $limit: 5 }
        ]);

        // If no sales yet
        let result = [];
        if (top.length === 0) {
            // Just show first 5 products with 0 sales
            result = sellerProducts.slice(0, 5).map((p, i) => ({
                rank: i + 1,
                name: p.name,
                sales: 0
            }));
        } else {
            const products = await Product.find({ _id: { $in: top.map(t => t._id) } });
            result = top.map((t, i) => ({
                rank: i + 1,
                name: products.find(p => p._id.equals(t._id))?.name || 'Unknown',
                sales: t.sales
            }));
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Recent activities (mocked for now)
exports.recentActivities = async (req, res) => {
    res.json([
        { type: 'order', message: 'Order #1234 placed by John Doe', time: '2 min ago' },
        { type: 'product', message: 'Product iPhone 14 stock updated', time: '10 min ago' },
        { type: 'customer', message: 'New customer Alice Brown registered', time: '30 min ago' },
        { type: 'order', message: 'Order #1233 canceled by Bob Lee', time: '1 hr ago' },
        { type: 'target', message: 'Monthly sales target achieved', time: '2 hr ago' }
    ]);
};

// Sales target (mocked for now)
exports.salesTarget = async (req, res) => {
    res.json({
        target: 48000,
        achieved: 44600,
        progress: 92.9
    });
}; 