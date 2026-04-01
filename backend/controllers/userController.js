const User = require('../models/userModel')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.registerUser = async(req,res)=>{
    try {
        const {name,email,password}=req.body

        const userExists = await User.findOne({email:email})

        if(userExists){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }
        const hashPassword = await bcrypt.hash(password,10)
        const newUser = await User.create({
            name,
            email,
            password:hashPassword
        })
        res.status(201).json({
            success:true,
            newUser
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//Login user
exports.loginUser = async(req,res)=>{
    try {
        const {email,password} = req.body
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid email"
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                message:"Invalid password"
            })
        }
        const token = jwt.sign(
            {userId:user._id},
            process.env.JWT_SECRET_KEY,
            {expiresIn:process.env.JWT_EXPIRE}
        )
        res.status(200).json({
            success:true,
            token,
            user:{
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

// middleware for protected routes



