const _ = require("lodash")
const User = require("../models/users")
const Category = require("../models/category")
const Product = require("../models/product")

module.exports = {
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
    }
}