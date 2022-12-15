const express = require("express")
const router = express.Router()


router.get("/register", (req, res) => {
    res.render("master/register")
})
router.get("/login", (req, res) => {
    res.render("master/login")
})

module.exports = router