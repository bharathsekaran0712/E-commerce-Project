import React from 'react'
import PageTitle from '../Components/PageTitle'
import Footer from '../Components/Footer'
import Navbar from '../Components/Navbar'

const About = () => {

  return (
    <>
    <Navbar/>
      <PageTitle title={"About Us | E-Commerce"} />

      <div className="bg-gray-50 min-h-screen">

      
        <div className="bg-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">About Our Store</h1>
            <p className="max-w-2xl mx-auto text-lg">
              We provide a modern online shopping experience with quality
              products, secure payments, and fast delivery.
            </p>
          </div>
        </div>

        
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-10 items-center">

            <div>
              <img
                src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a"
                alt="shopping"
                className="rounded-lg shadow-lg"
              />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Who We Are
              </h2>

              <p className="text-gray-600 mb-4">
                Our e-commerce platform was created to make online shopping
                simple, fast, and reliable. We offer a wide range of products
                including fashion, electronics, accessories, and more.
              </p>

              <p className="text-gray-600">
                Our goal is to provide customers with quality products,
                affordable prices, and a smooth user experience. We are
                constantly improving our platform using modern technologies.
              </p>
            </div>

          </div>
        </div>

        
        <div className="bg-white py-12">
          <div className="container mx-auto px-4">

            <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
              Why Choose Us
            </h2>

            <div className="grid md:grid-cols-3 gap-8">

              <div className="bg-gray-50 p-6 rounded-lg shadow text-center">
                <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
                <p className="text-gray-600">
                  We carefully select products to ensure quality and value for
                  our customers.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow text-center">
                <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
                <p className="text-gray-600">
                  Our platform ensures safe transactions and secure customer
                  data.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow text-center">
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-gray-600">
                  We focus on quick and reliable delivery to give the best
                  shopping experience.
                </p>
              </div>

            </div>

          </div>
        </div>
        <Footer/>
      </div>

    </>
  )
}

export default About