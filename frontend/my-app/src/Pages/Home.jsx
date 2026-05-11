import React, { useEffect } from 'react'
import Navbar from '../Components/Navbar'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import ImageSlider from '../Components/ImageSlider'
import Footer from '../Components/Footer'
import PageTitle from '../Components/PageTitle'
import { useState } from 'react'
import Rating from '../Components/Rating'
import { Link } from 'react-router-dom'
import { useCart } from '../features/context/CartContext'
import Form from '../Components/Form'



const Home = () => {
  
  const [products,setProducts] = useState([])
  const [cartItems,setCartItems] = useState([])
  const [showForm,setShowForm] = useState(false)
  const [formData,setFormData] = useState({
        name:"",
        price:"",
        category:"",
        image:"",
        numOfReviews:"",
        stock:"",
        description:""
   })
  const [editProduct,setEditProduct] = useState(null)

  const user = JSON.parse(localStorage.getItem("user"))

  const { addToCart } = useCart()

  const url = "https://e-commerce-backend-zg40.onrender.com"

  useEffect(()=>{
    fetchCartFromBackend()
    getAllProducts()
  },[])

  const getAllProducts = async () => {
    try {

      const response = await fetch(`${url}/api/v1/products/getAllProducts`)

      const data = await response.json()

      // console.log(data)

      setProducts(data.products)

    } catch (error) {
      console.log("Error fetching products", error)
    }
  }

  const fetchCartFromBackend = async () => {
    try {
        console.log(fetchCartFromBackend,"fetchCartFromBackend")
        const token = localStorage.getItem("token");
        console.log(token,"token")
        if (!token) return;

      const res = await fetch(`${url}/api/getCart`, {
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
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
        const url = `${url}/api/v1/product/${editProduct._id}`

        const res = await fetch(url, {
            method:"PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(formData)
        })

        const data = await res.json()
        console.log(data)

        if (res.ok) {
            toast.success("Product updated")

            setFormData({
                name:"",
                price:"",
                category:"",
                image:"",
                numOfReviews:"",
                description:""
            })

            setEditProduct(null)
            setShowForm(false)
            getAllProducts()
        }else{
            toast.error(data.message || "update failed")
        }

    } catch (error) {
        toast.error("Error saving product")
    }
}

   const handleEdit = (product) => {
        setEditProduct(product)

        setFormData({
            name: product.name,
            price: product.price,
            category: product.category,
            image: product.image,
            numOfReviews: product.numOfReviews,
            stock: product.stock,
            description: product.description
        })

        setShowForm(true)
    }




  return (<>
    <PageTitle title={"Home | E-commerce"}/>
    <Navbar cartItems={cartItems}/>
    
    <ImageSlider/>
    <div className='mt-12 p-8 flex flex-col items-center justify-around text-gray-900'>
      <Toaster/>
      <h1 className="text-4xl font-semibold mb-8 text-blue-700 text-center drop-shadow-sm">Latest Collections</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">


        {products.filter((product)=> product.price >= 59000).map((product)=>(
           
          <div className='bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden
            border border-slate-100'>
          <Link to={`/product/${product._id}`} key={product._id} >
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
           <Rating  viewOnly={true} rating={product.ratings}/>
           <span className='text-xs text-gray-500 font-semibold' >({product.numOfReviews} reviews)</span>
          </div>

          <Form
              showForm={showForm}
              setShowForm={setShowForm}
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleSubmit}
              editProduct={editProduct}
              setEditProduct={setEditProduct}
              />

          <div className='flex items-center justify-between'>
            <span className='text-blue-600 font-bold text-lg'>₹ {product.price}</span>
            {
              user.role === "Admin" ? 
              (<button className='border border-black bg-yellow-500 rounded-lg px-6 py-1' onClick={() => handleEdit(product)}>Edit</button>)
              :(<button className='bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm 
                                        hover:bg-blue-600 transition hover:scale-105' onClick={()=> addToCart({...product,quantity:1}).then((res)=>{fetchCartFromBackend();toast.success(`${product.name} is added to cart`)})}>Add to Cart</button>)
            }
            {/* <button onClick={()=> addToCart({...product,quantity:1}).then((res)=>{fetchCartFromBackend();toast.success(`${product.name} is added to cart`)})}  className='bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm 
            hover:bg-blue-600 transition hover:scale-105'>Add to Cart</button> */}
         </div>
         </div>
         </div>
         
           ))}
        </div>
        </div> 
        <Footer/>
      </>
  )
}

export default Home