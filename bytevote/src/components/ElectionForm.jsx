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
      const response = await axios.post(
        "http://localhost:5000/createElection",
        {
          title: electionTitle,
          desc: electionDesc,
          endDate: electionEnd,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      alert("Election Created Successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to Create Election");
    } finally {
      setElectionTitle("");
      setElectionDesc("");
      setElectionEnd(null);
    }
  };

  //hanldle set active
  const handleUpdateElectionStatus = async (electionId, newStatus, electionTitle, electionDesc) => {
    try {
      const token = getToken.token;
      const response = await axios.patch(
        "http://localhost:5000/updateStatus",
        {
          election_ID: electionId, // FIXED: Pass the correct election ID
          status: newStatus,
          title: electionTitle,
          desc: electionDesc, // FIXED: Pass the correct election description
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message) {
        alert(`Election set to ${newStatus} successfully!`);
        // Refresh election data
      } else {
        alert("Failed to update election status.");
      }
    } catch (error) {
      console.error("Error updating election:", error);
      alert("Something went wrong.");
    }
  };

  //fetch election
  useEffect(() => {
    const fetchElection = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getElection");
        setElection(response.data);
      } catch (error) {
        console.error(error);
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
                    handleUpdateElectionStatus(elections.election_id, "ended", elections.title, elections.description)
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
