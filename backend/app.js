const express = require("express")
const product = require("./routes/productRoutes")
const user =  require("./routes/userRoutes")

const app = express()

app.use(express.json())

app.use("/api/v1",product)
app.use("/api/v1",user)


module.exports = app