import React from "react";
import { BrowserRouter as Routes, Route } from "react-router-dom";

//components
import SideBar from "../components/SideBar";
import Header from "./Header";
import BreadCrumb from "./BreadCrumb";
import VotesTable from "./VotesTable";
const Votes = () => {
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
        <div className=" flex-1 p-5 ">
          <BreadCrumb items={[{ label: "Home", path: "/adminDashboard" }, { label: "Votes" }]} />
          <VotesTable />
        </div>
      </div>
    </div>
  );
}

export default Votes;
