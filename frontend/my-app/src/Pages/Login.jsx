import React, { useState } from 'react'
import {useNavigate} from "react-router-dom"
import "./Login.css"
import { Mail } from 'lucide-react'
import { KeyRound } from 'lucide-react'

const Login = () => {
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [loading,setLoading] = useState(false)

    const loginUser = async()=>{
        const navigate = useNavigate()

        if(!email || !password){
            alert("Please enter email or password")
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
            alert("Login successful")

            navigate("/")
        }else{
            alert("data.message")
        } 
        } catch (error) {
            console.log("error")
            alert("Server error")
        }finally{
            setLoading(false)
        }
        
    }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100' id='body'>
        <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        
        <h2 className='text-2xl font-bold text-center mb-6'>Login</h2>
        
        
        <div className='space-y-4 relative overflow-hidden'>
        <input type="email" className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder='    Email'
        value={email}
        onChange={(e)=>{setEmail(e.target.value)}} />
        <Mail  size={17} className='absolute bottom-17 left-1'/>

        <input type="password" className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder='    Password'
        value={password}
        onChange={(e)=>{setPassword(e.target.value)}} />
        <KeyRound  size={17} className='absolute bottom-7 left-1'/>
        </div>

        <p className='mb-4'>forgot password?</p>

        <button onClick={loginUser} disabled={loading} className='w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600'>
            {loading ? "Logging in..." : "Login" }
        </button>
        </div>
    </div>
  )
}

export default Login








