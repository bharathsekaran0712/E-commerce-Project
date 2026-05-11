import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast"
import Navbar from "../Components/Navbar"
import {
  User,
  Mail,
  Shield,
  MapPin,
  ShoppingBag,
  LogOut,
  Pencil,
  X
} from "lucide-react"

const Profile = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  )

  const [showEdit, setShowEdit] = useState(false)

  const [form, setForm] = useState({
    name: "",
    emailORphone: "",
    userId: user._id
  })

  const navigate = useNavigate()

  const token = localStorage.getItem("token")

  const url = "https://e-commerce-backend-zg40.onrender.com"

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch(`${url}/api/v1/user/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user))
        setUser(data.user)
        setShowEdit(false)
        toast.success("Profile Updated")
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : "U"

  return (
    <>
      <Navbar />
      <Toaster position="top-center" />

      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4 md:p-8">

        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <div className="w-full lg:w-[280px] bg-white rounded-3xl shadow-lg overflow-hidden">

            {/* Top */}
            <div className="bg-gradient-to-br from-indigo-600 via-blue-500 to-cyan-400 p-8 text-white flex flex-col items-center">

              <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white flex items-center justify-center text-3xl font-bold shadow-lg">
                {initials}
              </div>

              <h2 className="mt-4 text-xl font-bold">
                {user?.name || "User"}
              </h2>

              <p className="text-sm opacity-90 mt-1">
                {user?.role || "User"}
              </p>
            </div>

            {/* Menu */}
            <div className="p-5 space-y-3">

              <button className="w-full flex items-center gap-3 bg-blue-50 text-blue-600 p-3 rounded-xl font-medium">
                <User size={18} />
                Profile
              </button>

              <button
                onClick={() => navigate("/orders")}
                className="w-full flex items-center gap-3 hover:bg-gray-100 p-3 rounded-xl transition cursor-pointer"
              >
                <ShoppingBag size={18} />
                {user.role === "Admin" ? "Orders" : "My Orders"}
              </button>

              <button
                onClick={() => navigate("/Address")}
                className="w-full flex items-center gap-3 hover:bg-gray-100 p-3 rounded-xl transition cursor-pointer"
              >
                <MapPin size={18} />
                Addresses
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 mt-6 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition cursor-pointer"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-3xl shadow-lg p-6 md:p-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  My Profile
                </h1>

                <p className="text-gray-500 mt-1">
                  Manage your account information
                </p>
              </div>

              <button
                onClick={() => {
                  setForm({
                    name: user.name || "",
                    emailORphone: user.emailORphone || "",
                    userId: user._id
                  })

                  setShowEdit(true)
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-3 rounded-xl hover:scale-105 transition-all shadow-lg cursor-pointer"
              >
                <Pencil size={18} />
                Edit Profile
              </button>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-3 text-indigo-600">
                  <User />
                  <h3 className="font-semibold">Full Name</h3>
                </div>

                <p className="text-slate-700 font-medium">
                  {user?.name || "Not Provided"}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-3 text-blue-600">
                  <Mail />
                  <h3 className="font-semibold">Email / Phone</h3>
                </div>

                <p className="text-slate-700 font-medium">
                  {user?.emailORphone || "Not Provided"}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-3 text-purple-600">
                  <Shield />
                  <h3 className="font-semibold">Role</h3>
                </div>

                <p className="text-slate-700 font-medium">
                  {user?.role || "Not Provided"}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-3 text-cyan-600">
                  <MapPin />
                  <h3 className="font-semibold">Account ID</h3>
                </div>

                <p className="text-slate-700 font-medium break-all">
                  {user?._id || "Not Available"}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-5 flex items-center justify-between">

              <div>
                <h2 className="text-white text-xl font-bold">
                  Edit Profile
                </h2>

                <p className="text-blue-100 text-sm mt-1">
                  Update your details
                </p>
              </div>

              <button
                onClick={() => setShowEdit(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleUpdate}
              className="p-6 flex flex-col gap-5"
            >

              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  Email / Phone
                </label>

                <input
                  type="text"
                  name="emailORphone"
                  value={form.emailORphone}
                  onChange={handleChange}
                  placeholder="Enter email or phone"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:scale-[1.02] transition-all shadow-lg cursor-pointer"
              >
                Update Profile
              </button>

            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Profile