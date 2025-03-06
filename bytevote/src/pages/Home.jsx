import React, { useEffect, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useNavigate, Link } from "react-router-dom";
import image from "../assets/userprofile/sampleProfile.png";
import Userheader from "../components/Userheader";
import axios from "axios";
import clsx from "clsx";

function Home() {
  const navigate = useNavigate();
  // User data and functions go here
  const token = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("user_name");
  const id = localStorage.getItem("voterID");
  const avatar = localStorage.getItem("avatar");
  const [activeElection, setActiveElection] = useState([]);
  const [voteData, setVoteData] = useState([]);
  const [none, setNone] = useState(false);
  const scrollRef = useRef(null);
  console.log(avatar);
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaY * 2; // Adjust speed if needed
      }
    };

    scrollContainer.addEventListener("wheel", handleWheel);
    return () => scrollContainer.removeEventListener("wheel", handleWheel);
  }, []);

  useEffect(() => {
    const fetchActiveElection = async (e) => {
      try {
        const response = await axios.get(
          "http://localhost:5000/getActiveElection",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setActiveElection(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchActiveElection();
    const interval = setInterval(fetchActiveElection, 5000);

    return () => clearInterval(interval);
  }, [token]);
  //fetch votes
  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getVoteCounts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVoteData(response.data); // Ensure API returns data in expected format
      } catch (error) {
        console.error("Error fetching vote counts:", error);
      }
    };

    fetchVotes();
    const interval = setInterval(fetchVotes, 5000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <div className="w-screen h-screen overflow-auto">
      <Userheader />
      <div className=" p-2 ">
        <div className="flex justify-center">
          <div className="bg-amber-50 sm:w-200 md:w-200 xl:w-200 lg:w-200  rounded-2xl p-4 flex flex-row justify-center items-center shadow">
            <div>
              <img
                src={"http://localhost:5000/public/userprofile/" + avatar}
                alt=""
                className="w-25 h-25 rounded-full border-3 border-amber-500"
              />
            </div>
            <div className="w-50 pl-5">
              <h3 className="text-2xl text-justify text-gray-700 font-semibold">
                Welcome!, <strong>{username}</strong>
              </h3>
            </div>
          </div>
        </div>

        <div className="">
        {activeElection.length > 0 && (
          <div ref={scrollRef} className="graph-wrapper flex flex-row lg:justify-center w-full overflow-x-auto mt-6 space-x-6">
            {voteData.length > 0 ? (
              voteData.map((position) => (
                <div className="min-w-[350px]" key={position.position_id}>
                  <h2 className="text-xl text-center font-semibold text-gray-700 mb-3">
                    {position.position_name}
                  </h2>

                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={position.candidates} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="candidate_name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="votes" fill="rgba(40, 67, 245, 1)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ))
            ) : (
              <h2 className={clsx("text-3xl text-center w-full",)}>No vote data available</h2>
            )}
          </div>
        )}
        
          <div className="available-election flex justify-center item-center  w-full p-1">
            <div className="w-full bg-amber-50 rounded-sm sm:w-150">
              <div>
                <h2 className="text-2xl p-1 rounded-t-sm bg-amber-100 text-center font-semibold text-gray-700 mb-3">
                  Available Elections
                </h2>
                <div className="p-2 flex flex-col justify-center items-center">
                  {activeElection.length > 0 ? (
                    activeElection.map((active) => (
                      <div key={active.election_id}>
                        {" "}
                        {/* Ensure each element has a unique key */}
                        <h2 className="text-[20px] text-center">{"Title:"}</h2>
                        <h3 className="text-[20px] text-center"> {active.title} </h3>
                        <h2 className="text-[20px] text-center">{"Description:"}</h2>
                        <h3 className="text-[20px] text-center break-all">
                          {active.description}
                        </h3>
                        <h2 className="text-[20px] text-center">{"End Date:"}</h2>
                        <h3 className="text-[20px] text-center"> {active.end_date} </h3>

                        <div className="flex justify-center items-center">
                          <button
                          className="p-2 w-30 mt-10 bg-amber-500 rounded-2xl text-white text-xl hover:bg-amber-600"
                          onClick={() => navigate("/votingpage")}
                        >
                          Vote now
                        </button>
                        </div>
                        
                      </div>
                    ))
                  ) : (
                    <h2 className="text-[20px] text-center text-gray-500">
                      No active election available
                    </h2>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
