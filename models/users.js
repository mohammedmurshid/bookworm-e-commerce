const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

const addressSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    address1: {
        type: String,
        required: true
    },
    address2: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zipcode: {
        type: Number,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
})


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    address: {
        type: [addressSchema]
    },
    otp: {
        type: Number
    },    
}, {timestamps: true})

userSchema.plugin(passportLocalMongoose, {
    usernameField: "email",
    findByUsername: function (model, queryParameters) {
        // Add additional query parameter and condition isActive: true
        queryParameters.isActive = true;
        return model.findOne(queryParameters)
    }
})

module.exports = mongoose.model("User", userSchema)