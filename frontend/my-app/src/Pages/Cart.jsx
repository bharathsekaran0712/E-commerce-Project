import React from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useCart } from "../features/context/CartContext";
import { useEffect } from "react";
import PageTitle from "../Components/PageTitle";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Back from "../Components/Back";
import Products from "./Products";

const Cart = () => {
  const {
    cartItems,
    setCartItems,
    removeFromCart,
    increaseQty,
    decreaseQty,
    processingFee,
    finalTotal,
    totalPrice
  } = useCart();

  const navigate = useNavigate();



useEffect(() => {

}, [cartItems]);


useEffect(() => {
  // console.log("first")
  setCartItems([])
  fetchCartFromBackend();
}, []);

const fetchCartFromBackend = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token,"token")
      if (!token) return;

      const res = await fetch("http://localhost:8000/api/getCart", {
        method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
        body:JSON.stringify({userId:JSON.parse(localStorage.getItem("user"))._id})
      });

      const data = await res.json();

      if (data && data.length) {
        setCartItems(data[0].items);
      }
    } catch (error) {
      console.log("Cart fetch error:", error);
    }
  };

  const removeCart = async(id) => {
    try {
      const token = localStorage.getItem("token");
      console.log(token,"token")
      if (!token) return;

      const user=JSON.parse(localStorage.getItem("user"))
      const res = await fetch("http://localhost:8000/api/removeCart",
        {
          method:"POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          body:JSON.stringify({userId:user._id,itemId:id})
        }
      )

      if(!res.ok){
        console.log("Delete failed")
      }else{
        toast.success("Product removed successfully")
      }
    fetchCartFromBackend()
      // setCartItems(cartItems.fiter((item)=> item._Id !== id))
    } catch (error) {
      console.log("Delete failed",error)
    }
  }

const checkoutHandler = () => {
  if(finalTotal === 0){
    toast.error("Please add product")
  }else{
    navigate("/payment")
  }
}



  return (<>
    <PageTitle title={"Cart | E-Commerce"} />
  <div className="min-h-screen bg-gray-100 py-10">
    <Toaster/>

    <Back/>
    
    <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-6">
      
      
      <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-6">🛒 Shopping Cart</h1>

        {cartItems.reduce((acc, item) => acc + item?.quantity, 0) === 0 ? (
          <p className="text-gray-500">Your cart is empty</p>
        ) : (
          cartItems.map(item => (
            <div
              key={item._id}
              className="flex items-center gap-4 border-b py-4"
            >
              
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />

              
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{item.name}</h2>
                <p className="text-gray-600">₹ {item.price}</p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => decreaseQty(item._id)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>

                  <span className="font-medium">{item.quantity}</span>

                  <button
                    onClick={() => increaseQty(item._id)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>

                </div>
              </div>

              
              <button
                onClick={() => removeCart(item.productId)}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

       
      <div className="bg-white p-6 rounded-2xl shadow h-fit">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

        <div className="flex justify-between mb-2">
          <span>Items</span>
          <span>{cartItems.length}</span>
        </div>


        <div className="flex justify-between mb-2">
          <span>Processing fee</span>
          <span>₹ {processingFee}</span>
        </div>

        <div className="flex justify-between font-semibold mb-2">
          <span>Total</span>
          <span >₹ {finalTotal}</span>
        </div>

        <hr className="my-4" />

        <button 
          onClick={checkoutHandler}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  </div>
  </>
);
}

export default Cart;