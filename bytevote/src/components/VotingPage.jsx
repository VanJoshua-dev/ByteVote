import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Userheader from './Userheader';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

function VotingPage(electionTitle) {
  const navigate = useNavigate();
  const [positions, setPositions] = useState([]);
  const [selectedVotes, setSelectedVotes] = useState({}); // Stores selected candidate per position

  // Get user info from localStorage
  const token = localStorage.getItem('user_id');
  const role = localStorage.getItem('role');
  const id = localStorage.getItem('voterID');
  const username = localStorage.getItem('user_name');
  console.log("voter ID: " ,id);
  // Fetch candidates by position
  useEffect(() => {
    const fetchCandidates = async () => {
        try {
            const response = await fetch("https://byte-vote.vercel.app/api/electionCandidates");
            if (!response.ok) {
                throw new Error("Failed to fetch election candidates");
            }
            const data = await response.json();
            setPositions(data);
        } catch (error) {
            console.error("Error fetching election candidates:", error);
        }
    };

    fetchCandidates();
}, []);

  // Handle candidate selection
  const handleSelectCandidate = (positionId, candidateId) => {
    setSelectedVotes(prev => ({
      ...prev,
      [positionId]: candidateId
    }));
  };

  // Handle vote submission
  const handleSubmitVote = async () => {
    if (Object.keys(selectedVotes).length === 0) {
        alert("Please select at least one candidate before submitting.");
        return;
    }

    const id = localStorage.getItem("voterID"); // Ensure id is retrieved here
    console.log("Voter ID in frontend:", id); // Debugging

    const votes = Object.entries(selectedVotes).map(([positionId, candidateId]) => ({
        candidate_id: candidateId,
        position_id: positionId,
    }));

    try {
        const response = await fetch("https://byte-vote.vercel.app/api/electionVote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ voter_id: id, votes }), // ✅ Now sending voter_id properly
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error submitting vote");
        }

        alert("Vote submitted successfully!");
        navigate("/dashboard"); // Redirect after voting
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

  return (
    <div className='w-screen h-screen'>
      <Userheader />
      <div className='pt-2'>
        <div className='p-2 flex justify-between'>
          <button className='bg-blue-500 text-white text-2xl p-2 flex justify-between items-center rounded-sm' onClick={() => {navigate('/dashboard'); localStorage.removeItem('title');}}>
            <IoIosArrowBack /> Return to Home
          </button>
          <span className='text-white font-semibold font-sans text-2xl'>{"Voter: "} {username}</span>
        </div>

        <h2 className='text-center text-2xl'>{localStorage.getItem('title')}</h2>
        <div className='ballot-container mt-10 p-2 h-[550px] overflow-y-auto'>

          {positions.map(position => (
            <div key={position.position_id} className='p-2 w-full'>
              <div className='flex justify-center items-center'>
                <h2 className='text-center text-xl bg-blue-100 p-2 pl-5 pr-5 rounded-t-xl'>{position.position_name}</h2>
              </div>
              <div className="w-full flex flex-row flex-nowrap overflow-x-auto border p-2 gap-5 whitespace-nowrap scrollbar-hide">
                {position.candidates.length > 0 ? (
                  position.candidates.map(candidate => (
                    <div key={candidate.candidate_id} className={`min-w-[160px] flex flex-col justify-center item-center p-2 rounded-md cursor-pointer 
                      ${selectedVotes[position.position_id] === candidate.candidate_id ? 'bg-blue-200' : 'bg-white'}`} 
                      onClick={() => handleSelectCandidate(position.position_id, candidate.candidate_id)}
                    >
                      <div className='flex justify-center items-center'>
                        <img src={`https://byte-vote.vercel.app/public/userprofile/${candidate.avatar}`} alt="" className="w-30 h-30 object-cover object-center rounded-full"/>
                      </div>
                      <div className='text-center'>
                        <h3 className='text-gray-600'>{candidate.name}</h3>
                        <p className='text-gray-400'>{candidate.platform}</p>
                        <p className='text-gray-400'>{candidate.credibility}</p>
                        <button 
                          className={`bg-blue-500 mt-2 text-white font-medium rounded-full w-full py-2 hover:bg-blue-700 focus:bg-blue-900
                          ${selectedVotes[position.position_id] === candidate.candidate_id ? 'bg-blue-900' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent parent div click event
                            handleSelectCandidate(position.position_id, candidate.candidate_id);
                          }}
                        >
                          {selectedVotes[position.position_id] === candidate.candidate_id ? 'Selected' : 'Vote'}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className='text-gray-500'>No candidates available for this position.</p>
                )}
              </div>
            </div>
          ))}

          {/* Submit Vote Button */}
          <div className='flex justify-center items-center p-20'>
            <button onClick={handleSubmitVote} className='bg-blue-500 mt-2 w-50 text-white font-medium rounded-md py-2 hover:bg-blue-700 focus:bg-blue-900'>
              Submit Vote
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default VotingPage;
