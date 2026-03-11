const Product = require("../models/productSchema")

exports.searchProducts = async(req,res)=>{
    try {
        const keyword = req.body.keyword
        ?{
            name:{
                $regex:req.body.keyword,
                $options:"i"
            }
        }:{}

        const products = await Product.find({...keyword})

        if(!products){
            return res.status(404).json({
                success:false,
                message:"Product not found"
            })
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

module.exports = searchProducts