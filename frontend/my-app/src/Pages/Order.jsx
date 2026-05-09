import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import PageTitle from "../Components/PageTitle"
import toast, { Toaster } from "react-hot-toast"
import Back from "../Components/Back"
import Rating from "../Components/Rating"
import {ArrowRight,Package,Truck,CircleCheck,Clock3,XCircle,ShoppingBag,Star} from "lucide-react"

const Orders = () => {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [orderStatus, setOrderStatus] = useState("")
  const [orderId, setOrderId] = useState("")
  const [rating, setRating] = useState({})
  const [review, setReview] = useState({})

  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem("user"))
  const token = localStorage.getItem("token")

  const url = "https://e-commerce-backend-zg40.onrender.com"

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    if (orderStatus && orderId) {
      updateOrderStatus(orderId, orderStatus)
    }
  }, [orderId])

  const fetchOrders = async () => {
    try {

      setLoading(true)

      const res = await fetch(
        `${url}+"/api/v1/orders/user"`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ user })
        }
      )

      const data = await res.json()

      if (data.success) {
        setOrders(data.orders || [])
      } else {
        setError("Failed to load orders")
      }

    } catch (error) {
      console.log(error.message)
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId) => {
    try {

      const res = await fetch(
        `${url}+"/api/v1/order/status"`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            orderId,
            status: orderStatus
          })
        }
      )

      if (res.ok) {
        toast.success("Order status updated")
        fetchOrders()
      }

    } catch (error) {
      console.log(error.message)
    }
  }

  const handleSubmit = (productId, orderId) => {
    addReview(productId, orderId)
  }

  const addReview = async (productId, orderId) => {
    try {

      const res = await fetch(
        `${url}+"/api/v1/product/review"`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            orderId,
            id: productId,
            rating: rating[productId],
            review: review[productId],
            user: user._id
          })
        }
      )

      if (res.ok) {
        toast.success("Review added")
        fetchOrders()
      }

    } catch (error) {
      console.log(error.message)
    }
  }

  const cancelOrder = async (orderId) => {

    try {

      const res = await fetch(
        `${url}+"/api/v1/order/cancel"`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            orderId,
            userId: user._id
          })
        }
      )

      const data = await res.json()

      if (data.success) {
        toast.success("Order cancelled")
        fetchOrders()
      }

    } catch (error) {
      console.log(error.message)
    }
  }

  const getStatusStyle = (status) => {

    switch (status) {

      case "Delivered":
        return "bg-green-100 text-green-700"

      case "Cancelled":
        return "bg-red-100 text-red-700"

      case "Processing":
        return "bg-yellow-100 text-yellow-700"

      case "Shipped":
        return "bg-blue-100 text-blue-700"

      default:
        return "bg-indigo-100 text-indigo-700"
    }
  }

  const getStatusIcon = (status) => {

    switch (status) {

      case "Delivered":
        return <CircleCheck size={16} />

      case "Cancelled":
        return <XCircle size={16} />

      case "Processing":
        return <Clock3 size={16} />

      case "Shipped":
        return <Truck size={16} />

      default:
        return <Package size={16} />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-100">
        <p className="text-lg font-semibold animate-pulse">
          Loading Orders...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-500 font-semibold">
          {error}
        </p>
      </div>
    )
  }

  return (
    <>
      <PageTitle title={"Orders | E-commerce"} />
      <Toaster position="top-center" />

      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4 md:p-8">
         <div className="flex items-center justify-between mb-2">
          <div>
         <Back />
         </div>

         <button
              onClick={() => navigate("/Home")}
              className="flex items-center gap-2 bg-white shadow-md px-5 py-3 rounded-xl hover:scale-105 transition cursor-pointer"
            >
              Go Home
              <ArrowRight size={18} />
            </button>
           </div> 
        <div className="max-w-6xl mx-auto">

          {/* Top */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
             
            <div className="flex items-center gap-3">
              

              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  My Orders
                </h1>

                <p className="text-gray-500 mt-1">
                  Track and manage your purchases
                </p>
              </div>
            </div>

            

            
          </div>

          {orders.length === 0 ? (

            <div className="bg-white rounded-3xl shadow-lg p-14 text-center">

              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <ShoppingBag size={36} className="text-blue-600" />
              </div>

              <h2 className="text-2xl font-bold text-slate-800">
                No Orders Yet
              </h2>

              <p className="text-gray-500 mt-2">
                Start shopping to see your orders here
              </p>

            </div>

          ) : (

            <div className="space-y-6">

              {orders.map((order) => (

                <div
                  key={order._id}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-200"
                >

                  {/* Header */}
                  <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-5 text-white">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                      <div>
                        <p className="text-sm opacity-80">
                          Order ID
                        </p>

                        <h2 className="font-semibold break-all">
                          {order._id}
                        </h2>
                      </div>

                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold w-fit ${getStatusStyle(order.orderStatus)}`}>

                        {getStatusIcon(order.orderStatus)}

                        {user.role === "Admin" ? (

                          <select
                            value={order.orderStatus}
                            onChange={(e) => {
                              setOrderStatus(e.target.value)
                              setOrderId(order._id)
                            }}
                            className="bg-transparent outline-none"
                          >
                            <option>Order Placed</option>
                            <option>Processing</option>
                            <option>Shipped</option>
                            <option>Out for Delivery</option>
                            <option>Delivered</option>
                          </select>

                        ) : (
                          order.orderStatus
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="p-6 space-y-5">

                    {order.orderItem.map((item) => (

                      <div
                        key={item.product}
                        className="border border-slate-200 rounded-2xl p-4 hover:shadow-md transition"
                      >

                        <div className="flex flex-col md:flex-row gap-5">

                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-28 h-28 object-cover rounded-2xl border"
                          />

                          <div className="flex-1">

                            <h3 className="text-lg font-semibold text-slate-800">
                              {item.name}
                            </h3>

                            <p className="text-gray-500 mt-1">
                              ₹ {item.price} × {item.quantity}
                            </p>

                            <p className="font-bold text-indigo-600 mt-2">
                              ₹ {item.price * item.quantity}
                            </p>

                            {/* Review */}
                            {order.orderStatus === "Delivered" &&
                              user.role !== "Admin" && (

                              <div className="mt-5 bg-slate-50 border rounded-2xl p-4">

                                <div className="flex items-center gap-2 mb-3">
                                  <Star
                                    size={18}
                                    className="text-yellow-500"
                                  />

                                  <h3 className="font-semibold">
                                    Add Review
                                  </h3>
                                </div>

                                <Rating
                                  rating={rating[item.product]}
                                  setRating={(val) =>
                                    setRating({
                                      ...rating,
                                      [item.product]: val
                                    })
                                  }
                                  item={item.product}
                                  setOrderId={setOrderId}
                                  orderId={order._id}
                                />

                                <textarea
                                  value={review[item.product] || ""}
                                  onChange={(e) =>
                                    setReview({
                                      ...review,
                                      [item.product]: e.target.value
                                    })
                                  }
                                  placeholder="Write your review..."
                                  className="w-full border border-slate-300 rounded-xl p-3 mt-3 outline-none focus:ring-2 focus:ring-indigo-400"
                                  rows={4}
                                />

                                <button
                                  onClick={() =>
                                    handleSubmit(
                                      item.product,
                                      order._id
                                    )
                                  }
                                  className="mt-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-5 py-2 rounded-xl hover:scale-105 transition-all shadow-md"
                                >
                                  Submit Review
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Footer */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-3 border-t">

                      <div>
                        <p className="text-gray-500 text-sm">
                          Total Amount
                        </p>

                        <h2 className="text-2xl font-bold text-slate-800">
                          ₹ {order.totalPrice}
                        </h2>
                      </div>

                      <div className="flex flex-wrap gap-3">

                        <Link
                          to={`/order/${order._id}`}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl transition"
                        >
                          View Details
                        </Link>

                        {(order.orderStatus === "Order Placed" ||
                          order.orderStatus === "Processing") &&
                          user.role !== "Admin" && (

                            <button
                              onClick={() =>
                                cancelOrder(order._id)
                              }
                              className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl transition"
                            >
                              Cancel Order
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Orders