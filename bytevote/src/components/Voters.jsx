import React from "react";
import { BrowserRouter as Routes, Route } from "react-router-dom";
//images
import byteicon from "../assets/byte-icon.png";
import loyolaLogo from "../assets/loyola-shs-logo.png";
import ByteLogo from "../assets/Byte-net-logo.png";
import trojanICT from "../assets/trojan-ICT.png";
//components
import SideBar from "../components/SideBar";
import Header from "./Header";
const Voters = () => {
  return (
    <div className="voterContainer">
      <Header />
      <div className="dashboardContainer flex">
        <div className="sideBar">
          <SideBar />
        </div>

        <div className="votersContainer  flex-1 p-5 ">
          <h1>This is Voters Tab</h1>
        </div>
      </div>
    </div>
  );
}

export default Voters;
