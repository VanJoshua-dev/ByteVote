import React from "react";
//dom routing
import { BrowserRouter as Router, Routes, Route, Link, useLocation, BrowserRouter } from "react-router-dom";
//images
import byteicon from "../assets/byte-icon.png";
import loyolaLogo from "../assets/loyola-shs-logo.png";
import ByteLogo from "../assets/Byte-net-logo.png";
import trojanICT from "../assets/trojan-ICT.png";


function LandingPage() {
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
      <div className="col-span-3 row-span-4 col-start-2 row-start-2 flex flex-col justify-center items-center h-96">
        <h1 className="text-center text-6xl sm:text-7xl md:text-8xl lg:text-9xl">BYTEVote</h1>
          <p className="text-center text-white font-medium w-64 font-gray-100 sm:text-2xl sm:w-96 md:w-3xl md:text-3xl lg:w-4xl lg:text-4xl 2xl:text-4xl 2xl:w-5xl">Brackets of Young 
            Technologists Escalating Through Network Officer Election 2025</p>
          <nav className="p-4 bg-primary text-white flex gap-4 justify-center">
          <Link to="/signup" className='w-32 h-10 bg-white text-amber-500  font-medium rounded-full text-center pt-2 sm:w-40 sm:h-14 sm:pt-3 sm:text-2xl focus:text-white focus:bg-orange-400 hover:bg-orange-400 hover:text-white'>Sign up</Link>
          </nav>
              
      </div>
      {/* <div className="col-span-5 row-start-5 bg-amber-900 ">
        this is footer
        </div> */}
    </div>
  );
}

export default LandingPage;
