import React, { useState, useEffect } from "react"
import { Toaster, toast } from "react-hot-toast"
import Back from "../Components/Back"

import {
  MapPin,
  Plus,
  Trash2,
  Pencil,
  Phone,
  Home,
  BadgeCheck,
  X
} from "lucide-react"

const Address = () => {

  const user = JSON.parse(localStorage.getItem("user"))

  const [form, setForm] = useState({
    doorNo: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    contact: "",
    userId: user._id
  })

  const [addresses, setAddresses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)

  const token = localStorage.getItem("token")

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const url = "https://e-commerce-backend-zg40.onrender.com"

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const Url = editId
        ? `${url}/api/address/edit`
        : `${url}/api/address/add`

      let payload = editId
        ? { ...form, addressId: editId }
        : form

      const res = await fetch(Url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (data.success) {

        toast.success(
          editId
            ? "Address updated"
            : "Address added"
        )

        fetchAddresses()

        setForm({
          doorNo: "",
          line1: "",
          line2: "",
          city: "",
          state: "",
          pincode: "",
          contact: "",
          userId: user._id
        })

        setEditId(null)
        setShowForm(false)
      }

    } catch (error) {
      console.log(error.message)
    }
  }

  const fetchAddresses = async () => {

    try {

      const res = await fetch(
        `${url}/api/address/get`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: user._id
          })
        }
      )

      const data = await res.json()

      if (data.success) {
        setAddresses(data.addresses)
      }

    } catch (error) {
      console.log(error.message)
    }
  }

  const setDefault = async (id) => {

    try {

      const res = await fetch(
        `${url}/api/address/default`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: user._id,
            addressId: id
          })
        }
      )

      const data = await res.json()

      if (data.success) {
        toast.success("Default address updated")
        fetchAddresses()
      }

    } catch (error) {
      console.log(error.message)
    }
  }

  const deleteAddress = async (id) => {

    try {

      const res = await fetch(
        `${url}/api/address/delete`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            addressId: id
          })
        }
      )

      const data = await res.json()

      if (data.success) {
        toast.success("Address deleted")
        fetchAddresses()
      }

    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  return (
    <>
      <Toaster position="top-center" />

      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4 md:p-8">
       <Back />
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div className="flex items-center gap-3">

              

              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  Saved Addresses
                </h1>

                <p className="text-gray-500 mt-1">
                  Manage your delivery addresses
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setEditId(null)
                setShowForm(true)
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-3 rounded-xl shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              <Plus size={18} />
              Add Address
            </button>
          </div>

          {/* Empty */}
          {addresses.length === 0 ? (

            <div className="bg-white rounded-3xl shadow-lg p-14 text-center">

              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <MapPin size={36} className="text-blue-600" />
              </div>

              <h2 className="text-2xl font-bold text-slate-800">
                No Addresses Added
              </h2>

              <p className="text-gray-500 mt-2">
                Add your address for faster checkout
              </p>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 gap-6">

              {addresses.map((addr) => (

                <div
                  key={addr._id}
                  className={`bg-white rounded-3xl shadow-lg border overflow-hidden transition hover:shadow-2xl ${
                    addr.isDefault
                      ? "border-blue-500"
                      : "border-slate-200"
                  }`}
                >

                  {/* Top */}
                  <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-5 text-white flex justify-between items-start">

                    <div className="flex items-center gap-3">

                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                        <Home size={22} />
                      </div>

                      <div>
                        <h2 className="font-semibold text-lg">
                          Delivery Address
                        </h2>

                        <p className="text-sm opacity-80">
                          {addr.city}, {addr.state}
                        </p>
                      </div>
                    </div>

                    {addr.isDefault && (
                      <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        <BadgeCheck size={14} />
                        Default
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">

                    <div className="space-y-3 text-slate-700">

                      <p className="font-medium leading-7">
                        {addr.doorNo}, {addr.line1}
                        <br />
                        {addr.line2}
                        <br />
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={16} />
                        <span>{addr.contact}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 mt-6">

                      {!addr.isDefault && (
                        <button
                          onClick={() =>
                            setDefault(addr._id)
                          }
                          className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-xl transition cursor-pointer"
                        >
                          Set Default
                        </button>
                      )}

                      <button
                        onClick={() => {

                          setForm({
                            doorNo: addr.doorNo,
                            line1: addr.line1,
                            line2: addr.line2,
                            city: addr.city,
                            state: addr.state,
                            pincode: addr.pincode,
                            contact: addr.contact,
                            userId: user._id
                          })

                          setEditId(addr._id)
                          setShowForm(true)
                        }}
                        className="flex items-center gap-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-4 py-2 rounded-xl transition cursor-pointer"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteAddress(addr._id)
                        }
                        className="flex items-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-xl transition cursor-pointer"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showForm && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">

          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-5 flex justify-between items-center">

              <div>
                <h2 className="text-xl font-bold text-white">
                  {editId
                    ? "Edit Address"
                    : "Add Address"}
                </h2>

                <p className="text-blue-100 text-sm mt-1">
                  Enter your delivery information
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
            >

              <input
                name="doorNo"
                value={form.doorNo}
                onChange={handleChange}
                placeholder="Door No"
                className="border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <input
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="Phone Number"
                className="border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <input
                name="line1"
                value={form.line1}
                onChange={handleChange}
                placeholder="Address Line 1"
                className="md:col-span-2 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <input
                name="line2"
                value={form.line2}
                onChange={handleChange}
                placeholder="Address Line 2"
                className="md:col-span-2 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className="border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
                className="border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <input
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                className="md:col-span-2 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <button
                type="submit"
                className="md:col-span-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:scale-[1.02] transition-all shadow-lg"
              >
                {editId
                  ? "Update Address"
                  : "Add Address"}
              </button>

            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Address