import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import headphone from '../assets/headphone.jpg'
import shirt from '../assets/T-shirt.jpg'
import shoe from '../assets/shoe.jpg'
import Samsung from '../assets/Samsung.jpg'

   const images = [
        headphone,
        Samsung,
        shoe
    ]

const ImageSlider = () => {
    const [current,setCurrent] = useState(0)

    useEffect(()=>{
        const interval = setInterval(()=>{
            setCurrent((prev)=>(prev + 1) % images.length)
        },4000)
        return ()=>clearInterval(interval)
    },[])

    const prevSlide = () =>{
        setCurrent((prev)=>(prev === 0 ? images.length - 1 : prev - 1))
    }

    const nextSlide = () => {
        setCurrent((prev => (prev + 1) % images.length))
    }
  return (
    <div className='relative w-full shadow-lg overflow-hidden '>
    
        <div className='flex transition-transform duration-700 ease-in-out' style={{transform:
            `translateX(-${current * 100}%)`
        }}>
            {images.map((image,index)=>(
                <img src={image} key={index} className='h-75 w-full md:h-120 object-cover shrink-0'/>
             ))}
        </div>
        
        <button onClick={prevSlide} className='absolute left-4 top-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition'>
            <ChevronLeft/>
        </button>

        
        <button onClick={nextSlide} className='absolute right-4 top-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition'>
            <ChevronRight/>
        </button>

        <div className="absolute bottom-4 w-full flex justify-center gap-2">
          {images.map((_, index) => (
          <div 
            key={index}
            className={`w-3 h-3 rounded-full ${
            current === index ? "bg-white" : "bg-gray-400"
            }`}
          />
            ))}
         </div>
    </div>
  )
}

export default ImageSlider