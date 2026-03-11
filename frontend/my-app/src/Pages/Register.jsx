import React from 'react'
import { useState } from 'react'
import {Mail} from 'lucide-react'
import {User} from 'lucide-react'
import {KeyRound} from 'lucide-react'


const Register = () => {
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")


     const registerUser = async()=>{
      try {
        const res = await fetch("http://localhost:8000/api/v1/register",{
            method:"POST",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({
              name,
              email,
              password
            })
        })
        const data = await res.json()
        if(data.success){
          alert("User Registered successfully")
        }else{
          alert(data.message)
        }
      } catch (error) {
        console.log("error")
        alert("Server error")
      }
        
    }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100' id='body'>
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        <div className="space-y-4 relative">

        <input type="text" className='w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
        placeholder='    Name'
        value={name}
        onChange={(e)=>{setName(e.target.value)}}
         />
         <User size={17} className='absolute top-3 left-1'/>

        
    
           <input type="email" className='w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
        placeholder='    Email'
        value={email}
        onChange={(e)=>{setEmail(e.target.value)}}
         />
        <Mail  size={17} className='absolute bottom-17 left-1'/>

      
       

        <input type="text"className='w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
        placeholder='    Password'
        value={password}
        onChange={(e)=>{setPassword(e.target.value)}}
         />
        <KeyRound  size={17} className='absolute bottom-7 left-1'/>

         </div>
         <br />

        <button onClick={registerUser} className='w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600'>Register</button>
        </div>
    </div>
  )
}

export default Register