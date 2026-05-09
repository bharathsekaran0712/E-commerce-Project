const express = require("express");
const router = express.Router();
const {addAddress,getAddresses,setDefaultAddress,deleteAddress, editAddress} = require("../controllers/addressController");
const userMiddleware = require("../middleware/userMiddleware")
// Routes
router.post("/add", userMiddleware, addAddress)
router.post("/get", userMiddleware, getAddresses)
router.post("/default", userMiddleware,setDefaultAddress)
router.post("/edit", userMiddleware, editAddress)
router.post("/delete", userMiddleware, deleteAddress)

module.exports = router;