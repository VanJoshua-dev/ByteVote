import React, {useState, useEffect} from "react";
import { BrowserRouter as Routes, Route } from "react-router-dom";
import axios from "axios";
//components
import SideBar from "../components/SideBar";
import Header from "./Header";
import BreadCrumb from "./BreadCrumb";
const ElectionHistory = () => {
  const [history, setHistory] = useState([]);

  const userId = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("user_name");
  console.log(userId);
  console.log(role);
  console.log(username);
  useEffect(() => {
    
    const fetchHistory = async (e) => {
      try{
        const response = await axios.get("http://localhost:5000/getHistory", {
          headers: { Authorization: `Bearer ${userId}` },
        })
        setHistory(response.data);
      }catch(e){
        console.error("Error fetching history: ", e);
        setHistory([]);
      }
      
    }
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);

    return () => clearInterval(interval);
  }, [])
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
            {history.map((histories) => {
              return (
                <div key={histories.history_id} className="shadow mb-3 p-10">
                  <h2 className="text-2xl">{histories.election_title}</h2>
                  <p>Date: {histories.election_desc}</p>
                  <p>Description: {histories.election_date}</p>
                </div>
              );
            })}
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectionHistory;
