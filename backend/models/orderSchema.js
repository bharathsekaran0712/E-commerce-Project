const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    shippingAddress:{
        address:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        },
        pinCode:{
            type:Number,
            required:true
        },
        phoneNo:{
            type:Number,
            required:true
        },
    },
    orderItem:[{
        name:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
        image:{
            type:String,
            required:true
        },
        product:{
            type:mongoose.Schema.ObjectId,
            ref:"Product",
            required:true
        }
    }],
    orderStatus:{
        type:String,
        required:true,
        enum: ["Processing", "Shipped", "Order Placed", "Cancelled"],
        default:"Order Placed"
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },
    totalPrice: {
          type: Number,
          required: true
    }
})

module.exports = mongoose.model("Order",orderSchema)