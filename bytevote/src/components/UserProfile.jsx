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
import BreadCrumb from "./BreadCrumb";
const UserProfile = () => {
  return (
    <div className="voterContainer">
      <div className="headerContainer p-2 bg-orange-400">
        <Header />
      </div>
      <div className="dashboardContainer flex">
        <div className="sideBar">
          <SideBar />
        </div>

        <div className="votersContainer  flex-1 p-5 ">
        <BreadCrumb items={[{ label: "Home", path: "/dashboard" }, { label: "Profile" }]} />
          <h1>This is user Profile</h1>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
