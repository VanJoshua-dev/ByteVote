import React from 'react'
import { Link } from "react-router-dom";
function LandingPageContent() {
  return (
    <div>
        <h1 className="text-center text-6xl sm:text-7xl md:text-8xl lg:text-9xl">BYTEVote</h1>
        <p className="text-center text-white font-medium w-64 font-gray-100 sm:text-2xl sm:w-96 md:w-3xl md:text-3xl lg:w-4xl lg:text-4xl 2xl:text-4xl 2xl:w-5xl">Brackets of Young 
          Technologists Escalating Through Network Officer Election 2025</p>
        <nav className="p-4 bg-primary text-white flex gap-4 justify-center">
         <Link to="/signup" className='w-32 h-10 bg-white text-amber-500  font-medium rounded-full text-center pt-2 sm:w-40 sm:h-14 sm:pt-3 sm:text-2xl focus:text-white focus:bg-orange-400 hover:bg-orange-400 hover:text-white'>Sign up</Link>
        </nav>
    </div>
  )
}

export default LandingPageContent
