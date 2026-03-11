import { useState } from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
// import './App.css'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Home from './Pages/Home'
import About from './Pages/About'
import Contact from './Pages/Contact'
import Navbar from './Components/Navbar'


function App() {

  return (<>
  
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/About-us" element={<About/>}/>
      <Route path="/Contact" element={<Contact/>}/>
      <Route path="/Register" element={<Register/>}/>
      <Route path="/Login" element={<Login/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
