import React from 'react'
//dom routing
import { BrowserRouter as Router, Routes, Route, Link, useLocation, BrowserRouter, useNavigate } from "react-router-dom";
//images
import byteicon from "../assets/byte-icon.png";
import loyolaLogo from "../assets/loyola-shs-logo.png";
import ByteLogo from "../assets/Byte-net-logo.png";
import trojanICT from "../assets/trojan-ICT.png";

function NotFound() {
 const navigate = useNavigate();
  return (
    <div className="ladingPageContainer grid  grid-cols-5 grid-rows-5 gap-1 h-screen">
    <div className="imagesContainer col-span-5 flex p-4 h-24 justify-between">
      <div>
        <img src={byteicon} alt="" className="h-10 md:h-20 sm:h-16 lg:h-20 2x1:h-20"/>
      </div>
      
      <div className="gap-1 ">
        
        <div className="flex gap-1">
          <img src={loyolaLogo} alt="" className="h-16 md:h-20 sm:h-20 lg:h-20 2x1:h-20 rounded-full"/>
          <img src={ByteLogo} alt="" className="h-16 md:h-20 sm:h-20 lg:h-20 2x1:h-20 rounded-full "/>
        </div>
        <img src={trojanICT} alt="" className="h-32 md:h-40 sm:h-40 lg:h-40 2x1:h-40 float-end p-2 "/>
      </div>
      
      
    </div>
    <div className="col-start-5 row-start-2">
      
    </div>
    <div className="col-span-3 row-span-4 col-start-2 row-start-2 flex flex-col justify-center items-center h-50 mt-40 w-auto sm:w-98 lg:w-190 2xl:w-250 ">
            <h1 className='text-6xl text-center font-bold'>•︵•</h1>
            <h1 className='text-5xl text-center w-screen'>404 - Page Not Found</h1>
            <button className="w-auto bg-orange-400 text-white p-3 2xl:p-3 mt-10  rounded-2xl text-2xl font-bold hover:bg-white hover:text-orange-400" onClick={() => navigate(-1)} >Return to previous page</button>
    </div>
   
  </div>
  )
}

export default NotFound
