import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../features/context/CartContext";
import PageTitle from "../Components/PageTitle";
import Back from "../Components/Back";
import { MapPin, Phone, CheckCircle2, Plus } from "lucide-react";

const Payment = () => {
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading,       setLoading]       = useState(false);
  const [addresses,     setAddresses]     = useState([]);
  const [selectedId,    setSelectedId]    = useState(null);
  const [showAddrModal, setShowAddrModal] = useState(false);
  const [showAddForm,   setShowAddForm]   = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [form,          setForm]          = useState({
    doorNo: "", line1: "", line2: "",
    city: "", state: "", pincode: "", contact: "",
  });

  const user  = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const itemsTotal    = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const processingFee = Math.round(itemsTotal * 0.02);
  const totalAmount   = itemsTotal + processingFee;

  // ── Same fetch as Address.jsx ─────────────────────────────────────────────
  const fetchAddresses = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/address/get", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: user._id }),
      });
      const data = await res.json();
      if (data.success) {
        setAddresses(data.addresses || []);
        const def = data.addresses?.find(a => a.isDefault);
        if (def) setSelectedId(def._id);
      }
    } catch (e) { console.log(e); }
  };

  useEffect(() => { fetchAddresses(); }, []);

  // ── Same add address as Address.jsx ──────────────────────────────────────
  const handleAddAddress = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("http://localhost:8000/api/address/add", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, userId: user._id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Address added");
        await fetchAddresses();
        setSelectedId(data.address._id);
        setShowAddForm(false);
        setForm({ doorNo: "", line1: "", line2: "", city: "", state: "", pincode: "", contact: "" });
      }
    } catch (e) { console.log(e); }
    finally { setSaving(false); }
  };

  // ── Convert address doc → Order shippingAddress shape ────────────────────
  const buildShippingAddress = () => {
    const addr = addresses.find(a => a._id === selectedId);
    if (!addr) return null;
    return {
      address: [addr.doorNo, addr.line1, addr.line2].filter(Boolean).join(", "),
      city:    addr.city,
      state:   addr.state,
      country: "India",
      pinCode: Number(addr.pincode),
      phoneNo: Number(addr.contact),
    };
  };

  const selectedAddr = addresses.find(a => a._id === selectedId);

  // ── Place order ───────────────────────────────────────────────────────────
  const handlePayment = async () => {
    const shippingAddress = buildShippingAddress();
    if (!shippingAddress) {
      toast.error("Please select a delivery address");
      return;
    }
    setLoading(true);
    setTimeout(async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/new/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            shippingAddress,
            paymentMethod,
            totalAmount,
            orderItem: cartItems.map((item) => ({
              name:     item.name,
              price:    item.price,
              quantity: item.quantity,
              image:    item.image,
              product:  item.productId,
            })),
            userId: user._id,
          }),
        });
        const data = await res.json();
        if (data.success) {
          if (paymentMethod === "COD")      toast.success("Order placed with Cash on Delivery");
          else if (paymentMethod === "UPI") toast.success("UPI payment successful");
          else                              toast.success("Card payment successful");
          setCartItems([]);
          localStorage.removeItem("cart");
          setTimeout(() => navigate("/orders"), 1500);
        }
      } catch (error) {
        console.log("Payment error:", error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <>
      <PageTitle title="Payment | E-commerce" />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <Toaster position="top-center" />

        <div className="bg-white p-6 rounded-2xl shadow w-full max-w-sm space-y-5">
          <Back />
          <h2 className="text-xl font-bold">Checkout</h2>

          {/* ── Delivery Address ── */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
              <MapPin size={14} className="text-blue-600" /> Delivery Address
            </p>

            {selectedAddr ? (
              <div className="border-2 border-blue-500 bg-blue-50 rounded-xl px-4 py-3 text-xs text-gray-700">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-800">
                      {[selectedAddr.doorNo, selectedAddr.line1, selectedAddr.line2].filter(Boolean).join(", ")}
                    </p>
                    <p className="text-gray-500 mt-0.5">
                      {selectedAddr.city}, {selectedAddr.state} — {selectedAddr.pincode}
                    </p>
                    <p className="text-gray-400 flex items-center gap-1 mt-0.5">
                      <Phone size={10} /> {selectedAddr.contact}
                    </p>
                    {selectedAddr.isDefault && (
                      <span className="mt-1 inline-block text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <CheckCircle2 size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                </div>
                <button onClick={() => setShowAddrModal(true)}
                  className="mt-2 text-blue-600 underline text-[11px]">
                  Change address
                </button>
              </div>
            ) : (
              <button onClick={() => setShowAddrModal(true)}
                className="w-full text-xs text-blue-600 border-2 border-dashed border-blue-300 rounded-xl py-3 hover:bg-blue-50 transition-colors">
                + Select delivery address
              </button>
            )}
          </div>

          {/* ── Payment Method ── */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Payment Method</p>
            <div className="space-y-2">
              {[
                { value: "COD",  label: "Cash on Delivery" },
                { value: "UPI",  label: "UPI" },
                { value: "CARD", label: "Debit Card" },
              ].map((m) => (
                <label key={m.value}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all
                    ${paymentMethod === m.value ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
                  <input type="radio" value={m.value}
                    checked={paymentMethod === m.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-blue-600" />
                  <span className="text-sm text-gray-700">{m.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ── Price Summary ── */}
          <div className="bg-gray-50 rounded-xl px-4 py-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Items total</span><span>₹{itemsTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Processing fee (2%)</span><span>₹{processingFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-800 pt-1 border-t border-gray-200">
              <span>Total</span><span>₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* ── Pay Button ── */}
          <button onClick={handlePayment} disabled={loading || !selectedId}
            className="w-full bg-green-600 text-white py-2.5 rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>

        {/* ── Address Modal ── */}
        {showAddrModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl relative max-h-[90vh] overflow-y-auto">

              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white">
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <MapPin size={14} className="text-blue-600" /> Select Address
                </h3>
                <button onClick={() => { setShowAddrModal(false); setShowAddForm(false); }}
                  className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
              </div>

              <div className="p-5 space-y-3">

                {/* Saved addresses — same data as Address.jsx */}
                {addresses.length === 0 && !showAddForm && (
                  <p className="text-xs text-gray-400 text-center py-4">No saved addresses. Add one below.</p>
                )}

                {addresses.map((addr) => {
                  const isSelected = selectedId === addr._id;
                  return (
                    <button key={addr._id} type="button"
                      onClick={() => setSelectedId(addr._id)}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all
                        ${isSelected ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-800">
                            {[addr.doorNo, addr.line1, addr.line2].filter(Boolean).join(", ")}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {addr.city}, {addr.state} — {addr.pincode}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Phone size={10} /> {addr.contact}
                          </p>
                          {addr.isDefault && (
                            <span className="mt-1 inline-block text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        {isSelected && <CheckCircle2 size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />}
                      </div>
                    </button>
                  );
                })}

                {/* Add new address — same fields as Address.jsx */}
                {showAddForm ? (
                  <form onSubmit={handleAddAddress}
                    className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-2">
                    <p className="text-xs font-medium text-gray-700">New address</p>
                    {[
                      { name: "doorNo",  placeholder: "Door No" },
                      { name: "line1",   placeholder: "Address Line 1" },
                      { name: "line2",   placeholder: "Address Line 2" },
                      { name: "city",    placeholder: "City" },
                      { name: "state",   placeholder: "State" },
                      { name: "pincode", placeholder: "Pincode" },
                      { name: "contact", placeholder: "Phone" },
                    ].map(f => (
                      <input key={f.name} name={f.name} value={form[f.name]}
                        onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                        placeholder={f.placeholder}
                        className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300 bg-white" />
                    ))}
                    <div className="flex gap-2 pt-1">
                      <button type="button" onClick={() => setShowAddForm(false)}
                        className="flex-1 text-xs border border-gray-200 py-2 rounded-lg text-gray-500 hover:bg-white">
                        Cancel
                      </button>
                      <button type="submit" disabled={saving}
                        className="flex-1 text-xs bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 disabled:opacity-60">
                        {saving ? "Saving..." : "Save address"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <button type="button" onClick={() => setShowAddForm(true)}
                    className="w-full flex items-center justify-center gap-2 text-xs text-blue-600 border border-dashed border-blue-300 rounded-xl py-2.5 hover:bg-blue-50">
                    <Plus size={13} /> Add new address
                  </button>
                )}

                {/* Confirm */}
                <button
                  onClick={() => { setShowAddrModal(false); setShowAddForm(false); }}
                  disabled={!selectedId}
                  className="w-full bg-blue-700 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed">
                  Deliver here
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
