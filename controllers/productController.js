const Product = require("../models/product")
const fs = require("fs").promises
module.exports = {
// to add products
    addProduct: async (req, res) => {
        try {
            const price = parseFloat(req.body.price)
            const discount = req.body.discount ? parseFloat(req.body.discount) : null
            const offerPrice = req.body.discount ? price - ((price / 100) * discount) : null
            const isFeatured = req.body.isFeatured == 'on' ? true : false
            const productImages = req.files != null ? req.files.map((img) => img.fileName) : null
            const product = new Product({
                name: req.body.name,
                brand: req.body.brand,
                category: req.body.category,
                quantity: req.body.quantity,
                price: price,
                discount: discount,
                offerPrice: offerPrice,
                isFeatured: isFeatured,
                description: req.body.description,
                productImagePath:productImages,
            })
            await product.save()
            res.redirect("/admin/products")
        } catch (err) {
            console.log(err);
            req.flash("message", "Error Adding Product")
            res.redirect("/admin/products")
        }
    },

    // to edit products
    editProduct: async (req, res) => {
        let product
        try {
            product = await Product.findById(req.params.id)
            const price = parseFloat(req.body.price)
            const discount = req.body.discount ? parseFloat(req.body.discount) : null
            const offerPrice = req.body.discount ? price - ((price / 100) * discount) : null;
            const isFeatured = req.body.isFeatured == "on" ? true : false
            const oldProductImages = product.productImagePath
            const productImages = req.files.length > 0 ? req.files.map((img) => img.fileName) : oldProductImages
            await Product.findByIdAndUpdate(req.params.id, {
                name: req.body.name,
                brand: req.body.brand,
                category: req.body.category,
                quantity: req.body.quantity,
                price: price,
                discount: discount,
                offerPrice: offerPrice,
                isFeatured: isFeatured,
                description: req.body.description,
                productImagePath:productImages,
            })

            // removing old product images
            if (req.files.length > 0) {
                oldProductImages.forEach(async (image) => {
                    await fs.unlink("./public/files/" + image)
                })
            }
            res.redirect("/admin/products")
        } catch (err) {
            console.log(err);
            req.flash("message", "Error Updating Product")
            res.redirect("/admin/products")
        }
    },

    // to soft delete products
    deleteProduct: async (req, res) => {
        try {
            await Product.findByIdAndUpdate(req.params.id, { isDeleted: true })
            res.redirect("/admin/products")
        } catch (err) {
            console.log(err);
            req.flash("message", "Error Deleting Product")
            res.redirect("/admin/products")
        }
    }
}