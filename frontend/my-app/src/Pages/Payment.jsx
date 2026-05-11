import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../features/context/CartContext";
import PageTitle from "../Components/PageTitle";
import Back from "../Components/Back";
import {
  MapPin,
  Phone,
  CheckCircle2,
  Plus,
  CreditCard,
  Wallet,
  Truck,
} from "lucide-react";

const Payment = () => {
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showAddrModal, setShowAddrModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    doorNo: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    contact: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const itemsTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const processingFee = Math.round(itemsTotal * 0.02);
  const totalAmount = itemsTotal + processingFee;


  const url = "https://e-commerce-backend-zg40.onrender.com";


  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };


  const fetchAddresses = async () => {
    try {
      const res = await fetch(`${url}/api/address/get`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user._id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setAddresses(data.addresses || []);

        const def = data.addresses?.find((a) => a.isDefault);

        if (def) {
          setSelectedId(def._id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);


  const handleAddAddress = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      const res = await fetch(`${url}/api/address/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          userId: user._id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Address added");

        await fetchAddresses();

        setSelectedId(data.address._id);

        setShowAddForm(false);

        setForm({
          doorNo: "",
          line1: "",
          line2: "",
          city: "",
          state: "",
          pincode: "",
          contact: "",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };


  const buildShippingAddress = () => {
    const addr = addresses.find((a) => a._id === selectedId);

    if (!addr) return null;

    return {
      address: [addr.doorNo, addr.line1, addr.line2]
        .filter(Boolean)
        .join(", "),
      city: addr.city,
      state: addr.state,
      country: "India",
      pinCode: Number(addr.pincode),
      phoneNo: Number(addr.contact),
    };
  };

  const selectedAddr = addresses.find((a) => a._id === selectedId);

  const saveOrder = async (paymentId = "", paymentStatus = "Pending") => {
    const shippingAddress = buildShippingAddress();

    const res = await fetch(`${url}/api/v1/new/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        shippingAddress,
        paymentMethod,
        paymentInfo: {
          id: paymentId,
          status: paymentStatus,
        },

        totalAmount,

        orderItem: cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          product: item.productId,
        })),

        userId: user._id,
      }),
    });

    return await res.json();
  };


  const handleRazorpayPayment = async () => {
    const shippingAddress = buildShippingAddress();

    if (!shippingAddress) {
      toast.error("Please select address");
      return;
    }

    setLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      
      const orderRes = await fetch(`${url}/api/v1/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          amount: totalAmount,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderData.success) {
        toast.error("Unable to create payment");
        return;
      }

      const options = {
        key: "import.meta.env.VITE_RAZORPAY_KEY_ID",

        amount: orderData.order.amount,

        currency: "INR",

        name: "E-Commerce Store",

        description: "Order Payment",

        order_id: orderData.order.id,

        handler: async function (response) {
          try {
            
            const verifyRes = await fetch(
              `${url}/api/v1/payment/verify`,
              {
                method: "POST",

                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },

                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,
                }),
              }
            );

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              
              const data = await saveOrder(
                response.razorpay_payment_id,
                "Paid"
              );

              if (data.success) {
                toast.success("Payment successful");

                setCartItems([]);

                localStorage.removeItem("cart");

                setTimeout(() => {
                  navigate("/orders");
                }, 1500);
              }
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.log(error);
          }
        },

        prefill: {
          name: user?.name,
          contact: user?.phone,
          email: user?.email,
        },

        theme: {
          color: "#2563eb",
        },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.open();

      paymentObject.on("payment.failed", function () {
        toast.error("Payment failed");
      });
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  
  const handleCODOrder = async () => {
    const shippingAddress = buildShippingAddress();

    if (!shippingAddress) {
      toast.error("Please select address");
      return;
    }

    setLoading(true);

    try {
      const data = await saveOrder("", "Pending");

      if (data.success) {
        toast.success("Order placed successfully");

        setCartItems([]);

        localStorage.removeItem("cart");

        setTimeout(() => {
          navigate("/orders");
        }, 1500);
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  
  const handlePayment = async () => {
    if (paymentMethod === "COD") {
      handleCODOrder();
    } else {
      handleRazorpayPayment();
    }
  };

  return (
    <>
      <PageTitle title="Payment | E-commerce" />

      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 py-10 px-4">
        <Toaster position="top-center" />

        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-5 text-white">
            <Back />

            <h1 className="text-2xl font-bold mt-4">
              Secure Checkout
            </h1>

            <p className="text-blue-100 text-sm mt-1">
              Complete your payment securely
            </p>
          </div>

          <div className="p-6 space-y-6">

            {/* ADDRESS */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-gray-800 flex items-center gap-2">
                  <MapPin size={16} className="text-blue-600" />
                  Delivery Address
                </p>

                <button
                  onClick={() => setShowAddrModal(true)}
                  className="text-blue-600 text-sm font-medium"
                >
                  Change
                </button>
              </div>

              {selectedAddr ? (
                <div className="border-2 border-blue-500 bg-blue-50 rounded-2xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {[selectedAddr.doorNo,
                          selectedAddr.line1,
                          selectedAddr.line2]
                          .filter(Boolean)
                          .join(", ")}
                      </p>

                      <p className="text-sm text-gray-600 mt-1">
                        {selectedAddr.city}, {selectedAddr.state} -{" "}
                        {selectedAddr.pincode}
                      </p>

                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Phone size={12} />
                        {selectedAddr.contact}
                      </p>
                    </div>

                    <CheckCircle2
                      size={20}
                      className="text-blue-600"
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddrModal(true)}
                  className="w-full border-2 border-dashed border-blue-300 rounded-2xl py-4 text-blue-600 hover:bg-blue-50"
                >
                  Select Address
                </button>
              )}
            </div>

            {/* PAYMENT METHODS */}
            <div>
              <p className="font-semibold text-gray-800 mb-3">
                Payment Method
              </p>

              <div className="space-y-3">

                <label
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all
                  ${
                    paymentMethod === "COD"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <Truck size={18} className="text-green-600" />

                  <span className="font-medium">
                    Cash on Delivery
                  </span>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all
                  ${
                    paymentMethod === "ONLINE"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    value="ONLINE"
                    checked={paymentMethod === "ONLINE"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <CreditCard
                    size={18}
                    className="text-blue-600"
                  />

                  <span className="font-medium">
                    Razorpay (UPI / Card / NetBanking)
                  </span>
                </label>
              </div>
            </div>

            {/* PRICE SUMMARY */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Items Total</span>
                <span>₹{itemsTotal}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Processing Fee</span>
                <span>₹{processingFee}</span>
              </div>

              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            {/* PAY BUTTON */}
            <button
              onClick={handlePayment}
              disabled={loading || !selectedId}
              className="w-full bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-3 rounded-2xl font-semibold text-lg hover:scale-[1.01] transition-all disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : paymentMethod === "COD"
                ? "Place Order"
                : `Pay ₹${totalAmount}`}
            </button>
          </div>
        </div>

        {/* ADDRESS MODAL */}
        {showAddrModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">

            <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">

              <div className="flex items-center justify-between px-5 py-4 border-b">
                <h2 className="font-bold text-lg">
                  Select Address
                </h2>

                <button
                  onClick={() => setShowAddrModal(false)}
                  className="text-2xl text-gray-400"
                >
                  ×
                </button>
              </div>

              <div className="p-5 space-y-3">

                {addresses.map((addr) => {
                  const selected = selectedId === addr._id;

                  return (
                    <button
                      key={addr._id}
                      onClick={() => setSelectedId(addr._id)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all
                      ${
                        selected
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <p className="font-semibold text-gray-800">
                        {[addr.doorNo,
                          addr.line1,
                          addr.line2]
                          .filter(Boolean)
                          .join(", ")}
                      </p>

                      <p className="text-sm text-gray-600 mt-1">
                        {addr.city}, {addr.state} -{" "}
                        {addr.pincode}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {addr.contact}
                      </p>
                    </button>
                  );
                })}

                {/* ADD ADDRESS */}
                {showAddForm ? (
                  <form
                    onSubmit={handleAddAddress}
                    className="space-y-3 border rounded-2xl p-4"
                  >
                    {[
                      "doorNo",
                      "line1",
                      "line2",
                      "city",
                      "state",
                      "pincode",
                      "contact",
                    ].map((field) => (
                      <input
                        key={field}
                        name={field}
                        value={form[field]}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            [e.target.name]:
                              e.target.value,
                          })
                        }
                        placeholder={field}
                        className="w-full border rounded-xl px-4 py-2 outline-none focus:border-blue-500"
                      />
                    ))}

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="flex-1 border py-2 rounded-xl"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="flex-1 bg-blue-700 text-white py-2 rounded-xl"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="w-full border-2 border-dashed border-blue-300 py-3 rounded-2xl text-blue-600 flex justify-center items-center gap-2"
                  >
                    <Plus size={16} />
                    Add New Address
                  </button>
                )}

                <button
                  onClick={() => setShowAddrModal(false)}
                  disabled={!selectedId}
                  className="w-full bg-blue-700 text-white py-3 rounded-2xl font-semibold"
                >
                  Deliver Here
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Payment;