const Product = require("../models/productSchema")

exports.searchProducts = async(req,res)=>{
    try {
        const keyword = req.query.keyword
        ?{
            $or:[{
            name:{
                $regex:req.query.keyword,
                $options:"i"
            }
        },
        {
            description:{
                $regex:req.query.keyword,
                $options:"i"
            }
        },
            {
                category:{
                    $regex:req.query.keyword,
                    $options:"i"
                }
            }

        ]}:{}

        const products = await Product.find(keyword)

        if(products.length === 0){
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

