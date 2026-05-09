const express = require("express")
const registerControllers = require("../controllers/userController")
const userMiddleware = require("../middleware/userMiddleware")
const {registerUser,loginUser,editUser} = require("../controllers/userController")

const router = express.Router()

router.post("/register",registerControllers.registerUser)
router.post("/login",registerControllers.loginUser)
router.post("/user/edit",userMiddleware,registerControllers.editUser)

module.exports = router