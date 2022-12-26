const express = require("express")
const router = express.Router()
const Category = require("../models/category")
const userController = require("../controllers/userController")
const shopController = require("../controllers/shopController")
const authentication = require("../middleware/authentication")
const {
    otpVerification,
    getOtpForm,
    sendOtp
} = require("../middleware/otp")

router.get("/otp", (req, res) => res.render("otpValidationForm"))


router.get("/", authentication.checkAccountVerifiedInIndex, shopController.getHome)
router.get("/register", (req, res) => {
    res.render("master/register", {
        layout: false
    })
})
router.get("/login", authentication.checkLoggedOut, async (req, res) => {
    const allCategories = await Category.find()
    const errorMessage = req.flash("error")
    res.render("master/login", {
        allCategories: allCategories,
        message: errorMessage,
        layout: false
    })
})

router.post("/register", userController.userRegister)
router.post("/login", userController.userLogin, (req, res) => {
    if (req.user.isAdmin === true) {
        res.redirect("/admin")
    } else {
        res.redirect("/")
    }
})

module.exports = router