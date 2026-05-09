const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true
  
    },
    emailORphone:{
        type:String,
        unique:true

    },
    password:{
        type:String,
        
    } ,
    role:{
        type:String,
        trim:true
  
    },
    addresses:[
        {
            address:{
        type:String
    }
}],
},{timestamps:true})

module.exports = mongoose.model("User",userSchema)