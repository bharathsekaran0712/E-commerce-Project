import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import headphone from '../assets/headphone.jpg'
import shirt from '../assets/T-shirt.jpg'
import shoe from '../assets/shoe.jpg'

   const images = [
        headphone,
        shirt,
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

    // const prevSlide = () =>{
    //     setCurrent((prev)=>(prev === 0 ? images.length - 1 : prev - 1))
    // }

    // const nextSlide = () => {
    //     setCurrent((prev = (prev + 1) % images.length))
    // }
  return (
    <div className='relative w-full shadow-lg overflow-hidden '>
        {/* sliders */}
        <div className='flex transition-transform duration-700 ease-in-out' style={{transform:
            `translateX(-${current * 100}%`
        }}>
            {images.map((image,index)=>(
                <img src={image} key={index} className='h-75 w-full md:h-117.5 object-cover shrink-0'/>
            ))}
        </div>
        {/* Previous */}
        {/* <button onClick={prevSlide} className='absolute left-4 top-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition'>
            <ChevronLeft/>
        </button> */}

        {/* Next */}
        {/* <button onClick={nextSlide} className='absolute right-4 top-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition'>
            <ChevronRight/>
        </button> */}
    </div>
  )
}

export default ImageSlider