const Coupon = require('../model/coupon.model');

// Create a new coupon
exports.createCoupon = async (req, res) => {
    try {
        const coupon = new Coupon(req.body);
        const savedCoupon = await coupon.save();
        res.status(201).json(savedCoupon);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all coupons
exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single coupon by ID
exports.getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
        res.status(200).json(coupon);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a coupon by ID
exports.updateCoupon = async (req, res) => {
    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedCoupon) return res.status(404).json({ error: 'Coupon not found' });
        res.status(200).json(updatedCoupon);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a coupon by ID
exports.deleteCoupon = async (req, res) => {
    try {
        const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!deletedCoupon) return res.status(404).json({ error: 'Coupon not found' });
        res.status(200).json({ message: 'Coupon deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 