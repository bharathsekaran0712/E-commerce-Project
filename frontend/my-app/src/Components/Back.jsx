import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


const Back = () => {
    const navigate = useNavigate()
  return (
    <div>
        <button
           onClick={() => navigate(-1)}
           className="flex items-center gap-2 bg-white text-black shadow-md px-5 py-3 mb-2 rounded-xl hover:scale-105 transition cursor-pointer"
        >
        <ArrowLeft size={20} />
        Back
        </button>
    </div>
  )
}

export default Back