import React from "react";
//dom routing
import { BrowserRouter as Router, Routes, Route, Link, useLocation, BrowserRouter } from "react-router-dom";
//images
import byteicon from "../assets/byte-icon.png";
import loyolaLogo from "../assets/loyola-shs-logo.png";
import ByteLogo from "../assets/Byte-net-logo.png";
import trojanICT from "../assets/trojan-ICT.png";


const LoginForm = () => {
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
      <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-80 mt-36 md:w-96 sm:w-96 lg:w-96 2xl:w-96">
        <h2 className="text-3xl font-extrabold text-center mb-6" >BYTEVote Login</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-600">Username</label>
            <input 
              type="text" 
              name="username" 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter your username" 
            />
          </div>
          <div>
            <label className="block text-gray-600">Password</label>
            <input 
              type="password" 
              name="password" 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter your password" 
            />
          </div>
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">Login</button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">Forgot Password?</Link>
        </div>
        <div className="mt-4 text-center text-sm">
          <p>Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link></p>
        </div>
       
      </div>
    </div>
              
      </div>
     
    </div>
  );
}

export default LoginForm;
