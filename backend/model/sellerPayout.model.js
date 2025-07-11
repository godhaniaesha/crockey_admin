const mongoose = require('mongoose');

const sellerPayoutSchema = mongoose.Schema({
    order_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Order', 
        required: true 
    },
    seller_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Register', 
        required: true 
    },
    buyer_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Register', 
        required: true 
    },
    products: [{
        product_id: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product', 
            required: true 
        },
        quantity: { 
            type: Number, 
            required: true 
        },
        priceAtOrder: { 
            type: Number, 
            required: true 
        },
        totalPrice: { 
            type: Number, 
            required: true 
        }
    }],
    totalAmount: { 
        type: Number, 
        required: true 
    },
    commission: { 
        type: Number, 
        default: 0 
    },
    sellerAmount: { 
        type: Number, 
        required: true 
    },
    payoutStatus: { 
        type: String, 
        enum: ['pending', 'paid', 'failed'], 
        default: 'pending' 
    },
    payoutDate: { 
        type: Date 
    },
    orderStatus: { 
        type: String, 
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], 
        default: 'pending' 
    }
}, { timestamps: true });

module.exports = mongoose.model('SellerPayout', sellerPayoutSchema); 