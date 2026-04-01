import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../features/context/CartContext";
import PageTitle from "../Components/PageTitle";
import Back from "../Components/Back";

const Payment = () => {
  <PageTitle title={"Payment | E-commerce"} />
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("COD")
  const [loading, setLoading] = useState(false);

  const userId = JSON.parse(localStorage.getItem("user"))
  console.log(userId,"userId")
  console.log(userId._id,"userId")
  const itemsTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const processingFee = Math.round(itemsTotal * 0.02);

  const totalAmount = itemsTotal + processingFee;

  const handlePayment = async () => {
    setLoading(true);

    setTimeout(async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/new/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            shippingAddress: {
              address: "Demo Address",
              city: "Chennai",
              state: "Tamil Nadu",
              country: "India",
              pinCode: 600001,
              phoneNo: 9876543210,
            },
            paymentMethod,
            totalAmount,
            orderItem: cartItems.map((item) => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
              product: item._id,
            })),
            
            userId: userId._id
          }),
        });

        const data = await res.json();

        if (data.success) {

          if (paymentMethod === "COD") {
            toast.success("Order placed with Cash on Delivery")
          } else if (paymentMethod === "UPI") {
            toast.success("UPI payment successful")
          } else {
            toast.success("Card payment successful")
          }

          setCartItems([]);
          localStorage.removeItem("cart");

          setTimeout(() => {
            navigate("/orders");
          }, 1500);
        }
      } catch (error) {
        console.log("Payment error:", error);
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (<>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster position="top-center" />

      <div className="bg-white p-6 rounded shadow w-96">
        <Back />

        <h2 className="text-xl font-bold mb-4">Select Payment Method</h2>


        <label className="mr-3">
          <input
            type="radio"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={(e) => setPaymentMethod(e.target.value)} />
          Cash on Delivery
        </label>

        <label className="mr-3">
          <input
            type="radio"
            value="UPI"
            checked={paymentMethod === "UPI"}
            onChange={(e) => setPaymentMethod(e.target.value)} />
          UPI
        </label>

        <label className="mr-3">
          <input
            type="radio"
            value="CARD"
            checked={paymentMethod === "CARD"}
            onChange={(e) => setPaymentMethod(e.target.value)} />
          Debit Card
        </label>

        <p className="mb-4 font-bold mt-4">Total Amount: ₹{totalAmount}</p>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

      </div>
    </div>
  </>
  );
};

export default Payment;