const express = require('express')
const { getOrderDetails, getAllOders } = require('../controllers/orderController')
const router = express.Router()

router.route("/new/order").post(createNewOrder)
router.route("/order/:id").get(getOrderDetails)
router.route("/orders/user").get(getAllOders)


module.exports = router