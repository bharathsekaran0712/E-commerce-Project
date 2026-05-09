const express = require('express')
const {createNewOrder,getOrderDetails,getAllOrders, placeOrder, updateOrderStatus,cancelOrder} = require('../controllers/orderController')
const userMiddleware = require("../middleware/userMiddleware")
const router = express.Router()

router.post("/new/order",userMiddleware,createNewOrder)
router.get("/order/:id",userMiddleware,getOrderDetails)
router.post("/orders/user",userMiddleware,getAllOrders)
router.post("/order/status",userMiddleware,updateOrderStatus)
router.post("/order/cancel", userMiddleware, cancelOrder);



module.exports = router