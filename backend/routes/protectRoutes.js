const { userMiddleware } = require("../middleware/userMiddleware")

router.get("/", userMiddleware, getCart)
router.post("/", userMiddleware, saveCart)