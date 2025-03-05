import React from "react";
import { BrowserRouter as Routes, Route } from "react-router-dom";

//components
import SideBar from "../components/SideBar";
import Header from "./Header";
import BreadCrumb from "./BreadCrumb";
import CandidateTable from "./CandidateTable";
const Candidates = () => {
  const userId = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("user_name");
  console.log(userId);
  console.log(role);
  console.log(username);
  return (
    <div className="">
      <div className="headerContainer p-2 bg-orange-400">
        <Header username={username} role={role}/>
      </div>
      <div className="dashboardContainer flex ">
        <SideBar />
        <div className=" flex-1 pl-5 pr-5 ">
        <BreadCrumb items={[{ label: "Home", path: "/adminDashboard" }, { label: "Candidates" }]} />
          <CandidateTable />
        </div>
      </div>
    </div>
  );
}

export default Candidates;
