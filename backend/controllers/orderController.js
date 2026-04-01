const Order = require("../models/orderSchema");
const Cart = require("../models/cartSchema")

exports.createNewOrder = async (req, res) => {
  try {
    const {shippingAddress, orderItem,userId} = req.body;

    
    const totalPrice = orderItem.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

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
    res.status(200).json({
      success:true,
      message:"cart cleared"
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
    const orders = await Order.find({ user: req.user.userId });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

