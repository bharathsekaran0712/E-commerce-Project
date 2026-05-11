import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import "./Login.css"
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

const Login = () => {

    const [emailORphone, setEmailORPhone] = useState("")
    const [password, setPassword] = useState("")
    const [showPasword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)

    const navigate = useNavigate()

    // const url = "https://e-commerce-backend-zg40.onrender.com"
    const url = "http://localhost:8000"

    const loginUser = async () => {
        if (!emailORphone || !password) {
            toast.error("Please enter email or password")
            return
        }

        try {
            setLoading(true)

            const res = await fetch(`${url}/api/v1/login`, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    emailORphone: emailORphone,
                    password: password
                })
            })
            const data = await res.json()

            if (data.success) {
                localStorage.setItem("token", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))

                toast.success("Login successful")

                setTimeout(() => {
                    if (data.user.role === "Admin") {
                        navigate("/AdminDashboard")
                    } else {
                        navigate("/Home")
                    }
                }, [1500])
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log("error")
            toast.error("Server error")
        } finally {
            setLoading(false)
        }
    }

    const loginWithGoogle = async () => {
        try {
            setGoogleLoading(true)
        } catch (error) {
            toast.error("Google sign-in failed")
            setGoogleLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100' id='body'>
            <Toaster position='top-center' />
            <div className="bg-white p-8 rounded-2xl shadow-lg w-96">

                <h2 className='text-2xl font-bold text-center mb-6'>Login</h2>

                <div className='space-y-4 relative overflow-hidden'>
                    <input
                        type="text"
                        className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder='Email/phone'
                        value={emailORphone}
                        onChange={(e) => { setEmailORPhone(e.target.value) }}
                    />

                    <div className='relative flex'>
                        <input
                            type={showPasword ? "text" : "password"}
                            className="relative w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                            placeholder='Password'
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                        />

                        <span
                            className='absolute right-4 bottom-7 cursor-pointer hover:text-blue-500'
                            onClick={() => setShowPassword(!showPasword)}
                        >
                            {showPasword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                        </span>
                    </div>
                </div>

                <button
                    onClick={loginUser}
                    className='w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors'
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

    
                <div className='flex items-center gap-3 my-4'>
                    <hr className='flex-1 border-gray-200' />
                    <span className='text-sm text-gray-400'>or</span>
                    <hr className='flex-1 border-gray-200' />
                </div>

            
                <button
                    onClick={loginWithGoogle}
                    disabled={googleLoading}
                    className='w-full flex items-center justify-center gap-3 border border-gray-300 p-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                        <g fill="none" fillRule="evenodd">
                            <path
                                d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                                fill="#4285F4"
                            />
                            <path
                                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                                fill="#34A853"
                            />
                            <path
                                d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                                fill="#EA4335"
                            />
                        </g>
                    </svg>
                    <span className='text-sm font-medium text-gray-700'>
                        {googleLoading ? "Redirecting..." : "Continue with Google"}
                    </span>
                </button>

                <p className="text-sm flex justify-center items-center mb-3 mt-6">
                    New user?{" "}
                    <Link to="/register" className="text-blue-500 hover:underline ml-1">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login
