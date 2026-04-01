const Product = require("../models/productSchema")

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
        {new:true,
            runValidators:true
        }
    )

    if(!product){
        return res.status(404).json({
            success:false,
            message:"Product not found"
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