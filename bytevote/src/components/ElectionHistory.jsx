import React from "react";
import { BrowserRouter as Routes, Route } from "react-router-dom";

//components
import SideBar from "../components/SideBar";
import Header from "./Header";
import BreadCrumb from "./BreadCrumb";
const ElectionHistory = () => {
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
        <div className=" flex-1 pl-5 pr-5">
          <BreadCrumb
            items={[
              { label: "Home", path: "/adminDashboard" },
              { label: "Election History" },
            ]}
          />
          <div className=" p-5 h-144">
            <h1 className="text-center text-3xl">Election History</h1>
            <div className=" p-3 rounded shadow-md shadow-gray-500 mb-2">
              <h2>Election 1</h2>
              <p>Date: 2022-01-01</p>
              <p>
                Description: Lorem ipsum dolor sit amet, consectetur adipiscing
                elit. Donec ultricies, arcu ac semper fermentum, sapien tellus
                cursus velit, ut pulvinar metus erat id velit.
              </p>
            </div>
            <div className=" p-3 rounded shadow-md shadow-gray-500 mb-2">
              <h2>Election 2</h2>
              <p>Date: 2022-02-01</p>
              <p>
                Description: Sed vel justo at nunc gravida gravida. Sed
                condimentum, neque vel pulvinar vestibulum, nisi ligula
                pellentesque velit, et tristique felis neque eu velit.
              </p>
              
            </div>
            <div className=" p-3 rounded shadow-md shadow-gray-500 mb-2">
                <h2>Election 3</h2>
                <p>Date: 2022-03-01</p>
                <p>
                  Description: Donec id varius nunc. Sed sagittis, est sed
                  eleifend mollis, risus lectus rutrum felis, at condimentum
                  risus felis vel dui.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectionHistory;
