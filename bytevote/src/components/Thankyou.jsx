import React, {useEffect} from "react";
//dom routing
import { BrowserRouter as Router, Routes, Route, Link, useLocation, BrowserRouter, useNavigate } from "react-router-dom";
//images
import byteicon from "../assets/byte-icon.png";
import loyolaLogo from "../assets/loyola-shs-logo.png";
import ByteLogo from "../assets/Byte-net-logo.png";
import trojanICT from "../assets/trojan-ICT.png";
import { FaFacebookSquare } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

function Thankyou() {
   const navigate = useNavigate();
  // useEffect(() => {
  //     const userRole = localStorage.getItem("role");
  //     if (userRole === "admin") {
  //       navigate("/adminDashboard");
  //     } else if (userRole === "voter") {
  //       navigate("/dashboard");
  //     }
  //   }, [navigate]);
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
          <p className="text-center text-white font-medium w-64 font-gray-100 sm:text-2xl sm:w-96 md:w-3xl md:text-3xl lg:w-4xl lg:text-4xl 2xl:text-4xl 2xl:w-5xl">Thank you! , we appriciate your paricipation.</p>
          <nav className="p-4 bg-primary text-white  flex flex-col justify-center items-center">
          <a href="https://www.facebook.com/share/1AFQb3wsSu/" className=' h-10 text-blue-500  font-medium rounded-full flex justify-center items-center text-center  p-1  sm:text-2xl focus:text-white   hover:text-blue-900'><FaFacebookSquare size={50}/></a>
          <p className="font-semibold">Visit our facebook page for the final result.</p>
          </nav>
          <button className="bg-amber-500 p-2 flex justify-center items-center gap-2 rounded-2xl text-white font-bold hover:bg-amber-800" onClick={() => navigate("/dashboard")}>Return to home <FaArrowRight /></button>
              
      </div>
      {/* <div className="col-span-5 row-start-5 bg-amber-900 ">
        this is footer
        </div> */}
    </div>
  );
}

export default Thankyou;
