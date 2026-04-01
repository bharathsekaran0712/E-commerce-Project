const express = require('express')
const {createNewOrder,getOrderDetails,getAllOrders} = require('../controllers/orderController')
const userMiddleware = require("../middleware/userMiddleware")
const router = express.Router()

router.post("/new/order",userMiddleware,createNewOrder)
router.get("/order/:id",userMiddleware,getOrderDetails)
router.get("/orders/user",userMiddleware,getAllOrders)



module.exports = router