import React from 'react'
import Navbar from '../Components/Navbar'
import ImageSlider from '../Components/ImageSlider'
import Footer from '../Components/Footer'
import Product from '../Components/Product'
import PageTitle from '../Components/PageTitle'

const Products = [{
        "name": "N5 Chanel",
        "price": 24500.67,
        "description": "Chanel N°5 is one of the most famous and iconic perfumes in the world.",
        "ratings": 4.5,
        "images": [
            {
                "image": "/src/assets/perfume.jpg"
            },
        ],
        "category": "Perfume",
        "seller": "Amazon",
        "stock": 5,
        "numOfReviews": 15,
        "reviews": []
    },
    {
        "name": "Omega Watch",
        "price": 1500.32,
        "description": "Minix watches are exclusively designed with aluminium materials.",
        "ratings": 3.5,
        "images": [
            {
                "image": "/src/assets/watch1.jpg"
            }
        ],
        "category": "Accessories",
        "seller": "Flipkart",
        "stock": 9,
        "numOfReviews": 5,
        "reviews": []
    },
    {
        "name": "Nike Running shoe",
        "price": 2000.57,
        "description": "Shoe specially made for the running comfort.",
        "ratings": 2,
        "images": [
            {
                "image": "/src/assets/shoe1.jpg"
            }
        ],
        "category": "Sporting",
        "seller": "Nike",
        "stock": 9,
        "numOfReviews": 12,
        "reviews": []
    },
    {
        "name": "RayBan Sunglass",
        "price": 1700.45,
        "description": "Sunglass for elegance and styles, made of strong material.",
        "ratings": 4,
        "images": [
          {
            "image": "/src/assets/rayban.jpg"
          }
        ],
        "category": "Fashion",
        "seller": "Ebay",
        "stock": 9,
        "numOfReviews": 12,
        "reviews": []
      }

]

const Home = () => {
  return (<>
    <PageTitle title={"Home | E-commerce"}/>
    <Navbar/>
    <ImageSlider/>
    <div className='mt-12 p-8 flex flex-col items-center justify-around text-gray-900'>
      <h1 className="text-4xl font-semibold mb-8 text-blue-700 text-center drop-shadow-sm">Latest Collections</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {Products.map((product,index)=>(
          <Product key={index}
           product= {product}/>
        ))}
      </div>
    </div> 
    <Footer/>
    </>
  )
}

export default Home