import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Back from "../Components/Back";
import { MapPin, Phone, Package, CreditCard, Tag } from "lucide-react";

const statusStyle = {
  "Order Placed":     "bg-blue-100 text-blue-700",
  Processing:         "bg-yellow-100 text-yellow-700",
  Shipped:            "bg-purple-100 text-purple-700",
  "Out for Delivery": "bg-orange-100 text-orange-700",
  Delivered:          "bg-green-100 text-green-700",
  Cancelled:          "bg-red-100 text-red-700",
};

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  const url = "https://e-commerce-backend-zg40.onrender.com"

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${url}/api/v1/order/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setOrder(data.order);
  };

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const { shippingAddress: s } = order;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-4">

        <Back />

        {/* Header */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Package size={18} className="text-blue-600" />
                Order Details
              </h1>
              <p className="text-xs text-gray-400 font-mono mt-0.5">#{order._id}</p>
            </div>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyle[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>
              {order.orderStatus}
            </span>
          </div>

          {/* Total */}
          <div className="mt-4 flex items-center gap-2 text-sm">
            <CreditCard size={14} className="text-gray-400" />
            <span className="text-gray-500">Total paid</span>
            <span className="ml-auto font-bold text-gray-800 text-base">₹{order.totalPrice?.toLocaleString()}</span>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <MapPin size={15} className="text-blue-600" />
            Delivery Address
          </h2>

          <div className="bg-gray-50 rounded-xl p-4 space-y-1.5 text-sm">
            {/* Full address line */}
            <p className="font-medium text-gray-800">
              {s.address}
            </p>

            {/* City, State, Pincode */}
            <p className="text-gray-500">
              {s.city}
              {s.state ? `, ${s.state}` : ""}
              {s.pinCode ? ` — ${s.pinCode}` : ""}
            </p>

            {/* Country */}
            {s.country && (
              <p className="text-gray-400 text-xs">{s.country}</p>
            )}

            {/* Phone */}
            {s.phoneNo && (
              <p className="flex items-center gap-1.5 text-gray-500 text-xs pt-1 border-t border-gray-200 mt-2">
                <Phone size={11} />
                {s.phoneNo}
              </p>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <Tag size={15} className="text-blue-600" />
            Items ({order.orderItem?.length})
          </h2>

          <div className="space-y-3">
            {order.orderItem.map((item, i) => (
              <div key={item.product || i}
                className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <img src={item.image} alt={item.name}
                  className="w-14 h-14 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                  onError={e => { e.target.style.display = "none" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    ₹{item.price?.toLocaleString()} × {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-700 flex-shrink-0">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Summary row */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-500">Order total</span>
            <span className="text-base font-bold text-gray-800">₹{order.totalPrice?.toLocaleString()}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;
