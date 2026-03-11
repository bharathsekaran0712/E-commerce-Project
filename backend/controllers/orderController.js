const Order = require("../models/orderSchema")

exports.createNewOrder = async(req,res)=>{
    try {
        const {shippingAddress,orderItem} = req.body
        const order = await Order.create({
            shippingAddress,
            orderItem
        })

        if(!order){
            res.status(400).json({
                success:false,
                message:"Order not created"
            })
        }
        res.status(201).json({
            success:true,
            order
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

exports.getOrderDetails = async(req,res,next)=>{
    try {
        const id = req.params.id
        const order = await Order.findById(id).populate("user","name email")

        if(!order){
            return res.status(404).json({
                success:false,
                message:"Order not found"
            })
        }
        res.status(201).json({
            success:true,
            order
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

exports.getAllOrders = async(req,res,next)=>{
    try {
        const orders = await Order.find({user:req.user._id})
        if(!orders){
            return res.status(404).json({
            success:false,
            message:"Order not found"
        })
    }
    res.status(201).json({
        success:true,orders
    })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
    
}

