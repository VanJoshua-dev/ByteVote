import React from 'react'
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BreadCrumb from './BreadCrumb'
import { Home, Users, Settings, Menu, Vote, UserCheck, Archive, PlayCircle } from "lucide-react";
import { LiaUserTieSolid } from "react-icons/lia";
import { PiPrinter } from "react-icons/pi";

import axios from "axios";
//components
import VotesTally from './VotesTally';
const Stats = (getToken) => {
  const navigate = useNavigate();
  //fetch data from server
  const [voters, setVoters] = useState(null);
  const [votes, setVoted] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);// handle Error
  //fetch data from server
  useEffect(() => {
    const fetchMultipleTables = async () => {
      try {
        const token = getToken.token; // Retrieve token
        console.log("Token: " + token);
        // Fetch data in parallel
        const [votersRes, votesRes, positionRes, candidatesRes] = await Promise.all([
          axios.get("http://localhost:5000/adminDashboard?data=voters", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5000/adminDashboard?data=votedVoters", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5000/adminDashboard?data=positions", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5000/adminDashboard?data=candidates", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        // Update state
        setVoters(votersRes.data[0].count);
        setVoted(votesRes.data[0].count);
        setPosition(positionRes.data[0].count);
        setCandidate(candidatesRes.data[0].count);
      } catch (err) {
        setError(err.response ? err.response.data : err.message);
      }
    };

    fetchMultipleTables();
    const interval = setInterval(fetchMultipleTables, 5000);

    return () => clearInterval(interval);
  }, []);


if(error){
  return (
    <div className="flex justify-center items-center h-full">
      <div className="p-10 text-center text-red-500">
        {error}
      </div>
    </div>
  );
}

  //handle print button
  const printRef = useRef();
  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };
  return (
    <div className=' gap-1 h-154   overflow-auto animate-fade-down'>
      
    {/* breadrumb */}
    <BreadCrumb items={[{ label: "Home", path: "/adminDashboard" }, { label: "Dashboard" }]} />
    {/* stats */}
      <div className="grid grid-cols-4 grid-rows-6 gap-3 mt-3 p-5">
        {/* card 1 */}
        <div className="col-span-2 row-span-3  p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-between p-3">
               <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Total Voters</h2>
                <p className="text-gray-600 dark:text-gray-400 text-2xl">{voters}</p>
              </div>
              <div>
                  <Users size={100} className='text-[#4b548b]' />
              </div>
            </div>
           
            <div className='text-center'>
              <button className="w-50 h-10  bg-blue-500 text-white font-medium rounded-full text-center hover:bg-blue-900" onClick={() => navigate("/voters")}>View Details</button>
            </div>
        </div>
        {/* card 2 */}
        <div className="col-span-2 row-span-3 col-start-3  p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-between p-3">
               <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Voters Voted</h2>
                <p className="text-gray-600 dark:text-gray-400 text-2xl">{votes}</p>
              </div>
              <div>
                  <Vote size={100} className='text-[#4b548b]' />
              </div>
            </div>
           
            <div className='text-center'>
              <button className="w-50 h-10  bg-blue-500 text-white font-medium rounded-full text-center hover:bg-blue-900" onClick={() => navigate("/votes")}>View Details</button>
            </div>
        </div>
        {/* card 3 */}
        <div className="col-span-2 row-span-3 row-start-4  p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="flex justify-between p-3">
               <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Total Positions</h2>
                <p className="text-gray-600 dark:text-gray-400 text-2xl">{position}</p>
              </div>
              <div>
                  <UserCheck size={100} className='text-[#4b548b]' />
              </div>
            </div>
           
            <div className='text-center'>
              <button className="w-50 h-10  bg-blue-500 text-white font-medium rounded-full text-center hover:bg-blue-900" onClick={() => navigate("/positions")}>View Details</button>
            </div>
        </div>
        {/* card 4 */}
        <div className="col-span-2 row-span-3 col-start-3 row-start-4  p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="flex justify-between p-3">
               <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Total Candidates</h2>
                <p className="text-gray-600 dark:text-gray-400 text-2xl">{candidate}</p>
              </div>
              <div>
                  <LiaUserTieSolid size={100} className='text-[#4b548b]' />
              </div>
            </div>
           
            <div className='text-center'>
              <button className="w-50 h-10  bg-blue-500 text-white font-medium rounded-full text-center hover:bg-blue-900" onClick={() => navigate("/candidates")}>View Details</button>
            </div>
        </div>
      </div>
      {/* Voting tally */}
      <div className='flex flex-wrap flex-col justify-center item-center p-2 mt-1 bg-dark'>
        <div className="flex justify-between  pl-5 pr-5 p-3 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <h5 className='text-3xl font-medium text-white'>Vote Tally</h5>
          <button className='flex justify-center items-center gap-1 bg-green-500 p-1 rounded-lg text-white text-2xl' onClick={handlePrint}><PiPrinter  size={30} color='white'/> Print</button>
        </div>
        {/* table tally */}
        <div className='p-3 shadow-sm h-fit rounded-2xl mt-2 dark:bg-gray-800 dark:border-gray-70' ref={printRef}>
           <VotesTally />
        </div>
      </div>

    </div>
  )
}

export default Stats
