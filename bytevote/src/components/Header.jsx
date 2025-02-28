import React from 'react'
import byteicon from "../assets/byte-icon.png";
import loyolaLogo from "../assets/loyola-shs-logo.png";
import ByteLogo from "../assets/Byte-net-logo.png";
import trojanICT from "../assets/trojan-ICT.png";
function Header() {
  return (
    <div className="imagesContainer col-span-5 flex p-4 h-16 sm:h-20 md:h-24 2xl:h-24  justify-between">
           <div>
             <img src={byteicon} alt="" className="h-10 md:h-20 sm:h-16 lg:h-20 2x1:h-20"/>
           </div>
           
           <div className="gap-1 ">
             {/* profile
             username
             dropdown logout */}
           </div>
           
           
    </div>
  )
}

export default Header
