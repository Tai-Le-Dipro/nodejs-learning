const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        maxLength: 10,
        minLength: 6,
        unique: true,
        require: true,
    },
    email: {
        type: String,
        maxLength: 16,
        minLength: 6,
        unique: true,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    is_admin: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema);