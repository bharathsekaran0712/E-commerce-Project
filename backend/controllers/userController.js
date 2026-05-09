const User = require('../models/userModel')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

exports.registerUser = async(req,res)=>{
    try {
        const {name,emailORphone,password,role}=req.body

        const userExists = await User.findOne({email:emailORphone})

        if(userExists){
            return res.status(400).json({
                success:false,
                message:"User already exists"   
            })
        }

        const hashPassword = await bcrypt.hash(password,10)

        const newUser = await User.create({
            name,
            emailORphone,
            password:hashPassword,
            role
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
        const {emailORphone,password,role} = req.body
        const user = await User.findOne({emailORphone})

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid email or Phone number"
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
                emailORphone: user.emailORphone,
                role:user.role
            }
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}


exports.editUser = async (req, res) => {
  try {
    const {userId,name,emailORphone }= req.body;
   let _id = new mongoose.Types.ObjectId(userId)
    const updatedUser = await User.findOneAndUpdate(
      _id,
      {
        name: name,
        emailORphone:emailORphone,
      },
      { new: true }
    );

    if(!updatedUser){
        return res.status(404).json({
            success:false,
            message:"User not found"
        })
    }

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




