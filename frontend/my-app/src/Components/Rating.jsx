import { Star } from 'lucide-react'
import React from 'react'

const Rating = () => {
  return (
    <div className='flex '>
        <Star className='text-amber-300 fill-amber-300'/>
        <Star className='text-amber-300 fill-amber-300'/>
        <Star className='text-amber-300 fill-amber-300'/>
        <Star/>
        <Star/>
    </div>
  )
}

export default Rating