import React from 'react'

function ElectionForm() {
  return (
    <div className='grid grid-cols-5 grid-rows-6 gap-1 p-5  rounded-t-md'>
        <div className="col-span-5">
            <h1 className='text-center text-2xl p-1'>Create Election</h1>
        </div>
      <div className='col-span-3 row-span-5 row-start-2'>
        <h1 className='text-2xl  mb-1 w-full text-center'>Form</h1>
        <div className=' w-auto h-80 rounded-sm p-5 flex justify-center item-center '>
            
            <form action="" className="flex flex-col justify-center item-center p-10 rounded  shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div>
                    <label htmlFor="electionTitle" className="block text-sm font-medium text-white">Election Title</label>
                    <input type="text" id="electionTitle" name="electionTitle" placeholder="Enter Election Title" className="w-100 px-4 py-2 border text-white placeholder:text-gray-400 border-gray-300 focus:outline-none focus:border-blue-300 rounded-md" required/>
                </div>
                <div>
                    <label htmlFor="electionDesc" className="block text-sm font-medium text-white">Election Description</label>
                    <input type="text" id="electionDesc" name="electionDesc" placeholder="Enter Election Description" className="w-100 px-4 py-2 text-white placeholder:text-gray-400 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md" required/>
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-white">Election End Date</label>
                    <input type="date" id="endDate" name="endDate" placeholder="Enter Election End Date" className="w-100 px-4 py-2 border text-gray-500 placeholder:text-gray-700 border-gray-300 focus:outline-none focus:border-blue-300 rounded-md" />                
                </div>
                <button type="submit" className='bg-blue-500 p-1 mt-7 rounded-3xl w-50 hover:bg-blue-800'>Create Election</button>
            </form>
        </div>
        
      </div>
      <div className='col-span-2 row-span-5 col-start-4 row-start-2'>
        <h1 className='text-2xl  mb-1 w-full text-center'>Ongoing Election</h1>
        <div className=' flex justify-center mt-5'>
            <div className='w-auto h-fit rounded p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-center items-center'>
                <span className='text-white'>Title: Sample Election</span>
                <span className='text-white'>End Date: 02-03-2025</span>
                <button className='bg-red-500 text-white mt-5 p-1 rounded w-30 hover:bg-red-800'>Close Election</button>
                {/* <h2 className='text-center text-xl'>No ongoing elections found.</h2> */}
            </div>
        </div>
      </div>
    </div>
  )
}

export default ElectionForm
