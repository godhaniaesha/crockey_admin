const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Register', required: true },
    products: [{
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        priceAtOrder: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    paymentType: { type: String, enum: ['cod', 'online','paypal'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    orderStatus: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    shippingAddress: { type: String, required: true },
    paymentDetails: {
        cardHolder: String,
        cardNumber: String, // WARNING: Never store in production!
        expiry: String,
        cardType: String,
        // NEVER store CVV
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema); 