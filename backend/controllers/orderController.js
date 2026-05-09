const Order = require("../models/orderSchema");
const Cart = require("../models/cartSchema")
const Product = require("../models/productSchema");
const User = require("../models/userModel")
const { default: mongoose } = require("mongoose");

exports.createNewOrder = async (req, res) => {
  try {
    const {shippingAddress, orderItem,userId} = req.body

    console.log(orderItem,"orderItem")
    const totalPrice = orderItem.reduce(
      (acc, item) => acc + item.price * item.quantity,0)

    const order = await Order.create({
      shippingAddress,
      orderItem,
      totalPrice,
      user: req.user.userId,
    });

    //   res.status(201).json({
    //   success: true,
    //   order,
    // });


    const cart = await Cart.findOne({userId:userId})

    if(!cart){
      res.status(404).json({
        success:false,
        message:"cart not found"
      })
    }else{
    cart.items=[]
    }

    await cart.save()

    const stock = orderItem.map(async (item,ind) => {
    console.log(item,ind,item.product,"item1")

    const product = await Product.findOne({_id:new mongoose.Types.ObjectId(item.product)})
    console.log(product,"product")
    
        if(product){
            product.stock=Number(product.stock - item.quantity)}
            console.log(product,"product")
            await product.save()
        })
   

      res.status(200).json({
      success:true,
      message:"cart cleared stock adjusted"
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


exports.getAllOrders = async (req, res) => {
  try {

    const {user} = req.body
    console.log(user,"user")

    let filter={}

    if(user.role !== "Admin"){
      filter.user = user._id
    }
    const orders = await Order.find(filter).populate("user", "name emailORphone");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

exports.updateOrderStatus = async(req,res) => {
  try {
    const {orderId,status} = req.body
    console.log(orderId,status,"oderId")
    const order = await Order.findByIdAndUpdate(
      orderId,
      {new:true}
    )

    if(!order){
      return res.status(404).json({
        success:false,
        message:"order not found"
      })
    }

    order.orderStatus = status

    await order.save()

    res.status(200).status(200).json({
      success:true,
      order
    })
  } catch (error) {
    res.status(500).json({
      message:error.message
    })
  }
}


exports.cancelOrder = async (req, res) => {
  try {
    const { orderId ,userId} = req.body;

    const order = await Order.findById(orderId);
    console.log(order,"order")

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel delivered order",
      });
    }

    order.orderStatus = "Cancelled";

    for (let item of order.orderItem) {
      const product = await Product.findById(item.product);
      console.log(product,"product")

      if (product) {
        product.stock += item.quantity;
        console.log("product.stock",product)
        await product.save();
console.log(product,"product saver")
      }
    }

    await order.save();
    console.log(order,"order")

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
