import React from "react";
//dom routing
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import LandingPageContent from "../components/LandingPageContent";
import LoginForm from "../components/LoginForm";
import RegistrationForm from "../components/RegistrationForm";
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
      <div className="col-span-3 row-span-4 col-start-2 row-start-2 flex justify-center items-center h-96">
          <Routes>
            <Route path="/" element={<LandingPageContent />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<RegistrationForm />} />
          </Routes>
      </div>
      {/* <div className="col-span-5 row-start-5 bg-amber-900 ">
        this is footer
        </div> */}
    </div>
  );
}

export default LandingPage;
