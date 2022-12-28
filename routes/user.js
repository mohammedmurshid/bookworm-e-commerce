const express = require("express")
const userControl = require("../controllers/userController")
const authentication = require("../middleware/authentication")
const wishlistControl = require("../controllers/wishlistController")
const cartControl = require("../controllers/cartController")
const shopControl = require("../controllers/shopController")
const orderControl =require("../controllers/orderController")
const paymentControl = require("../controllers/paymentController")
const couponControl = require("../controllers/couponController")
const router = express.Router()

router.use(authentication.checkLoggedIn, authentication.checkAccountVerified)

router.get("/profile",userControl.getProfile)
router.get("/wishlist", wishlistControl.wishlist)
router.get("/cart", cartControl.getCart)
router.get("/checkout", cartControl.getCheckout)
router.get("/myOrders", shopControl.myOrders)
router.get("/myOrders/:id", shopControl.orderDetails)
router.get("/cartItemCount",cartControl.cartItemCount)
router.get("/wishlistItemCount",wishlistControl.wishlistItemCount)


router.post("/addRating/:id",userControl.addRating)
router.post("/createAddress",userControl.createAddress)
router.post("/payment/orderId",paymentControl.generateOrder)
router.post("/payment/verify/:orderId",paymentControl.verifyPayment)
router.post("/payment/:id/refund",paymentControl.refund)
router.post("/checkout", orderControl.checkout)
router.post("/redeem/:id",couponControl.redeem)

router.put("/cancelOrder/:id", orderControl.cancelOrder)
router.put("/wishlist/:id", wishlistControl.addToWishlist)
router.put("/addToCart/:id", cartControl.addToCart)
// router.put("/setPassword", userControl.setPassword)
// router.put("/changePassword", userControl.changePassword)

router.delete("/removeCoupon",couponControl.removeCoupon)
router.delete("/cart/:id", cartControl.deleteItem)
router.delete("/deleteAddress/:index",userControl.removeAddress)

module.exports = router