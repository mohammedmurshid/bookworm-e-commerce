const express = require("express");
const router = express.Router();
const passport = require("passport")
const Category = require("../models/category")
const userControl = require("../controllers/userController")
const shopControl = require("../controllers/shopController")
const authentication = require("../middleware/authentication")
const {
    otpVerification,
    getOtpForm,
    sendOtp
} = require("../middleware/otp");

router.get("/otp", (req, res) => {res.render("optValidationForm")})

router.get("/", authentication.checkAccountVerifiedInIndex, shopControl.getHome)
router.get("/shop/category/:category/:page", authentication.checkAccountVerifiedInIndex, shopControl.getShopByCategory)
router.get("/shop/:page", authentication.checkAccountVerifiedInIndex, shopControl.getAllProducts)
router.get("/product/:id", authentication.checkAccountVerifiedInIndex, shopControl.getProductById)
router.get("/search/:page", authentication.checkAccountVerifiedInIndex, shopControl.getProductByKeyword)
router.get("/contact", authentication.checkAccountVerifiedInIndex, async (req, res) => {
    const allCategories = await Category.find()
    res.render("master/contact", {
        allCategories: allCategories
    })
})

router.get("/login", authentication.checkLoggedOut, async (req, res) => {
    const allCategories = await Category.find();
    const errorMessage = req.flash("error")
    res.render("master/login", {
        errorMessage: errorMessage,
        allCategories: allCategories,
        layout: false
    })
})
router.get("/register", authentication.checkLoggedOut, async (req, res) => {
    const errorMessage = req.flash("message")
    const allCategories = await Category.find();
    res.render("master/register", {
        errorMessage: errorMessage,
        allCategories: allCategories,
        layout: false
    })
})

router.get("/error", (req, res) => {
    res.render("errorPage/error", { layout: false })
})

router.post("/autoFill", shopControl.autoFill)
router.post("/validateOtp", otpVerification)

router.post("/resendOtp", async (req, res) => {
    getOtpForm(req, res)
    await sendOtp(req, res)
    req.flash("message", "Otp resend successful")
})
router.post("/login", userControl.userLogin, (req, res) => {
    if (req.user.isAdmin === true) {
        res.redirect("/admin")
    }
    else {
        res.redirect("/")
    }
})
router.post("/register", userControl.userRegister)

router.post('/logout', userControl.userLogout)

module.exports = router