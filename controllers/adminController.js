const User = require("../models/users")
const Category = require("../models/category")
const Product = require("../models/product")

module.exports = {
    // to render home page / dashboard of admin panel
    home: async (req, res) => {
        try {
            const errorMessage = req.flash("message")
            const userCount = await User.find({ isAdmin: false }).countDocuments()
            
            res.render("admin/home", {
                errorMessage: errorMessage,
                layout: "layouts/adminLayout",
                userCount: userCount,
            })
        } catch (err) {
            console.log(err.message);
            res.redirect("/admin")
        }
    },

    // to show user management
    users: async (req, res) => {
        try {
            const errorMessage = req.flash("message")
            const users = await User.find({}).sort({ createdAt: -1 }).exec()
            res.render("admin/userManagement", {
                users: users,
                errorMessage: errorMessage,
                layout: "layouts/adminLayout"
            })
        } catch (err) {
            console.log(err.message)
            res.redirect("/admin")
        }
    },

    // to block user
    blockUser: async (req, res) => {
        try {
            await User.findByIdAndUpdate(req.params.id, { isActive: false })
            res.redirect("/admin/users")
        } catch (err) {
            console.log(err.message)
            req.flash("message", "error blocking user")
            res.redirect("/admin/users")
        }
    },

    // to unblock user
    unblockUser: async (req, res) => {
        try {
            await User.findByIdAndUpdate(req.params.id, { isActive: true })
            res.redirect("/admin/users")
        } catch (err) {
            console.log(err.message)
            req.flash("message", "error unblocking user")
            res.redirect("/admin/users")
        }
    },

    // to see all categories
    categories: async (req, res) => {
        try {
            const errorMessage = req.flash("message")
            const allCategories = await Category.find().sort({ categoryName: 1 }).exec()
            res.render("admin/categoryManagement", {
                allCategories: allCategories,
                errorMessage: errorMessage,
                layout: "layouts/adminLayout"
            })
        } catch (err) {
            console.log(err.message)
            res.redirect("/admin")
        }
    },

    // to see all products
    products: async (req, res) => {
        try {
            const errorMessage = req.flash("message")
            const allCategories = await Category.find().sort({ categoryName: 1 }).exec()
            const allProducts = await Product.find().populate("category").sort({ createdAt: -1 }).exec()

            res.render("admin/productManagement", {
                allCategories: allCategories,
                allProducts: allProducts,
                errorMessage: errorMessage,
                layout: "layouts/adminLayout"
            })
        } catch (err) {
            console.log(err.message)
            res.redirect("/admin")
        }
    },
}