const express = require("express")
const registerControllers = require("../controllers/userController")

const router = express.Router()

router.post("/register",registerControllers.registerUser)
router.post("/login",registerControllers.loginUser)

module.exports = router