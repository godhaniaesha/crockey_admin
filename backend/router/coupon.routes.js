const express = require('express');
const router = express.Router();
const {
    createCoupon,
    getAllCoupons,
    getCouponById,
    updateCoupon,
    deleteCoupon
} = require('../controller/coupon.controller');

// Create
router.post('/', createCoupon);
// Read all
router.get('/', getAllCoupons);
// Read one
router.get('/:id', getCouponById);
// Update
router.put('/:id', updateCoupon);
// Delete
router.delete('/:id', deleteCoupon);

module.exports = router; 