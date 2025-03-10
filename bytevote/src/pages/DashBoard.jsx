import React from "react";
import { BrowserRouter as Routes, Route } from "react-router-dom";
import SideBar from "../components/SideBar";
//components
import Stats from "../components/Stats";
import Votes from "../components/Votes";
import Voters from "../components/Voters";
import Position from "../components/Position";
import Header from "../components/Header";
function DashBoard() {
  const userId = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("user_name");
  return (
    <div className="">
      <div className="headerContainer p-2 bg-orange-400">
        <Header username={username} role={role}/>
      </div>

      <div className="dashboardContainer flex ">
        <SideBar />
        <div className=" flex-1 p-0 ">
          <Stats token={userId}/>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
