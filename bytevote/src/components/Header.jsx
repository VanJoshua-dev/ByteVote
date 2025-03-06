import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//images
import byteicon from "../assets/byte-icon.png";
import loyolaLogo from "../assets/loyola-shs-logo.png";
import ByteLogo from "../assets/Byte-net-logo.png";
import trojanICT from "../assets/trojan-ICT.png";
import sampleprofile from "../assets/userprofile/sampleProfile.png";
//icons
import { LogOut } from "lucide-react";
function Header(header) {
  const navigate = useNavigate();//handle page route
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768); // Detect mobile
  
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    alert("✅ Logged out successfully!");
    navigate("/login"); // Redirect to login page
  }
  return (
    <div className="imagesContainer col-span-5 flex p-4 h-16 sm:h-20 md:h-24 2xl:h-24  justify-between">
      <div>
        <img
          src={byteicon}
          alt=""
          className="h-10 md:h-20 sm:h-16 lg:h-16 2x1:h-16"
        />
      </div>
      {isDesktop && (
        <div className="gap-2 flex h-20 p- justify-center items-center">
        <div>
          <img
            src={sampleprofile}
            alt=""
            className="w-16 h-16 rounded-full border-amber-100 border-3"
            onClick={() => navigate("/profile")}
          />
        </div>
        <div className="flex gap-5">
          <div>
            <p className="text-xl text-white font-medium ">{header.username}</p>
            <p className="text-xs text-white">{header.role}</p>
          </div>

          <div>
            <LogOut size={30} className="text-gray-600 hover:text-orange-600 hover:bg-amber-200 rounded" onClick={handleLogout}/>
          </div>
        </div>
      </div>
      )}
      
    </div>
  );
}

export default Header;
