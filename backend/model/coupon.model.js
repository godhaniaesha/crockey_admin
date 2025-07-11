const mongoose = require('mongoose');

const couponSchema = mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discount: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },
    expiresAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema); 