import React, {useState, useEffect, useRef} from "react";
import { BrowserRouter as Routes, Route } from "react-router-dom";
import axios from "axios";
//components
import SideBar from "../components/SideBar";
import Header from "./Header";
import BreadCrumb from "./BreadCrumb";
const ElectionHistory = () => {
  const [history, setHistory] = useState([]);
  const intervalRef = useRef(null); // Keep track of interval
  const userId = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("user_name");
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = userId; // Ensure this is a proper token
        if (!token) {
          console.error("❌ No token found.");
          return;
        }

        const response = await fetch("https://byte-vote.vercel.app/api/getHistory", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch history.");
        }

        const data = await response.json();
        setHistory(data);
      } catch (e) {
        console.error("❌ Error fetching history:", e);
        setHistory([]); // Ensure empty array on failure
      }
    };

    // Fetch immediately
    fetchHistory();

    // Clear any existing interval to avoid duplicate calls
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set interval to refresh every 5 seconds
    intervalRef.current = setInterval(fetchHistory, 5000);

    return () => clearInterval(intervalRef.current); // Cleanup interval
  }, [userId]);
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
