import React from 'react'
import {useState, useEffect, useRef} from 'react'
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { RxReset } from "react-icons/rx";
import { IoIosAddCircleOutline } from "react-icons/io";
import clsx from 'clsx';
import { BsExclamationCircle } from "react-icons/bs";
function Positiontable() {
    const [showPassword, setShowPassword] = useState(false);
    
        const handleTogglePassword = () => {
          setShowPassword((prev) => !prev);
        }
        const [showModal, setShowModal] = useState(false);//handle add modal
        const [editModal, setEditModal] = useState(false);//handle edit modal
        const [deleteModal, setDeleteModal] = useState(false);//handle delete modal

        const data = [

            
        ]
  return (
    <div className=" h-auto">
           {/* Add Modal */}
           <div className={clsx("fixed z-50 w-fit bg-white top-5  left-85 rounded-2xl  p-3", {"hidden": !showModal})}>
               <h1 className='text-3xl mb-3 pb-1 border-b-4 w-60'>Add new position</h1>
               <form action="">
                   <div className='flex gap-2' >
                       <div>
                           <label for="positionName" className="block text-sm font-medium text-gray-900 dark:text-black">Position Name</label>
                           <input type="text" id="positionName" name="positionName" placeholder="Position Name" className="w-100 px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md" />
                       </div>
                   </div>

                   <div className='mt-2 flex justify-center gap-2'>
                       <button type='submit' className='w-35 px-4 py-2 bg-blue-500  text-white rounded-lg hover:bg-blue-600 transition'>Add Position</button>
                       <button type="button" className='w-30 px-4 py-2 bg-red-500  text-white rounded-lg hover:bg-red-600 transition' onClick={() => setShowModal(false)}>Cancel</button>
                   </div>
               </form>
           </div>
           {/* Edit modal */}
           <div className={clsx("fixed z-50 w-fit bg-white top-5  left-85 rounded-2xl  p-3", {"hidden": !editModal})}>
   
               <h1 className='text-3xl mb-3 pb-1 border-b-4 w-50'>Edit Position</h1>
               <form action="">
                   <div className='flex gap-2' >
                       <div>
                           <input type="hidden" id="positionID" name="positionID"  className="w-100 px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md" />
                       </div>
                       <div>
                           <label for="newPosName" className="block text-sm font-medium text-gray-900 dark:text-black">New Position Name</label>
                           <input type="text" id="newPosName" name="newPosName" placeholder="New Position Name" className="w-100 px-4 py-2  border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md" />
                       </div>
   
                   </div>
                   <div className='mt-2 flex justify-center gap-2'>
                       <button type='submit' className='w-30 px-4 py-2 bg-blue-500  text-white rounded-lg hover:bg-blue-600 transition'>Save</button>
                       <button type="button" className='w-30 px-4 py-2 bg-red-500  text-white rounded-lg hover:bg-red-600 transition' onClick={() => setEditModal(false)}>Cancel</button>
                   </div>
               </form>
           </div>
           {/* delete modal */}
           <div className={clsx("fixed z-50 p-2 left-150 flex flex-col justify-center items-center bg-white rounded-2xl", {"hidden": !deleteModal})}>
               <BsExclamationCircle size={50} color='red'/>
               <h3>Are you sure you want continue?</h3>
               <form action="">
                   <input type="hidden" name="positionID" id="positionID" />
                   <div className='mt-5'>
                       <button type='button' className='bg-blue-500 text-white rounded-md px-4 py-2 ml-2 hover:bg-blue-800' onClick={() => setDeleteModal(false)} >No</button>
                       <button type="submit" className='bg-red-500 text-white rounded-md px-4 py-2 ml-2 hover:bg-red-800'>Yes</button>
                   </div>
               </form>
           </div>
           <div className='flex gap-2 p-2 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-t-md'>  
               <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
               <div class="relative">
                   <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                       <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                           <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                       </svg>
                   </div>
                   <input type="search" id="default-search" class="block w-96 p-2 ps-10  text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500  dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Position..." required />
               </div>
               <div>
                   <button type="button" data-modal-target="crud-modal" data-modal-toggle="crud-modal" className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-800 transition" onClick={() => setShowModal(true)}>
                       <span className="mr-2">Add Position </span>
                       <IoIosAddCircleOutline size={20}/>
                   </button>
               </div>
           </div>
         
   
           <div class="relative overflow-x-auto shadow-md h-129.5  overflow-auto scroll-smooth ">
               <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                   <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                       <tr>
                           <th scope="col" class="px-6 py-3">
                               Position ID
                           </th>
                           <th scope="col" class="px-6 py-3">
                               Position Name
                           </th>
                           <th scope="col" class="px-6 py-3">
                               Action
                           </th>
                       </tr>
                   </thead>
                   <tbody>
                       <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                           <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                               1
                           </th>
                           <td class="px-6 py-4">
                               John Doe
                           </td>
                           <td class="px-6 py-4">
                              <button data-modal-target="crud-modal" data-modal-toggle="crud-modal" className='text-white bg-green-600 rounded py-2 px-2 hover:bg-green-800' onClick={() => setEditModal(true)}><FaRegEdit size={16} /></button>
                              {" "}
                              <button className='text-white bg-red-600 rounded py-2 px-2 hover:bg-red-800' onClick={() => setDeleteModal(true)}><AiOutlineDelete size={16} /></button>
                           </td>
                       </tr>
                   </tbody>
               </table>
           </div>
   
       </div>
  )
}

export default Positiontable
