import React, { useState } from 'react'
import {useNavigate} from "react-router-dom"
import "./Login.css"
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import {EyeIcon, EyeOffIcon, Mail } from 'lucide-react'
import { KeyRound } from 'lucide-react'

const Login = () => {
    
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [showPasword, setShowPassword] = useState(false)
    const [loading,setLoading] = useState(false)

    const navigate = useNavigate()

    const loginUser = async()=>{
        

        if(!email || !password){
            toast.error("Please enter email or password")
            return
        }

        try {
            setLoading(true)

            const res = await fetch("http://localhost:8000/api/v1/login",{
            method:"POST",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({
                email:email,
                password:password
            })
        })
        const data = await res.json()
        
        if(data.success){
            localStorage.setItem("token",data.token)
            localStorage.setItem("user", JSON.stringify(data.user))
            
            toast.success("Login successful")

            setTimeout(()=>{
                navigate("/Home")
            },[1500])
        }else{
            toast.error(data.message)
        } 
        } catch (error) {
            console.log("error")
            toast.error("Server error")
        }finally{
            setLoading(false)
        }
        
    }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100' id='body'>
        <Toaster position='top-center'/>
        <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        
        <h2 className='text-2xl font-bold text-center mb-6'>Login</h2>
        
        
        <div className='space-y-4 relative overflow-hidden'>
        <input type="email" className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder='Email'
        value={email}
        onChange={(e)=>{setEmail(e.target.value)}} />

        <div className='relatve flex'>

        <input type={showPasword ? "text" : "password"} className="relative w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
        placeholder='Password'
        value={password}
        onChange={(e)=>{setPassword(e.target.value)}} />

        <span className='absolute right-4 bottom-7 cursor-pointer hover:text-blue-500'
         onClick={()=> setShowPassword(!showPasword)}>
            {showPasword ? <EyeOffIcon size={18}/> : <EyeIcon size={18}/>}
        </span>

        </div>
        </div>

        <button onClick={loginUser} className='w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600'>
            {loading ? "Logging in..." : "Login" }
        </button>

        <p className="text-sm justify-center items-center mb-3">
         New user?{" "}
        <Link to="/register" className="text-blue-500 hover:underline">
        Register
        </Link>
        </p>
        </div>
    </div>
  )
}

export default Login








