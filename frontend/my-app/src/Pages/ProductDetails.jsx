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

                                <button onClick={() => addToCart({ ...product, quantity:1 })} className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8
                            rounded-xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-100 
                            active:scale-95'>
                                    <ShoppingCart />Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

    <div className='mt-12 bg-white rounded-2xl p-6 border border-gray-100'>
    
    <h2 className='text-2xl font-bold text-gray-900 mb-6'>
        FAQ & Customer Support
    </h2>

    <div className='space-y-4'>

        <details className='group border border-gray-200 rounded-xl p-4 cursor-pointer'>
            <summary className='flex justify-between items-center font-semibold text-gray-800 list-none'>
                Is this product returnable?
                <span className='group-open:rotate-180 transition-transform'>⌄</span>
            </summary>

            <p className='mt-3 text-sm text-gray-600 leading-relaxed'>
                Yes, this product can be returned within 7 days of delivery if it is unused and in original condition.
            </p>
        </details>

        <details className='group border border-gray-200 rounded-xl p-4 cursor-pointer'>
            <summary className='flex justify-between items-center font-semibold text-gray-800 list-none'>
                How long does delivery take?
                <span className='group-open:rotate-180 transition-transform'>⌄</span>
            </summary>

            <p className='mt-3 text-sm text-gray-600 leading-relaxed'>
                Delivery usually takes 3–7 business days depending on your location.
            </p>
        </details>

        
        <details className='group border border-gray-200 rounded-xl p-4 cursor-pointer'>
            <summary className='flex justify-between items-center font-semibold text-gray-800 list-none'>
                Is Cash on Delivery available?
                <span className='group-open:rotate-180 transition-transform'>⌄</span>
            </summary>

               <p className='mt-3 text-sm text-gray-600 leading-relaxed'>
                 Yes, Cash on Delivery (COD) is available for selected locations.
               </p>
        </details>

            <details className='group border border-gray-200 rounded-xl p-4 cursor-pointer'>
              <summary className='flex justify-between items-center font-semibold text-gray-800 list-none'>
                How can I contact customer support?
                <span className='group-open:rotate-180 transition-transform'>⌄</span>
              </summary>

              <p className='mt-3 text-sm text-gray-600 leading-relaxed'>
                You can contact our support team through email or phone for any product or order related queries.
              </p>
              </details>
            </div>

            <div className='mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        
                <div>
                    <h3 className='text-lg font-semibold text-blue-900 mb-1'>
                       Need more help?
                    </h3>

                    <p className='text-sm text-blue-700'>
                      Our customer support team is available 24/7 to assist you.
                    </p>
               </div>

                <div className='flex gap-3'>
                    <button className='bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all'>
                        Contact Support
                    </button>

                    <button className='border border-blue-200 text-blue-700 hover:bg-blue-100 px-5 py-2.5 rounded-xl text-sm font-medium transition-all'>
                        Live Chat
                    </button>
                  </div>
                </div>
              </div>
            </main>
            <Footer />
        </div>
    )
}

export default ProductDetails