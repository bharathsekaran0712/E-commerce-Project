import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Back from "../Components/Back";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8000/api/v1/order/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.success) {
      setOrder(data.order);
    }
  };

  if (!order) return <p>Loading...</p>;

  return (
  <div className="min-h-screen bg-gray-100 py-10">
    <Back/>
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow">
      
      <h1 className="text-2xl font-bold mb-4">📦 Order Details</h1>

      <div className="mb-4">
        <p><strong>Status:</strong> {order.orderStatus}</p>
        <p><strong>Total:</strong> ₹ {order.totalPrice}</p>
      </div>

      <h2 className="font-semibold mb-2">Shipping Address</h2>
      <p className="text-gray-600 mb-4">
        {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
        {order.shippingAddress.state}
      </p>

      <h2 className="font-semibold mb-2">Items</h2>

      {order.orderItem.map(item => (
        <div
          key={item.product}
          className="flex items-center gap-4 border-b py-3"
        >
          <img
            src={item.image}
            className="w-16 h-16 rounded object-cover"
          />

          <div className="flex-1">
            <p className="font-medium">{item.name}</p>
            <p className="text-gray-500">
              ₹ {item.price} × {item.quantity}
            </p>
          </div>
        </div>
        
      ))}
    </div>
  </div>
);
};

export default OrderDetails;