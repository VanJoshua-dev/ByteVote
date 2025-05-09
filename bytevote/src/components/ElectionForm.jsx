import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
function ElectionForm(getToken) {
  const [electionTitle, setElectionTitle] = useState("");
  const [electionDesc, setElectionDesc] = useState("");
  const [electionEnd, setElectionEnd] = useState();
  const [electionStart, setElectionStart] = useState("Active");
  const [electionID, setElectionID] = useState(null);

  //setElection data
  const [election, setElection] = useState([]);
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const token = getToken.token;

      const response = await fetch("https://byte-vote.vercel.app/api/createElection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: electionTitle.trim(),
          desc: electionDesc.trim(),
          endDate: electionEnd,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create election");
      }

      const data = await response.json();
      console.log(data);
      alert("✅ Election Created Successfully");

      // Clear input fields
      setElectionTitle("");
      setElectionDesc("");
      setElectionEnd(""); // Use empty string instead of null
    } catch (error) {
      console.error("❌ Error creating election:", error);
      alert("❌ Failed to Create Election");
    }
  };

  //hanldle set active
  const handleUpdateElectionStatus = async (
    electionId,
    newStatus,
    electionTitle,
    electionDesc
  ) => {
    try {
      const token = getToken.token; // Ensure getToken is correctly retrieving the token

      const response = await fetch("https://byte-vote.vercel.app/api/updateStatus", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          election_ID: electionId, // Ensure correct ID is passed
          status: newStatus,
          title: electionTitle.trim(), // Trim to remove extra spaces
          desc: electionDesc.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Election set to ${newStatus} successfully!`);
        // Refresh election data (you might need a function for this)
      } else {
        alert(data.error || "Failed to update election status.");
      }
    } catch (error) {
      console.error("❌ Error updating election:", error);
      alert("❌ Something went wrong.");
    }
  };

  //fetch election
  useEffect(() => {
    const fetchElection = async () => {
        try {
            const response = await fetch("https://byte-vote.vercel.app/api/getElection");

            if (!response.ok) {
                throw new Error("Failed to fetch elections");
            }

            const data = await response.json();
            setElection(data);
        } catch (error) {
            console.error("❌ Error fetching elections:", error);
        }
    };

    fetchElection();
    const interval = setInterval(fetchElection, 5000);

    return () => clearInterval(interval);
}, []);
  //fetching votes

  return (
    <div className="grid grid-cols-5 grid-rows-6 gap-1 p-5  rounded-t-md">
      <div className="col-span-5">
        <h1 className="text-center text-2xl p-1">Create Election</h1>
      </div>
      <div className="col-span-3 row-span-5 row-start-2">
        <h1 className="text-2xl  mb-1 w-full text-center">Form</h1>
        <div className=" w-auto h-80 rounded-sm p-5 flex justify-center item-center ">
          <form
            onSubmit={handleCreate}
            className="flex flex-col justify-center item-center p-10 rounded  shadow-sm dark:bg-gray-800 dark:border-gray-700"
          >
            <div>
              <label
                htmlFor="electionTitle"
                className="block text-sm font-medium text-white"
              >
                Election Title
              </label>
              <input
                type="text"
                id="electionTitle"
                value={electionTitle}
                onChange={(e) => setElectionTitle(e.target.value)}
                name="electionTitle"
                placeholder="Enter Election Title"
                className="w-100 px-4 py-2 border text-white placeholder:text-gray-400 border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                htmlFor="electionDesc"
                className="block text-sm font-medium text-white"
              >
                Election Description
              </label>
              <input
                type="text"
                id="electionDesc"
                value={electionDesc}
                onChange={(e) => setElectionDesc(e.target.value)}
                name="electionDesc"
                placeholder="Enter Election Description"
                className="w-100 px-4 py-2 text-white placeholder:text-gray-400 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-white"
              >
                Election End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={electionEnd}
                onChange={(e) => setElectionEnd(e.target.value)}
                name="endDate"
                placeholder="Enter Election End Date"
                className="w-100 px-4 py-2 border text-gray-500 placeholder:text-gray-700 border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 p-1 mt-7 rounded-3xl w-50 hover:bg-blue-800"
            >
              Create Election
            </button>
          </form>
        </div>
      </div>
      <div className="col-span-2 row-span-5 col-start-4 row-start-2">
        <h1 className="text-2xl  mb-1 w-full text-center">Ongoing Election</h1>
        <div className=" flex justify-center mt-5">
          {election.map((elections, index) => {
            return (
              <div
                key={index}
                className="w-auto h-fit rounded p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-center items-center"
              >
                <span className="text-white">Title: {elections.title}</span>
                <span className="text-white">
                  End Date: {elections.end_date}
                </span>
                <span className="text-white">Status: {elections.status}</span>

                {/* Button for Closing Election */}
                <button
                  className="bg-red-500 text-white mt-5 p-1 rounded w-30 hover:bg-red-800"
                  onClick={() =>
                    handleUpdateElectionStatus(
                      elections.election_id,
                      "ended",
                      elections.title,
                      elections.description
                    )
                  }
                >
                  Close Election
                </button>

                {/* Button for Setting Active Election */}
                {elections.status === "pending" && (
                  <button
                    className="bg-blue-500 text-white mt-5 p-1 rounded w-30 hover:bg-blue-800"
                    onClick={() =>
                      handleUpdateElectionStatus(
                        elections.election_id,
                        "active",
                        elections.title,
                        elections.description
                      )
                    }
                  >
                    Set Active
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ElectionForm;
