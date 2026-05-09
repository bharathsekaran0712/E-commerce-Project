import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext()

export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState([]);


  useEffect(() => {
    // localStorage.setItem("cart", JSON.stringify(cartItems));
    setCartItems([])
  }, [])



  const addToCart = async(product) => {
        try {
          console.log(product)

          const token = localStorage.getItem("token");
          const user=JSON.parse(localStorage.getItem("user"))
          if (!token) return; 
    
          await fetch("http://localhost:8000/api/addToCart", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ items: product ,userId:user._id}),
          });
          const data = await res.json()

          if(data.success){
            toast.success("Product added to the cart")
          }else{
            toast.error("Product has failed to add")
          }
        } catch (error) {
          console.log("Cart save error:", error);
        }
  };

  
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item._id !== id));
  };

  
  const increaseQty = (id) => {
    setCartItems(cartItems.map(item =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  
  const decreaseQty = (id) => {
    setCartItems(cartItems.map(item =>
      item._id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };


  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity, 0);


  const processingFee = Math.round(totalPrice * 0.02)

  const finalTotal = totalPrice + processingFee  

  return (
    <CartContext.Provider value={{
      cartItems,
      setCartItems,
      addToCart,
      removeFromCart,
      increaseQty,
      decreaseQty,
      processingFee,
      finalTotal,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);