const mongoose = require("mongoose")
const Order = require("./order")

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: String,
    quantity: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Category"
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        required: true
    },
    discount: Number,
    offerPrice: Number,
    description: {
        type: String,
        required: true
    },
    rating: {
        type: [Number]
    },
    // reviews: [reviewSchema],
    avgRating: {
        type: Number,
        required: true,
        default: 0
    },
    totalReviews: {
        type: Number,
        required: true,
        default: 0
    },
    productImagePath: [String],
    
}, { timestamps: true })

productSchema.pre("remove", function (next) {
    Order.find({ product: this.id }, (err, orders) => {
        if (err) {
            next(err)
        } else if (oreders.length > 0) {
            next(new Error("This item Can't be deleted"))
        }
    })
})