import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageTitle from '../Components/PageTitle'
import Footer from '../Components/Footer'
import Navbar from '../Components/Navbar'
import Rating from '../Components/Rating'
import {Link} from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import { useCart } from '../features/context/CartContext'
import Form from "../Components/Form"
import { SendToBack, X } from 'lucide-react'




const Products = () => {
    const [products, setProducts] = useState([])
    const [category,setCategory] = useState("All")
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
    const [productId,setProductId] = useState("")
    const [rating,setRating] = useState("")
    const { keyword } = useParams()
    const user = JSON.parse(localStorage.getItem("user"))
    const { addToCart } = useCart()
    const navigate = useNavigate()

    const url = "https://e-commerce-backend-zg40.onrender.com"

    const handleSubmit = async (e) => {
    e.preventDefault()

    try {
        const Url = editProduct
            ? `${url}+/api/v1/product/${editProduct._id}`
            : `${url}+"/api/v1/product/addProduct"`

        const method = editProduct ? "PUT" : "POST"

        const res = await fetch(Url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(formData)
        })

        const data = await res.json()
        console.log(data)

        if (res.ok) {
            toast.success(editProduct ? "Product updated" : "Product added")

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

    useEffect(() => {
        if (keyword) {
            searchProducts()
        } else {
            getAllProducts()
        }
    }, [keyword])

    const getAllProducts = async () => {
        try {
            const response = await fetch(`${url}"/api/v1/products/getAllProducts"`)
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

      const res = await fetch(`${url}+"/api/getCart"`, {
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
            `${url}+/api/v1/products/search?keyword=${keyword}`
        )

        const data = await response.json()

        setProducts(data.products || [])

    } catch (error) {
        console.error("Error fetching search products", error)
    }
}


const addReviews = async() => {
    try {
        const token = localStorage("token")

        const res = await fetch(`${url}+"/api/v1/product/review"`,{
            method:"POST",
            headers:{
                "content-type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body:JSON.stringify({
                id:product._id,
                name,
                rating,
                ratingAvg,
                user:user
            })
        })

        const data = await res.json()

        if(res.ok){
            toast.success("Product review added")
            console.log("Product review added")
        }
    } catch (error) {
        console.log(error.data)
    }
}
  
    const categoryFiltered = category === "All" 
    ? products : products.filter((product)=> product.category === category)
    console.log(categoryFiltered,"categoryFiltered")
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
                                            <button onClick={()=>setCategory(cat)} className={`transition-colors font-semibold ${
                                                category === cat ? "text-blue-600" : "text-gray-600 hover:text-blue-700" 
                                            }`}>
                                                {cat}</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>

                        <section className='w-full md:w-3/4'>
                            <div className='flex items-center justify-between'>
                                <h3 className='text-lg font-semibold text-gray-800 line-clamp-1 mb-2'>
                                    {keyword ? `Search Results for "${keyword}"` : "Our Products"}
                                </h3>

                                <div>
                    
                                {
                                   user.role === "Admin" &&
                                   <button onClick={() => {setShowForm(true) 
                                    setEditProduct(null)}} className='border border-black bg-blue-600 text-white mb-2 rounded-lg px-3 py-2 cursor-pointer'>
                                        Add Product</button>
                                }
                                </div>
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
                                      <Rating viewOnly={true} rating={product.ratings}/>
                                      <span className='text-xs text-gray-500 font-semibold' >({product.numOfReviews} reviews) </span>
                                      <span className='text-[11px] text-green-600'>{product.stock} Instocks</span>
                                      </div>

                                      <div className='flex items-center justify-between'>
                                      <span className='text-blue-600 font-bold text-lg'>₹ {product.price}</span>
                                      {/* {
                                        user.role === "Admin" && 
                                        <button className='border border-black bg-red-500 rounded-lg px-5 py-1'>Edit</button>
                                      } */}
                                      {
                                        user.role === "Admin" ?
                                        (<button onClick={() => handleEdit(product)} className='border border-black bg-yellow-500 rounded-lg px-6 py-1' handleEdit = {handleEdit}>Edit</button>) 
                                        : (<button className='bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm 
                                        hover:bg-blue-600 transition hover:scale-105' onClick={()=> addToCart({...product,quantity:1}).then((res)=>{fetchCartFromBackend();toast.success(`${product.name} is added to cart`)})}>Add to Cart</button>)
                                      }
                                      {/* <button className='bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm 
                                        hover:bg-blue-600 transition hover:scale-105' onClick={()=> addToCart({...product,quantity:1}).then((res)=>{fetchCartFromBackend();toast.success(`${product.name} is added to cart`)})}>Add to Cart</button> */}
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