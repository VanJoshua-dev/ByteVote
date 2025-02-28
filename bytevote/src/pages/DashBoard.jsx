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
  return (
    <div className="">
        <Header />
      <div className="dashboardContainer flex ">
        <SideBar />
        <div className=" flex-1 p-5 ">
          <Stats />
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
