const express = require('express');
const router = express.Router();
const {
    createCoupon,
    getAllCoupons,
    getCouponById,
    updateCoupon,
    deleteCoupon
} = require('../controller/coupon.controller');
const { requireAdmin } = require('../middleware/auth.middleware');

// All coupon management routes require admin access
router.post('/', requireAdmin, createCoupon);
router.get('/', getAllCoupons); // Public access for viewing coupons
router.get('/:id', getCouponById); // Public access for viewing coupon
router.put('/:id', requireAdmin, updateCoupon);
router.delete('/:id', requireAdmin, deleteCoupon);

module.exports = router; 