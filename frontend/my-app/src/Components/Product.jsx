// import { Rating } from 'lucide-react'
import React from 'react'
import {Link} from 'react-router-dom'
import Rating from './Rating'

const Product = ({product}) => {
  return (
    <div className='bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden
     border border-slate-100'>
      <Link to={`/product/${product}`} className='group block'>
      <div className='h-66 overflow-hidden'>
        <img src={product.images[0].image} alt={product.name} className='h-full w-full
        group-hover:scale-105 transition'/>
      </div>
      <div className='px-4 pb-4 '>
        <h3 className='text-lg font-semibold text-gray-800 line-clamp-1'>{product.name}</h3>
        <p className='text-sm text-gray-500 line-clamp-2 pb-2'>{product.description}</p>
      </div>
      </Link>

      <div className='px-4 pb-4 space-y-2'>
        <div className='flex items-center gap-2'>
          <Rating/>
          <span className='text-xs text-gray-500 font-semibold' >({product.numOfReviews} reviews)</span>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-blue-600 font-bold text-lg'>₹ {product.price}</span>
          <button className='bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm 
          hover:bg-blue-600 transition'>Add to Cart</button>
        </div>
      </div>
    </div>
  )
}

export default Product


