const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter product name"]
    },
    description:{
        type:String,
        required:[true,"Please enter product decription"]
    },
    price:{
        type:Number,
        required:[true,"Please enter product price"],
        maxLength:[7,"Price cannot exceed 7 digit"]
    },
    ratings:{
        type:Number,
        default:0
    },
    image:[{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }],
    category:{
        type:String,
        required:[true,"Please enter product category"]
    },
    stock:{
        type:Number,
        required:[true,"Please enter product stocks"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[{
        name:{type:String,required:true},
        rating:{type:Number,required:true},
        comment:{type:String,required:true}
    }],
    createdAt:{
        type:Date,
        default:Date.now
    }
})


module.exports = mongoose.model("Product",productSchema)