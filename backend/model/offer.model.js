const mongoose = require('mongoose');

const offerSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    discount: {
        type: Number,
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    active: {
        type: Boolean,
        default: true
    },
    expiresAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema); 