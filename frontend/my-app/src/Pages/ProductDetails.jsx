import React from 'react'
import PageTitle from '../Components/PageTitle'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import Rating from '../Components/Rating'
import { useParams } from 'react-router-dom'
import shoe from '../assets/shoe1.jpg'
import { Minus, PackageCheck, Plus, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useCart } from '../features/context/CartContext'
import Back from '../Components/Back'



const ProductDetails = () => {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [quantity,setQuantity] = useState(1)

    const { addToCart } = useCart()


    useEffect(() => {
        getSingleProduct()
    }, [])

    const getSingleProduct = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/product/${id}`)
            if (!response.ok) {
                console.log("Failed to fetch posts");
            }

            const data = await response.json();

            setProduct(data.product)


            if (!data) {
                console.log("Get all products is fetch")
            }

        } catch (error) {
            console.error("error in frontend")
        }
    }

    const increaseQty = () => {
        if (quantity < product.stock){
            setQuantity((prev)=> prev + 1)
        }
    }

    const decreaseQty = () => {
        setQuantity((prev)=> prev - 1)
    }

    if(!product) return <p>Loading ....</p>

    return (
        <div className='min-h-screen bg-gray-50 '>
            <PageTitle title="Product Name | Details " />
            
            <main className='max-w-7xl mx-auto px-4 py-8 md:py-12'>
                <Back/>
                {/* Product Session */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8'>
                    {/* Image Gallery */}
                    <div>
                        <div className='aspect-square overflow-hidden rounded-xl'>
                            <img src={product.image}
                                alt="Product Image" className='w-full h-full object-cover transition-transform hover:scale-105 
                        duration-700'/>
                        </div>
                    </div>
                    {/* Product info */}
                    <div className='flex flex-col '>
                        <h3 className='text-3xl font-semibold text-gray-900 mb-2'>{product.name}</h3>
                        <div className='flex items-center gap-4 mb-4'>
                            <Rating value={3} disable={true} />
                            <span className='text-sm text-gray-500 font-medium'>5 Reviews</span>
                        </div>

                        <div className='mb-6 flex items-baseline gap-3'>
                            <span className='text-amber-600 font-semibold text-4xl'>₹{product.price}</span>
                            {/* <span className='text-lg text-gray-400 line-through'>₹1900</span> */}
                            {/* <span className='text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded'>15% off</span> */}
                        </div>

                        <p className='text-gray-600 leading-relaxed mb-8 text-lg'>How can i explain the about the product its fantastic!!</p>

                        <div className='border-t border-gray-100 pt-8 mb-8'>
                            <div className='flex items-center gap-2 mb-6'>
                                <PackageCheck className='text-green-600 w-5 h-5' />
                                <span className='font-semibold text-green-700 text-sm'>IN Stock ({product.stock} Available)</span>
                            </div>

                            <div className='flex flex-wrap items-center gap-4'>
                                <div className='flex items-center border-2 border-gray-100 rounded-xl bg-white overflow-hidden'>
                                    <button onClick={decreaseQty}
                                    className='p-4 hover:bg-gray-50 hover:text-amber-600 transition-colors'><Minus size={18} /></button>
                                    <span className='w-10 text-center font-bold text-gray-800'>{quantity}</span>
                                    <button onClick={increaseQty}
                                    className='p-4 hover:bg-gray-50 hover:text-amber-600 transition-colors'><Plus size={18} /></button>
                                </div>

                                <button onClick={() => addToCart({ ...product, quantity })} className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8
                            rounded-xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-100 
                            active:scale-95'>
                                    <ShoppingCart />Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default ProductDetails