const express = require("express")
const productController = require("../controllers/productController")
const searchController = require("../controllers/searchController")
const router = express.Router()

router.get("/products/getAllProducts",productController.getAllProducts)

router.get("/product/:id",productController.getSingleProduct)

router.post("/product",productController.addProducts)

router.get("/products/search",searchController.searchProducts)

router.put("/product/:id",productController.updateProduct)

router.delete("/product/:id",productController.deleteProduct)

module.exports = router