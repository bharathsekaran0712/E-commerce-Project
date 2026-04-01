import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../Components/PageTitle";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Back from "../Components/Back";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartItems,setCartItems] = useState([])
  const navigate = useNavigate()

  const userId  = JSON.parse(localStorage.getItem("userId"))

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(()=>{
    createOrder()
  },[])

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/api/v1/orders/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setError("Failed to load orders");
      }
    } catch (error) {
      console.log("Fetch orders error:", error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async () => {
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
            totalPrice,
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
          toast.success("Order placed")

          setCartItems([]);
          localStorage.removeItem("cart");

          // setTimeout(() => {
          //   navigate("/orders");
          // }, 1500);
        }
      } catch (error) {
        console.log("Order error:", error);
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-lg font-semibold">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  return (<>
    <PageTitle title={"Orders | E-commerce"}/>
    <div className="p-6 max-w-5xl mx-auto">
      <Toaster/>
      <div className="flex justify-between items-center">
      <Back/>
      <button onClick={()=> navigate("/Home")}
        className="text-gray-600 hover:text-blue-700 flex justify-center items-center gap-1">
          Go to home <ArrowRight/></button>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p>No orders yet!</p>
        </div>
      ) : (
        orders.map(order => (
          <div key={order._id}
            className="bg-white shadow-md rounded-xl p-5 mb-5"
          > 

            
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-sm text-gray-600">Order ID: {order._id}</h2>

              <span className={`px-3 py-1 rounded-full text-sm font-medium
                ${order.orderStatus === "Order Placed"
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
                }`}>
                {order.orderStatus}
              </span>
            </div>

            <div className="space-y-3">
              {order.orderItem.map(item => (
                <div key={item.product}
                  className="flex items-center gap-4 border-b pb-2"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-500 text-sm">₹ {item.price} * {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4">

              <p className="font-semibold">
                Total: ₹ {order.totalPrice}
              </p>

              <Link to={`/order/${order._id}`}
                className="text-blue-600 hover:underline font-medium"
              >
                View Details →
              </Link>

            </div>

          </div>
        ))
      )}
    </div>
    </>
  );
};

export default Orders;