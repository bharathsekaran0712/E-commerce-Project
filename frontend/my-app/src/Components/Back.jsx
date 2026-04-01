import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


const Back = () => {
    const navigate = useNavigate()
  return (
    <div>
        <button
           onClick={() => navigate(-1)}
           className="flex items-center gap-2 mb-3 text-gray-600 hover:text-black"
        >
        <ArrowLeft size={20} />
        Back
        </button>
    </div>
  )
}

export default Back