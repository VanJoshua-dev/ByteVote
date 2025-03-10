import React, { useEffect, useState, useMemo } from "react";
import { RxReset } from "react-icons/rx";

function VotesTable() {
  const [votes, setVotes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token"); // Assuming JWT is stored in localStorage

  useEffect(() => {
    const fetchVotes = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("https://byte-vote.vercel.app/api/votes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch votes");
        const data = await res.json();
        setVotes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching votes:", err);
        setError("Failed to load votes.");
      } finally {
        setLoading(false);
      }
    };

    fetchVotes();
  }, [token]); // Ensure token is included in dependency array
  console.log(votes);
  
  const deleteVote = async (voteId) => {
    if (!window.confirm("Are you sure you want to delete this vote?")) return;

    try {
      const res = await fetch(`https://byte-vote.vercel.app/api/votes/${voteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete vote");
      setVotes((prev) => prev.filter((vote) => vote.vote_id !== voteId)); // Optimistic update
    } catch (err) {
      console.error("Error deleting vote:", err);
      setError("Failed to delete vote.");
    }
  };
  
  const resetVotes = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset all votes? This action cannot be undone."
      )
    )
      return;

    try {
      const res = await fetch("https://byte-vote.vercel.app/api/votesReset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ confirm: "RESET_VOTES" }),
      });

      if (!res.ok) throw new Error("Failed to reset votes");
      setVotes([]); // Clear state after successful reset
    } catch (err) {
      console.error("Error resetting votes:", err);
      setError("Failed to reset votes.");
    }
  };

  // Optimized search filtering
  const filteredVotes = useMemo(() => {
    if (!search.trim()) return votes; // Prevents unnecessary filtering on empty search

    return votes.filter((vote) =>
      [vote?.candidate_name, vote?.position_name, vote?.voter_name]
        .filter(Boolean) // Removes undefined/null values
        .some((field) => field.toLowerCase().includes(search.toLowerCase()))
    );
  }, [votes, search]);
  return (
    <div className="h-auto">
      {/* Search & Reset */}
      <div className="flex justify-between p-2 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-t-md">
        <input
          type="search"
          placeholder="Search Candidate or Position..."
          className="block w-96 p-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-800 transition"
          onClick={resetVotes}
        >
          <span className="mr-2">Reset Votes</span>
          <RxReset />
        </button>
      </div>

      {/* Loading & Error Handling */}
      {loading && <p className="text-center py-4">Currently no votes yet.</p>}
      {error && <p className="text-center py-4 text-red-500">{error}</p>}

      {/* Table */}
      <div className="relative overflow-x-auto shadow-md h-[500px] overflow-auto scroll-smooth">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Vote ID</th>
              <th className="px-6 py-3">Candidate</th>
              <th className="px-6 py-3">Position</th>
              <th className="px-6 py-3">Voter</th>
              <th className="px-6 py-3">Vote Time</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVotes.length > 0 ? (
              filteredVotes.map((vote) => (
                <tr
                  key={vote.vote_id}
                  className="border-b border-gray-700 bg-gray-800"
                >
                  <td className="px-6 py-4">{vote.vote_id}</td>
                  <td className="px-6 py-4">{vote.candidate_name}</td>
                  <td className="px-6 py-4">{vote.position_name}</td>
                  <td className="px-6 py-4">{vote.voter_name}</td>
                  <td className="px-6 py-4">
                    {new Date(vote.vote_time).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteVote(vote.vote_id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No votes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VotesTable;
