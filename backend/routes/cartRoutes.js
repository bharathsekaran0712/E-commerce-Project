const express = require("express");
const router = express.Router();
const { getCart, saveCart, removeCart } = require("../controllers/cartController");
const userMiddleware = require("../middleware/userMiddleware")

router.post("/getCart", userMiddleware, getCart);
router.post("/addToCart",userMiddleware, saveCart);
router.post("/removeCart",userMiddleware, removeCart);

module.exports = router;