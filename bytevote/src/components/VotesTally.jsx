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
  const token = getToken.token;
  const [data, setData] = useState({});
  const [voteData, setVoteData] = useState([]);
  const [activeElection, setActiveElection] = useState([]);
  const scrollRef = useRef(null);
  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await fetch("http://localhost:5000/voteTally");
        const result = await response.json();
        setData(result); // Store grouped results
      } catch (error) {
        console.error("Error fetching votes:", error);
      }
    };

    fetchVotes();
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
  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/getVoteCounts",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setVoteData(response.data); // Ensure API returns data in expected format
      } catch (error) {
        console.error("Error fetching vote counts:", error);
      }
    };

    fetchVotes();
    const interval = setInterval(fetchVotes, 5000);
    return () => clearInterval(interval);
  }, [token]);

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

  return (
    <div>
      {activeElection.length > 0 && (
        <div
          ref={scrollRef}
          className="graph-wrapper flex flex-row lg:justify-center w-full overflow-x-auto mt-6 space-x-6"
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
                    <XAxis dataKey="candidate_name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="votes" fill="rgba(40, 67, 245, 1)" />
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
