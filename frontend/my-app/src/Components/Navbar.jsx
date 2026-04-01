import {Link, useNavigate} from 'react-router-dom'
import { X,Menu, Search, ShoppingBag, ShoppingCart,User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {useCart} from '../features/context/CartContext'
import { useLocation } from 'react-router-dom'

const Navbar = (props) => {
  const [open,setOpen]= useState(false)
  const [search,setSearch] = useState("")
  const [cartItems,setCartItems]= useState([])
  const navigate = useNavigate()

  console.log(props.cartItems,cartItems)
  // const { cartItems } = useCart()

  useEffect(()=>{
    fetchCartFromBackend()
  },[])

  useEffect(()=>{
    fetchCartFromBackend()
  },[props.cartItems])

  const fetchCartFromBackend = async () => {
    try {
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


  const searchHandler = (e)=>{
    e.preventDefault()

    if(search.trim()){
      navigate(`/search/${search}`)
    }else{
      navigate("/products")
    }
  }

  const location = useLocation()

  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))


  return (
    <>
    <nav className="sticky top-0 w-full bg-white shadow-md z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
         
            <div>
            <Link to="/Home" className='flex items-center gap-2 text-2xl font-bold text-blue-800'>
            <ShoppingBag/>
            <span>Shopping hub</span>
            </Link>
        </div>


        <div className='hidden md:flex items-center gap-8'>
        <Link className='text-gray-700 hover:text-blue-600 transition font-semibold' to="/Home">Home</Link>
        <Link className='text-gray-700 hover:text-blue-600 transition font-semibold' to="/Products">Products</Link>
        <Link className='text-gray-700 hover:text-blue-600 transition font-semibold' to="/About-us">About Us</Link>
        <Link className='text-gray-700 hover:text-blue-600 transition font-semibold' to="/Contact">Contact Us</Link>
        </div>
        

        <div className='flex items-center gap-6'>
             <form onSubmit={searchHandler} className='hidden sm:flex items-center border border-slate-300 rounded overflow-hidden'>
                <input type="text" className="px-3 py-2 text-sm w-40 focus:outline-none"
                placeholder='Search Products'
                value={search}
                onChange={(e)=>setSearch(e.target.value)}/>

                <button type='submit' className='px-2'>
                    <Search size={18}/>
                </button>
             </form>

             
             <Link to="/cart" className='relative text-gray-500 hover:text-blue-600 transition '>
             <ShoppingCart/>
             {cartItems.length > 0 && (
             <span className='absolute -top-2 -right-2 bg-blue-600 text-white text-xs 
             font-semibold min-w-5  h-5 rounded-full flex items-center justify-center' >
              {cartItems.length}</span>
             )}</Link>

             

             
             {token ? (
                 <Link to="/profile" 
                   className="flex items-center gap-2 bg-blue-700 px-3 py-2 rounded-lg 
                   text-white hover:bg-blue-700 transition"
                 >
                 <User size={18} />
                 <span className="hidden sm:block">{user.name}</span>
                 </Link>
                 ) : (
                 location.pathname !== "/register" && (
                 <Link to="/register" 
                 className="flex gap-2 items-center bg-blue-600 text-white px-3 py-2 
                  hover:bg-blue-700 transition rounded-lg"
                 >
                 <User size={18}/> Register
                 </Link>
                )
                )} 

             

             <button onClick={()=>setOpen(!open)} className= 'md:hidden text-gray-700 '>
              {open ? <X/> : <Menu/>}
             </button>
        </div>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${open ? "max-h-96 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"}`}>
          <div className="flex flex-col p-4 gap-4">
            <Link onClick={()=>setOpen(false)} className='text-gray-700 hover:text-blue-600 transition font-semibold' to="/Home">Home</Link>
            <Link onClick={()=>setOpen(false)} className='text-gray-700 hover:text-blue-600 transition font-semibold' to="/Products">Products</Link>
            <Link onClick={()=>setOpen(false)} className='text-gray-700 hover:text-blue-600 transition font-semibold' to="/About-us">About Us</Link>
            <Link onClick={()=>setOpen(false)}  className='text-gray-700 hover:text-blue-600 transition font-semibold' to="/Contact">Contact Us</Link>
          </div>
        </div>
    </nav>
    </>
  )
}

export default Navbar