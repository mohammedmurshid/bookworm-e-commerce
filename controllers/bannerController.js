const Banner = require("../models/banner")
const _ = require("lodash")
const banner = require("../models/banner")

module.exports = {
    getBanner: async (req, res) => {
        try {
            const allBanners = await Banner.find().sort({ createdAt: -1 })
            const errorMessage = req.flash("message")
            res.render("admin/bannerManagement", {
                allBanners: allBanners,
                errorMessage: errorMessage,
                layout: "layouts/adminLayout"
            })
        } catch (err) {
            console.log(err);
            res.redirect("/admin")
        }
    },

    addBanner: async (req, res) => {
        try {
            const { title, viewOrder, caption, promoCoupon, url } = req.body
            const bannerImagePath = req.file != null ? req.file.fileName : null
            const newBanner = new Banner({
                title: _.startCase(_.toLower(title)),
                caption: caption?.toUpperCase(),
                viewOrder,
                url,
                bannerImagePath
            })
            await newBanner.save()
            res.redirect("/admin/banners")
        } catch (err) {
            req.flash("message", "Error creating banner.")
            res.redirect("/admin/banners")
            console.log(err)
        }
    },

    activate: async (req, res) => {
        try {
            const bannerId = req.params.id
            const myBanner = await Banner.findById(bannerId)
            if (myBanner.viewOrder == "primary") {
                const isExist = await Banner.findOne({ $and: [{ viewOrder: "primary" }, { isActive: true }] })
                if (isExist) {
                    return res.status(403).json({ message: "Can't activate multiple primary banners at same time" })
                }
            }
            myBanner.isActive = true
            await myBanner.save()
            res.status(201).json({ message: "Activated" })
        } catch (err) {
            console.log(err);
            res.status(500).json({ err })
        }
    },

    deactivate: async (req, res) => {
        try {
            const bannerId = req.params.id
            await Banner.findByIdAndUpdate(bannerId, { isActive: false })
            res.status(201).json({ message: "Deactivated" })
        } catch (err) {
            res.status(500).json({ err })
        }
    }
}