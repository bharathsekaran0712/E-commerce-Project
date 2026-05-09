import { useState } from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Home from './Pages/Home'
import About from './Pages/About'
import Contact from './Pages/Contact'
import ProductDetails from './Pages/ProductDetails'
import Navbar from './Components/Navbar'
import Products from './Pages/Products'
import Cart from './Pages/Cart'
import Orders from "./Pages/Order";
import OrderDetails from "./Pages/OrderDetails";
import Profile from './Pages/Profile'
import Payment from './Pages/Payment'
import Form from './Components/Form'
import Address from './Pages/Address'
import AdminDashboard from './Components/adminDashboard'


function App() {

  return (<>
  
    <BrowserRouter>
    <Routes>
      <Route path="/Register" element={<Register/>}/>
      <Route path="/" element={<Login/>}/>
      <Route path="/Home" element={<Home/>}/>
      <Route path="/product/:id" element={<ProductDetails/>}/>
      <Route path="/products" element={<Products/>}/>
      <Route path="/About-us" element={<About/>}/>
      <Route path="/Contact" element={<Contact/>}/>
      <Route path="/search/:keyword" element={<Products />}/>
      <Route path="/cart" element={<Cart/>}/>
      <Route path="/orders" element={<Orders />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/order/:id" element={<OrderDetails />} />
      <Route path="/Profile" element={<Profile/>}/>
      <Route path="/Address" element={<Address/>}/>
      <Route path="/AdminDashboard" element={<AdminDashboard/>}/>
    </Routes>

    </BrowserRouter>
    </>
  )
}

export default App
