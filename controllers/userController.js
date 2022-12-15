const User = require("../models/users")
const Product = require("../models/product")
const passport = require("passport")
const Category = require("../models/category")
const sendOtp = require("../middleware/otp")

module.exports = {
    userRegister: (req, res, next) => {
        if (req.body.password === req.body.confirmedPassword) {
            User.register({
                name: req.body.name,
                email: req.body.email
            }, req.body.password, async function (err, user) {
                if (err) {
                    console.log(err)
                    req.flash("message", "User Already Registered")
                    res.redirect("/register")
                } else {
                    passport.authenticate("local")(req, res, function () {
                        process.nextTick(async () => {
                            await sendOtp(req, res)
                        })
                        res.redirect("/")
                    })
                }
            })
        } else {
            req.flash("message", "Password didn't match")
            res.redirect("/register")
        }
    },

    userLogin: passport.authenticate("local", {
        failureFlash: true,
        keepSessionInfo: true,
        failureRedirect: "/login"
    }),

    userLogout: (req, res) => {
        req.logout(function (err) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/")
            }
        })
    }, 

    getProfile: async (req, res) => {
        try {
            const userId = req.user.id
            const allCategories = await Category.find()
            const user = await User.findById(userId)
            res.render("master/profile", {
                allCategories: allCategories,
                user: user
            })
        } catch (err) {
            console.log(err);
        }
    },

    createAddress: async (req, res) => {
        try {
            const userId = req.user.id
            const user = await User.findById(userId)
            user.address.unshift({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                address1: req.body.address1,
                address2: req.body.address2,
                city: req.body.city,
                state: req.body.state,
                zipcode: req.body.zipcode,
                phone: req.body.phone
            })
            await user.save()
            res.status(201).json({ message: "New Address Created"})
        } catch (err) {
            console.log(err);
            res.status(500).json({ err })
        }
    },

    removeAddress: async (req, res) => {
        try {
            const addressIndex = Number(req.params.index)
            const user = await User.findById(req.user.id)
            user.address.splice(addressIndex, 1)
            await user.save()
            return res.status(204).json({ message: "Address Removed"})
        } catch (err) {
            console.log(err);
            res.status(500)
        }
    },

    addRating: async (req, res) => {
        try {
            const userId = req.user.id
            const { rating, review } = req.body
            const product = await Product.findById(req.params.id)
            const newReview = {
                name: req.user.name,
                userId: userId,
                rating: Number(rating),
                review
            }
            
            const foundIndex = product.reviews.findIndex(review => review.userId.toString() == userId)

            if (foundIndex > -1) {
                product.reviews[foundIndex] = newReview
            } else {
                product.reviews.push(newReview)
            }

            // Getting number of reviews
            product.totalReviews = product.reviews.length 
            // Getting average rating by dividing total of all rating by total number of rating
            product.avgRating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.totalReviews

            await product.save()
            res.status(201).json({ message: "Review Updated" })
        } catch (err) {
            console.log(err);
            res.status(500).json({ err })
        }
    }
}