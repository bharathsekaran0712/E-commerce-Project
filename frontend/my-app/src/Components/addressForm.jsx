// import React, { useState } from 'react'
// import { EyeIcon,EyeOffIcon, X} from 'lucide-react'

// const addressForm = ({
//   showForm,
//   setShowForm,
//   form,
//   setForm,
//   editId,
//   setEditId,
//   handleSubmit
// }) => {

//   const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         })
//     }

//     if(!showForm) return null;

//   return (<>
//      {showForm && (
//           <div className='fixed inset-0 backdrop-blur bg-opacity-50 flex justify-center items-center z-50'>
//               <div className='bg-white shadow p-6 rounded-2xl w-[400px]  relative'>
//                   <button onClick={() =>{ setShowForm(false)
//                     setEditProduct(null)}
//                   }
//                       className='absolute top-2 right-2 text-red-500 cursor-pointer'>
//                           <X size={25}/>
//                   </button>

//                   <h2 className='text-xl font-bold mb-4'>{editProduct ? "Update Product" : "Add Product"}</h2>

//                   <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow flex flex-col gap-3">
//         <h2 className="font-bold text-lg">Add Address</h2>

//         <input name="doorNo" value={form.doorNo} placeholder="Door No" onChange={handleChange} className="border p-2" />
//         <input name="line1" value={form.line1} placeholder="Address Line 1" onChange={handleChange} className="border p-2" />
//         <input name="line2" value={form.line2} placeholder="Address Line 2" onChange={handleChange} className="border p-2" />
//         <input name="city" value={form.city} placeholder="City" onChange={handleChange} className="border p-2" />
//         <input name="state" value={form.state} placeholder="State" onChange={handleChange} className="border p-2" />
//         <input name="pincode" value={form.pincode} placeholder="Pincode" onChange={handleChange} className="border p-2" />
//         <input name="contact" value={form.contact} placeholder="Phone" onChange={handleChange} className="border p-2" />

//         <button className="bg-blue-500 text-white py-2 rounded">
//           {editId ? "Update Address" : "Add Address"}
//         </button>
//       </form>
//        </div>
//         </div>
//       )}
//       </>
//   )
// }

// export default addressForm