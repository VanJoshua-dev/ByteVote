import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import byteicon from "../assets/byte-icon.png";
import loyolaLogo from "../assets/loyola-shs-logo.png";
import ByteLogo from "../assets/Byte-net-logo.png";
import trojanICT from "../assets/trojan-ICT.png";
import UserSidebar from '../components/UserSidebar';
import BreadCrumb from "../components/BreadCrumb";
import image from "../assets/userprofile/sampleProfile.png";
function Home() {
    const navigate = useNavigate();
    const username = localStorage.getItem("user_name");
    const role = localStorage.getItem("role");

    console.log("Your role: " + role);
  return (
    <div className='w-screen h-screen'>
        <div className="imagesContainer col-span-5 flex p-4 h-24 justify-between">
            <div>
                <img src={byteicon} alt="" className="h-10 md:h-20 sm:h-16 lg:h-20 2x1:h-20"/>
            </div>
            
            
        </div>
        <div className=''>
            <UserSidebar />
        </div>
        <div className='p-2'>
            <BreadCrumb items={[{ label: "Home", path: "/dashboard" }, { label: "Dashboard" }]} />
            <div className="flex justify-center items-center gap-2 mt-9 p-2  rounded-2xl">
                <div >
                    <h3 className='text-white text-2xl  p-1 rounded'>Welcome <span className='font-bold'>{username}</span></h3>
                </div>
            </div>
           
            <div className='p-2 mt-2 flex flex-col justify-center items-center'>
                <div className='flex flex-col '>
                    <h3 className='text-2xl text-white font-bold'>Available election</h3>
                    <div className='flex flex-col bg-white p-3 rounded'>

                        <div className='flex flex-col justify-between items-center gap-2'>
                            <h2 className='text-xl'>Presidential Election</h2>
                            <p className='text-gray-600'>EndDate: March 20th, 2025</p>
                        </div>
                        
                    </div>
                </div>
               <button className='w-40 bg-blue-500 text-white text-2xl p-2 mt-2 rounded-2xl hover:bg-blue-800' onClick={() => navigate("/election")}>Vote Now</button>
            </div>
        </div>
    </div>
  )
}

export default Home
