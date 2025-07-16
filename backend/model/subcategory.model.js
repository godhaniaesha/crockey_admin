const mongoose = require('mongoose');

const subcategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    image: {
        type: String // stores uploaded image filename
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Add a case-insensitive unique index for name
subcategorySchema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

module.exports = mongoose.model('Subcategory', subcategorySchema); 