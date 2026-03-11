const user = require("../models/userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.registerUser = async(req,res)=>{
    try {
        const {name,email,password}=req.body

        const userExists = await user.findOne({email})

        if(userExists){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }
        const hashPassword = await bcrypt.hash(password,10)
        const newUser = await user.create({
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
        const user = await user.findOne({email})

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid email"
            })
        }
        const isPasswordMatch = await bcrypt.compare(password,user.password)

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
            message:"Login successful",
            token
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

// middleware for protected routes

const userMiddleware = (req,res,next)=>{
 try {

   const token = req.headers.authorization

   if(!token){
      return res.status(401).json({message:"No token provided"})
   }

   const decoded = jwt.verify(token,"secretkey")

   req.user = decoded.id

   next()

 } catch (error) {

   res.status(401).json({message:"Invalid Token"})

 }
}

module.exports = userMiddleware