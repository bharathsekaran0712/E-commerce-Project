const express = require("express")
const { getSingleProduct, getAllProducts, addProducts, updateProduct, deleteProduct } = require("../controllers/productController")
const router = express.Router()

router.route("/products").get(getAllProducts).post(addProducts)
router.route("/product/:id").get(getSingleProduct).put(updateProduct).delete(deleteProduct)

module.exports = router