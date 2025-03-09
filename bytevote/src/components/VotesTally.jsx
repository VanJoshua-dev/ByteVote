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
        const response = await fetch("https://byte-vote.vercel.app/voteTally");
        if (!response.ok) throw new Error("Failed to fetch votes");

        const result = await response.json();
        setData(result); // ✅ Ensure response is correctly structured
      } catch (error) {
        console.error("Error fetching votes:", error);
      }
    };

    fetchVotes(); // Fetch immediately
    const interval = setInterval(fetchVotes, 5000); // Fetch every 5s

    return () => clearInterval(interval); // ✅ Cleanup interval
  }, []);

  useEffect(() => {
    const fetchActiveElection = async () => {
      try {
        const response = await fetch(
          "https://byte-vote.vercel.app/getActiveElection",
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

  useEffect(() => {
    const fetchVoteCounts = async () => {
      try {
        const response = await fetch("https://byte-vote.vercel.app/api/getVoteCounts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch vote counts");

        const data = await response.json();
        setVoteData(data);
      } catch (error) {
        console.error("Error fetching vote counts:", error);
      }
    };

    fetchVoteCounts();
    const interval = setInterval(fetchVoteCounts, 5000);

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
