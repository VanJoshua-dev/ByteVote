import React from "react";
import { BrowserRouter as Routes, Route } from "react-router-dom";

//components
import SideBar from "../components/SideBar";
import Header from "./Header";
const Candidates = () => {
  return (
    <div className="">
      <Header />
      <div className="dashboardContainer flex ">
        <SideBar />
        <div className=" flex-1 p-5 ">
          <h1>This is Candidates</h1>
        </div>
      </div>
    </div>
  );
}

export default Candidates;
