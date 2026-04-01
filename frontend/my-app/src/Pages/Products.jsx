import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageTitle from '../Components/PageTitle'
import Footer from '../Components/Footer'
import Navbar from '../Components/Navbar'
import Rating from '../Components/Rating'
import {Link} from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import { useCart } from '../features/context/CartContext'



const Products = () => {
    const [products, setProducts] = useState([])
    const [category,setCategory] = useState("All")
    const [cartItems,setCartItems] = useState([])
    const { keyword } = useParams()

    const { addToCart } = useCart()


    useEffect(() => {
        if (keyword) {
            searchProducts()
        } else {
            getAllProducts()
        }
    }, [keyword])

    const getAllProducts = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/v1/products/getAllProducts")
            if (!response.ok) {
                console.log("Failed to fetch posts");
            }

            const data = await response.json();
        
            setProducts(data.products)


            if (!data) {
                console.log("Get all products is fetch")
            }

        } catch (error) {
            console.error("error in frontend")
        }
    }

      const fetchCartFromBackend = async () => {
    try {
        console.log(fetchCartFromBackend,"fetchCartFromBackend")
      const token = localStorage.getItem("token");
console.log(token,"token")
      if (!token) return;

      const res = await fetch("http://localhost:8000/api/getCart", {
        method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
        body:JSON.stringify({userId:JSON.parse(localStorage.getItem("user"))._id})
      });

      const data = await res.json();

      if (data && data.length) {
        setCartItems(data[0].items);
      }
    } catch (error) {
      console.log("Cart fetch error:", error);
    }
  };

    const searchProducts = async () => {
    try {

        const response = await fetch(
            `http://localhost:8000/api/v1/products/search?keyword=${keyword}`
        )

        const data = await response.json()

        setProducts(data.products || [])

    } catch (error) {
        console.error("Error fetching search products", error)
    }
}

    const categoryFiltered = category === "All" 
    ? products : products.filter((product)=> product.category === category)


    return (
        <>
          <Navbar cartItems={cartItems}/> 
            <div className='flex flex-col min-h-screen bg-gray-50'>
                <Toaster/>
                <PageTitle title={"Products | E-Commerce"} />

                <main className='grow container mx-auto px-4 py-8'>

                    <div className='flex flex-col md:flex-row gap-8'>

                        <aside className='w-full md:w-1/4'>
                            <div className='bg-white p-6 rounded-lg shadow-sm sticky top-24'>
                                <h3 className='text-xl font-bold mb-4 text-gray-800 border-b
                                 border-slate-200  pb-2'>Categories</h3>

                                <ul className='space-y-2'>
                                    {["All","Accessories", "Fashion", "Mobile Phones", "Laptops"].map((cat) => (
                                        <li key={cat}>
                                            <button onClick={()=>setCategory(cat)} className='text-gray-600
                                             hover:text-blue-600 transition-colors font-semibold'>
                                                {cat}</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>

                        <section className='w-full md:w-3/4'>
                            <div>
                                <h3 className='text-lg font-semibold text-gray-800 line-clamp-1 mb-2'>
                                    {keyword ? `Search Results for "${keyword}"` : "Our Products"}
                                </h3>
                            </div>

                            
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 '>
                                {
                                    categoryFiltered.map((product)=>(
                                        
                                        <div className='bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden
                                        border border-slate-100'>   
                                        <Link to={`/product/${product._id}`}  key={product._id}>                                 
                                       <div className='h-66 overflow-hidden'>
                                       <img src={product.image} alt={product.name} className='h-full w-full
                                       group-hover:scale-105 transition'/>
                                      </div>
                                      </Link>
                                      <div className='px-4 pb-4 '>
                                      <h3 className='text-lg font-semibold text-gray-800 line-clamp-1'>{product.name}</h3>
                                      <p className='text-sm text-gray-500 line-clamp-2 pb-2'>{product.description}</p>
                                      </div>
                                    

                                      <div className='px-4 pb-4 space-y-2'>
                                      <div className='flex items-center gap-2'>
                                      <Rating/>
                                      <span className='text-xs text-gray-500 font-semibold' >({product.numOfReviews} reviews)</span>
                                      </div>

                                      <div className='flex items-center justify-between'>
                                      <span className='text-blue-600 font-bold text-lg'>₹ {product.price}</span>
                                      <button className='bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm 
                                        hover:bg-blue-600 transition hover:scale-105' onClick={()=> addToCart({...product,quantity:1}).then((res)=>{fetchCartFromBackend();toast.success(`${product.name} is added to cart`)})}>Add to Cart</button>
                                      </div>
                                      </div>
                                      </div>

                                    )  
                                    )
                                }

                                </div>
                                </section>
                                </div>
                                </main>
                               <Footer />
                               </div>
                                </>

    )
}

export default Products