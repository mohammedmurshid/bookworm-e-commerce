const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                requied: true
            },
            name: String,
            quantity: Number,
            price: Number,
            offerPrice: Number
        }
    ],
    subTotal: {
        type: Number
    },
    total: {
        type: Number,
        default: 0,
        requied: true
    }
}, { timestamps: true })

module.exports = mongoose.model("Cart", cartSchema)