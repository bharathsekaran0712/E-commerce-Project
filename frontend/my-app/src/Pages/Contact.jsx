import React from "react"
import Navbar from "../Components/Navbar"
import Footer from "../Components/Footer"
import PageTitle from "../Components/PageTitle"

const Contact = () => {
  return (
    <>
    <Navbar/>
      <PageTitle title={"Contact Us | E-Commerce"} />

      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">

          {/* Title */}
          <div className="text-center mb-10 ">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Contact Us</h1>
            <p className="text-gray-600">
              We'd love to hear from you. Send us a message and we’ll respond as soon as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">

          
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Get in Touch</h2>

              <p className="text-gray-600 mb-4">
                If you have any questions about our products, orders, or services,
                feel free to contact us using the details below.
              </p>

              <div className="space-y-3 text-gray-700">
                <p><strong>Address:</strong> 5th Market Street, Gandhipuram, Coimbatore, India</p>
                <p><strong>Email:</strong> support@shoppingHub.com</p>
                <p><strong>Phone:</strong> +91 95853 68689</p>
                <p><strong>Working Hours:</strong> Mon - Sat (9 AM - 6 PM)</p>
              </div>
            </div>

            
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Send Message</h2>

              <form className="space-y-4">

                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                />

                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                />

                <textarea
                  rows="4"
                  placeholder="Your Message"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                ></textarea>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Send Message
                </button>

              </form>
            </div>

          </div>

        </div>
        
      </div>
      <Footer/>
    </>
  )
}

export default Contact