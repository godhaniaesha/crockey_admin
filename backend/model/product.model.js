const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    short_description: {
        type: String
    },
    long_description: {
        type: String
    },
    brand: {
        type: String
    },
    weight: {
        type: String
    },
    discount: {
        type: Number
    },
    pattern: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    colors: [{
        type: String
    }],
    sizes: [{
        type: String
    }],
    images: [{
        type: String
    }],
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Register",
        required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    subcategory_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    lowstock: {
        type: Number,
        default: 5
    }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
