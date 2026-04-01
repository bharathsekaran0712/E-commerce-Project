import React from "react"
import { useNavigate } from "react-router-dom"
import Back from "../Components/Back"

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  return (<>
    
    <div className="min-h-screen bg-gray-100 p-6 flex gap-6">
      
      <div className="w-1/4 bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">My Account</h2>

        <ul className="space-y-3">
          <li className="cursor-pointer text-blue-500 hover:text-blue-500">Profile Info</li>
          <li onClick={() => navigate("/orders")} className="cursor-pointer hover:text-blue-500">
            My Orders
          </li>
          <li className="cursor-pointer hover:text-blue-500">Addresses</li>
          <li className="cursor-pointer hover:text-blue-500">Payments</li>
        </ul>

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      
      <div className="flex-1 bg-white p-6 rounded-xl shadow">

        
        <div className="grid grid-cols-2 gap-6 sd:grid grid-cols-1 gap-3 ">

          <div>
            <label className="text-gray-500">Full Name</label>
            <p className="font-medium">{user.name}</p>
          </div>

          <div>
            <label className="text-gray-500">Email</label>
            <p className="font-medium">{user.email}</p>
          </div>

          <div>
            <label className="text-gray-500">Phone</label>
            <p className="font-medium">{user?.phone || "Not added"}</p>
          </div>

          <div>
            <label className="text-gray-500">Address</label>
            <p className="font-medium">{user?.address || "Not added"}</p>
          </div>

        </div>

        
        <div className="mt-6 flex gap-4">
          <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            Edit Profile
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View Orders
          </button>
        </div>

      </div>
    </div>
    </>
  )
}

export default Profile