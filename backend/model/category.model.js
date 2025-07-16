const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
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
categorySchema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

module.exports = mongoose.model("Category", categorySchema); 