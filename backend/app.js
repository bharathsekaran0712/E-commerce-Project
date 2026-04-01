const express = require("express")
const product = require("./routes/productRoutes")
const user =  require("./routes/userRoutes")
const cartRoutes = require("./routes/cartRoutes");
const order  = require("./routes/orderRoutes")


const cors = require("cors")
const app = express()

app.use(
    cors({ origin: "http://localhost:5173" , 
        methods: ["GET","POST","PUT","DELETE"]
    })
)


app.use(express.json())

app.use("/api/v1",product)
app.use("/api/v1",user)
app.use("/api/", cartRoutes);
app.use("/api/v1",order)


module.exports = app