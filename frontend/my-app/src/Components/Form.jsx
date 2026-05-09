import React, { useState } from 'react'
import { EyeIcon,EyeOffIcon, X} from 'lucide-react'

const Form = ({
  showForm,
  setShowForm,
  formData,
  setFormData,
  editProduct,
  setEditProduct,
  handleSubmit
}) => {

  const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    if(!showForm) return null;

  return (<>
     {showForm && (
          <div className='fixed inset-0 backdrop-blur bg-opacity-50 flex justify-center items-center z-50'>
              <div className='bg-white shadow p-6 rounded-2xl w-[400px]  relative'>
                  <button onClick={() =>{ setShowForm(false)
                    setEditProduct(null)}
                  }
                      className='absolute top-2 right-2 text-red-500 cursor-pointer'>
                          <X size={25}/>
                  </button>

                  <h2 className='text-xl font-bold mb-4'>{editProduct ? "Update Product" : "Add Product"}</h2>

                  <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                      <input type='text'
                      name='name'
                      placeholder='Product Name'
                      value={formData.name}
                      onChange={handleChange}
                      className='border p-2 rounded'/>

                      <input type='Number'
                      name='price'
                      placeholder='Price'
                      value={formData.price}
                      onChange={handleChange}
                      className='border p-2 rounded'/>

                      <select name='category'
                      value={formData.category}
                       onChange={handleChange}
                          className='border p-2 rounded'>
                            <option value="">Select Category</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Mobile Phones">Mobile Phones</option>
                            <option value="Laptops">Laptops</option>
                      </select>

                      <input type='text'
                      name='image'
                      placeholder='Image url'
                      value={formData.image}
                      onChange={handleChange}
                      className='border p-2 rounded'/>

                      <input type='text'
                      name='numOfReviews'
                      placeholder='NumOfReviews'
                      value={formData.numOfReviews}
                      onChange={handleChange}
                      className='border p-2 rounded'/>

                      <input type='Number'
                      name='stock'
                      placeholder='Available stock'
                      value={formData.stock}
                      onChange={handleChange}
                      className='border p-2 rounded'/>

                      <textarea placeholder='Description'
                      name='description'
                      value={formData.description}
                      onChange={handleChange}
                      className='border p-2 rounded'></textarea>

                      <button type='submit' className='bg-blue-500 text-white py-2 rounded'>
                        {editProduct ? "Update Product" : "Add Product"}
                      </button>
                  </form>
              </div>
        </div>
      )}
      </>
  )
}

export default Form