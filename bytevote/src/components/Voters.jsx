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
import VoterTable from "./VoterTable";
const Voters = () => {
  const userId = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("user_name");
  return (
    <div className="voterContainer">
      <div className="headerContainer p-2 bg-orange-400">
        <Header username={username} role={role}/>
      </div>
      <div className="dashboardContainer flex">
        <div className="sideBar">
          <SideBar />
        </div>

        <div className="votersContainer  flex-1 p-5 h-155">
          <BreadCrumb items={[{ label: "Home", path: "/adminDashboard" }, { label: "Voters" }]} />
          <VoterTable token={userId}/>
        </div>
      </div>
    </div>
  );
}

export default Voters;
