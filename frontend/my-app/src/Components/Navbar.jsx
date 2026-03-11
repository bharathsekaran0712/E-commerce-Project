import {Link} from 'react-router-dom'
import { X,Menu, Search, ShoppingBag, ShoppingCart,User } from 'lucide-react'
import React, { useState } from 'react'

const Navbar = () => {
  const [open,setOpen]= useState(false)


  return (
    <>
    <nav className="sticky top-0 w-full bg-white shadow-md z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo */}
            <div>
            <Link to="/" className='flex items-center gap-2 text-2xl font-bold text-blue-800'>
            <ShoppingBag/>
            <span>Shopping hub</span>
            </Link>
        </div>
        {/* Desktop Links */}
        <div className='hidden md:flex items-center gap-8'>
        <Link className='text-gray-700 hover:text-blue-600 transition font-semibold' to="/">Home</Link>
        <Link className='text-gray-700 hover:text-blue-600 transition font-semibold' to="/">Products</Link>
        <Link className='text-gray-700 hover:text-blue-600 transition font-semibold' to="About-us">About Us</Link>
        <Link className='text-gray-700 hover:text-blue-600 transition font-semibold' to="/Contact">Contact Us</Link>
        </div>
        {/* Right section */}

        <div className='flex items-center gap-6'>
             <form className='hidden sm:flex items-center border border-slate-300 rounded overflow-hidden'>
                <input type="text" className="px-3 py-2 text-sm w-40 focus:outline-none"
                placeholder='Search Products'/>

                <button>
                    <Search size={18}/>
                </button>
             </form>

             {/* cart */}
             <Link to="/cart" className='relative text-gray-500 hover:text-blue-600 transition '>
             <ShoppingCart/>
             <span className='absolute -top-2 -right-2 bg-blue-600 text-white text-xs 
             font-semibold min-w-5  h-5 rounded-full flex items-center justify-center' >6</span></Link>

             {/* Register */}
             
             <Link to="/Register" className='flex gap-2 items-center bg-blue-600 text-white px-2 py-2
             hover:bg-blue-700 transition rounded-lg'>
             <User size={18}/>Register</Link>

             {/* Hamburger */}

             <button onClick={()=>setOpen(!open)} className= 'md:hidden text-gray-700 '>
              {open ? <X/> : <Menu/>}
             </button>
        </div>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-96 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"}`}>
          <div className="flex flex-col p-4 gap-4">
            <Link onClick={()=>setOpen(false)} className='text-gray-700 hover:text-blue-600 transition font-semibold' to="/">Home</Link>
            <Link onClick={()=>setOpen(false)} className='text-gray-700 hover:text-blue-600 transition font-semibold' to="/">Products</Link>
            <Link onClick={()=>setOpen(false)} className='text-gray-700 hover:text-blue-600 transition font-semibold' to="/">About Us</Link>
            <Link onClick={()=>setOpen(false)}  className='text-gray-700 hover:text-blue-600 transition font-semibold' to="/">Contact Us</Link>
          </div>
        </div>
    </nav>
    </>
  )
}

export default Navbar