import React from 'react'
import {Copyright, Github, Instagram, Linkedin, Mail, Phone, Youtube} from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 mt-8">
      {/* Main Container */}
    <div className='max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6 text-center 
    md:text-left py-5'>
      {/* Section 1: Contact */}
      <div className="flex-1 min-w-62.5">
        <h3 className='text-xl font-semibold mb-4 text-white'>Contact Us</h3>
        <p className='flex items-center justify-center md:justify-start gap-2 text-gray-400 mb-2'><Phone size={16}/>Phone no: +91 9585368689</p>
        <p className='flex items-center justify-center md:justify-start gap-2 text-gray-400 mb-2'><Mail size={16}/>Email: bharathsekaran07@gmail.com</p>

      </div>
      {/* Section 2: Social */}
      <div className="flex-1 min-w-62.5 items-center gap-4">
        <h3 className='text-xl font-semibold mb-4 text-white'>Follow Me</h3>
        <div className="flex gap-4 items-center justify-center md:justify-start">
        <a href='#' target='_blank'>
          <Github className='w-7 h-7 test-gray-400 transition-transform duration-300
          hover:scale-110 hover:text-blue-500'/>
        </a>
        <a href="#" target='_blank'>
          <Linkedin className='w-7 h-7 test-gray-400 transition-transform duration-300
          hover:scale-110 hover:text-blue-500'/>
        </a>
        <a href="#" target='_blank'>
          <Youtube className='w-7 h-7 test-gray-400 transition-transform duration-300
          hover:scale-110 hover:text-red-500'/>
        </a>
        <a href="#" target='_blank'>
          <Instagram className='w-7 h-7 test-gray-400 transition-transform duration-300
          hover:scale-110 hover:text-pink-500'/>
        </a>
        </div>
      </div>
      {/* Section 3: About */}
      <div className="flex-1 min-w-62.5 ">
        <h3 className='text-xl font-semibold mb-4 text-white'>About Us</h3>
        <p className='text-gray-400 leading-relaxed'>Providing professional solution to help grow your online bussiness</p>
      </div>
    </div>
    {/* Bottom */}
    <div className="border-t border-gray-700 py-4 text-center text-gray-400 text-sm">c 2026 Shopping hub. All rights reserved</div>
    </footer>
  )
}

export default Footer