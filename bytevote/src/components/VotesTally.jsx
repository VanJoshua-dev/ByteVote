import React, { useEffect, useState, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import axios from "axios";
import clsx from "clsx";
const VotesTally = (getToken) => {
  const token = getToken.token; // ✅ Ensure getToken exists

  const [data, setData] = useState({});
  const [voteData, setVoteData] = useState([]);
  const [activeElection, setActiveElection] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await fetch("https://byte-vote.vercel.app/api/voteTally");
        if (!response.ok) throw new Error("Failed to fetch votes");

        const result = await response.json();
        setVoteData(result); // ✅ Ensure response is correctly structured
      } catch (error) {
        console.error("Error fetching votes:", error);
      }
    };

    fetchVotes(); // Fetch immediately
    const interval = setInterval(fetchVotes, 5000); // Fetch every 5s

    return () => clearInterval(interval); // ✅ Cleanup interval
  }, [token]);

  useEffect(() => {
    const fetchActiveElection = async () => {
      try {
        const response = await fetch(
          "https://byte-vote.vercel.app/api/getActiveElection",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch active election");

        const data = await response.json();
        setActiveElection(data);
      } catch (error) {
        console.error("Error fetching active election:", error);
      }
    };

    fetchActiveElection();
    const interval = setInterval(fetchActiveElection, 5000);

    return () => clearInterval(interval);
  }, [token]);

  console.log("this is the data: ", voteData);
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
  }, [token]);

  return (
    <div className="flex flex-wrap">
      {activeElection.length > 0 && (
        <div
         className="flex flex-row flex-wrap justify-center"
        >
          {voteData.length > 0 ? (
            voteData.map((position) => (
              <div className="min-w-[350px]" key={position.position_id}>
                <h2 className="text-xl text-center font-semibold text-gray-700 mb-3">
                  {position.position_name}
                </h2>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={position.candidates}
                    margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="vote" fill="rgba(40, 67, 245, 1)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))
          ) : (
            <h2 className={clsx("text-3xl text-center w-full")}>
              No vote data available
            </h2>
          )}
        </div>
      )}
    </div>
  );
};

export default VotesTally;
