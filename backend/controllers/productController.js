const Product = require("../models/productSchema")
const mongoose = require("mongoose")
const Order = require("../models/orderSchema")
exports.addProducts = async(req,res)=>{
    try {
        const product = await Product.create(req.body)

        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product not created"
            })
        }
        res.status(201).json({
            success:true,
            product
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}
exports.getAllProducts =async(req,res)=>{
    try {
        const products = await Product.find()

        if(!products){
         res.status(404).json({message:"Products not found"})
    }
    res.status(200).json({
        success:true,
        products
    })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
    
}

exports.getSingleProduct = async(req,res)=>{
    try {
        const id = req.params.id
        const product = await Product.findById(id)

        if(!product){
            return res.status(404).json({
            success:false,
            message:"Single Product not found"
        })
    }
    res.status(200).json({
        success:true,
        product
    })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
   
}

exports.updateProduct = async(req,res)=>{
    try {
        const id = req.params.id
        const product = await Product.findByIdAndUpdate(
        id,
        req.body,
        {
            new:true,
            runValidators:true
        }
    )

    if(!product){
        return res.status(404).json({
            success:false,
            message:"Product not found"
        })
    }
    res.status(200).json({
        success:true,
        product
    })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
    
}

exports.deleteProduct = async(req,res)=>{
    try {
    const id = req.params.id
    const product = await Product.findByIdAndDelete(id)

    if(!product){
        res.status(404).json({
            success:false,
            message:"Product not found"
        })
    }
    res.status(200).json({
        success:true,
        message:"Product deleted successfully"
    })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

exports.addReview = async(req,res) => {
    try {
        const {id,name,rating,orderId,user} = req.body

        const product = await Product.findById(id)
       const ratingAvg = Number(Number(product.ratings + rating)/2)
        if(!product){
            return res.status(404).json({
               success:false,
               message:"Product not found"
        })
        }

        await Product.findByIdAndUpdate(
           id,
           {
            name,ratingAvg,user
           },
           {new:true}
        )

        const order = await Order.findById(orderId)
        console.log(order,"order")

        if(!order){
            return res.status(404).json({
                success:false,
                message:("Order not found")
            })
        }

        const updateOrder = await Order.findOneAndUpdate(
    {
        _id: orderId,
        "orderItem.product": id   
    },
    {
        $set: {
            "orderItem.$.rating": rating  
        }
    }
        )
        console.log(updateOrder,"updateOrder")
        

        res.status(200).json({
            success:true,
            message:"Review added successfully"
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

exports.submitReview = async(req,res) => {
    try {
        const {id,review,user,orderId} = req.body
        console.log(id,"id")
        console.log(review,"review")
        console.log(user,"user")
        console.log(orderId,"orderId")

    const product = await Product.findById(id)

    if(!product){
        return res.status(404).json({
            success:false,
            message:"Product not found"
        })
    }

    let userReview = {
        name:review,
        user:user
    }

    product.reviews.push(userReview)

    await product.save()

    // await Product.findByIdAndUpdate(
    //     id,
    //     {
    //         name,
    //         user
    //     },
    // )

    // const order = await Order.findById(orderId)

    // if(!order){
    //     return res.status(404).json({
    //         success:false,
    //         message:"Order not found"
    //     })
    // }

    res.status(200).json({
        success:true,
        message:"Review added successfully"
    })

    } catch (error) {
        res.status(500).json({
            message:error.message
        })    
    }
}