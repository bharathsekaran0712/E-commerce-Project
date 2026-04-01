
const Cart = require("../models/cartSchema");

exports.getCart = async (req, res) => {
  // console.log(req.body)
  const {userId} = req.body
  // console.log(userId,"userId")
  const cart = await Cart.find({ userId: userId })
  res.json(cart)
}

exports.saveCart = async (req, res) => {
  const {items, userId} = req.body
  console.log(items,"items")
const savedata={ 
      productId: items._id,
      image:items.image,
      name: items.name,
      price: items.price,
      quantity: items.quantity
    }
    console.log(savedata,"savedata")
  let cart = await Cart.findOne({ userId: userId })

  if (cart) {

   let existingitem = cart.items.find(val=> val.productId.toString() === items._id)
if(existingitem){
  existingitem.quantity += items.quantity
}else{
  cart.items.push(savedata)
}
  } else {
    cart = new Cart({ userId: userId, items:[savedata] })
  }
console.log(cart)
  await cart.save()
  res.json(cart)
}

exports.removeCart = async(req,res) => {
  try {
    const {userId,itemId} = req.body
  const cart = await Cart.findOne({userId: userId})

  if(!cart){
    res.status(404).json({
      status:false,
      message:"Item not found"
    })
  }
console.log(cart.items)
  
  let cartitems=cart.items
  // console.log(cartitems,"cartitems")
  console.log(typeof(itemId),"itemId")
  let filtered = cartitems.filter((val)=> {
    console.log(val.productId,val.productId.toString() === itemId,"validation" )
    return val.productId.toString() !== itemId})
  console.log(filtered.map(v=>v.productId),"filtered")
  cart.items=filtered
  // console.log(cart,"cart")
  await cart.save()
  res.status(200).json({
      status:true,
      message:"item is deleted succesfully"
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message:error.message
    })
  }
}
 
