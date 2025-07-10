const mongoose = require("mongoose");

const registerSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "seller", "user"],
        default: "user"
    }
}, { timestamps: true })

module.exports = mongoose.model("Register", registerSchema);
