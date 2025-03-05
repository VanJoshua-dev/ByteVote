import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const VotesTally = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await fetch("http://localhost:5000/votes-tally");
        const result = await response.json();
        setData(result); // Store grouped results
      } catch (error) {
        console.error("Error fetching votes:", error);
      }
    };

    fetchVotes();
  }, []);

  return (
    <div>
      {Object.keys(data).map((position) => (
        <div key={position} style={{ width: "50%", marginBottom: "40px" }}>
          <h3 style={{ color: "#fff", marginLeft: "10px" }}>{position}</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data[position]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="vote" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};

export default VotesTally;
