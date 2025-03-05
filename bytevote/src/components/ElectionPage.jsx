import React from 'react'
import { useNavigate } from 'react-router-dom';
import byteicon from "../assets/byte-icon.png";
import loyolaLogo from "../assets/loyola-shs-logo.png";
import ByteLogo from "../assets/Byte-net-logo.png";
import trojanICT from "../assets/trojan-ICT.png";
import UserSidebar from '../components/UserSidebar';
import BreadCrumb from "../components/BreadCrumb";
import image from "../assets/userprofile/sampleProfile.png";

function ElectionPage() {
  return (
    <div className='w-screen h-screen p-3'>
        <div className="imagesContainer col-span-5 flex p-4 h-24 justify-between">
            <div>
                <img src={byteicon} alt="" className="h-10 md:h-20 sm:h-16 lg:h-20 2x1:h-20"/>
            </div>   
        </div>
      <h1>Election Page</h1>
      <p>This is the election page where candidates can vote and see their results.</p>
      <p>
        <a href="/dashboard">Back to Dashboard</a>
      </p>
    </div>
  )
}

export default ElectionPage
