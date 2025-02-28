import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import './App.css'

//components
//import SideBar from './components/SideBar'
import LandingPage from './pages/LandingPage';

function App() {
  
  return (
    <>
    <LandingPage />
      {/* <SideBar />
      <div className="flex-1 p-5 bg-gray-100">
          <Routes>
            <Route path="/" element={<h1>Dashboard</h1>} />
            <Route path="/votes" element={<h1>Votes</h1>} />
            <Route path="/voters" element={<h1>Voters</h1>} />
            <Route path="/positions" element={<h1>Positions</h1>} />
            <Route path="/candidates" element={<h1>Candidates</h1>} />
            <Route path="/election-history" element={<h1>Election History</h1>} />
            <Route path="/start-election" element={<h1>Start Election</h1>} />
          </Routes>
        </div> */}
    </>
  )
}

export default App
