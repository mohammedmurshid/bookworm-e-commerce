const _ = require("lodash")
const Product = require("../models/product")
const Category = require("../models/category")

module.exports = {
    getHome: async (req, res) => {
        try {
            const allCategories = await Category.find()
            const latestProducts = await Product.find().sort({ createdAt: -1 }).limit(6).exec()
            const featuredProducts = await Product.find({ isFeatured: true }).populate("category").sort({ createdAt: -1 }).exec()

            res.render("master/home", {
                allCategories: allCategories,
                featuredProducts: featuredProducts,
                latestProducts: latestProducts
            })
        } catch (err) {
            console.log(err);
            res.render("errorPage/error", { layout: false })
        }
    }
}