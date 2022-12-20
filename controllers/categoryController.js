const _ = require("lodash")
const Category = require("../models/category")

module.exports = {
    // to add category
    addCategory: async (req, res) => {
        try {
            const category = new Category({
                categoryName: _.startCase(_.toLower(req.body.categoryName))
            })
            await category.save()
            res.redirect("/admin/categories")
        } catch (err) {
            console.log(err.message);
            req.flash("message", "category already exists")
            res.redirect("/admin/categories")
        }
    },
    
    // to edit category
    editCategory: async (req, res) => {
        try {
            await Category.findByIdAndUpdate(
                req.params.id, { categoryName: _.startCase(_.toLower(req.body.categoryName)) })
        } catch (err) {
            console.log(err.message);
            req.flash("message", "error editing category")
            res.redirect("/admin/categories")
        }
    },
    
    // to delete category
    deleteCategory: async (req, res) => {
        let category
        try {
            category = await Category.findById(req.params.id)
            category.remove()
            res.redirect("/admin/categories")
        } catch (err) {
            console.log(err.message);
            if (category == null) {
                res.redirect("/admin")
            }
            req.flash("message", err.message)
            res.redirect("/admin/categories")
        }
    },
}
