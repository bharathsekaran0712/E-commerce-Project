const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
  unique: true
},
  items: [
    {
      productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
      },
      image:String,
      name: String,
      price: Number,
      quantity: Number
    }
  ]
});

module.exports = mongoose.model("Cart", cartSchema);