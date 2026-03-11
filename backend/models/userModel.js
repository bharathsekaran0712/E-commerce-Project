const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter the name"],
        maxLength:[25,"invalid name. Please enter a name with fewer than 25 characters"],
        minLength:[3,"Name should contain more than 3 characters"]
    },
    email:{
        type:String,
        required:[true,"Please enter the email"],
        unique:true,
        validate:[validator.isEmail,"Please enter the valid email"]
    },
    password:{
        type:String,
        required:[true,"Please enter the password"],
        minLength:[8,"Password should be more than 8 character"],
        select:false
    }
},{timestamps:true})

const user = mongoose.model("User",userSchema)