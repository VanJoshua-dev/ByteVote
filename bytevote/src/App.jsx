import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import './App.css'

//components
//import SideBar from './components/SideBar'
import LandingPage from './pages/LandingPage';
import DashBoard from './pages/DashBoard';
import SideBar from './components/SideBar';
import NotFound from './pages/NotFound';
import Stats from './components/Stats';
import Votes from './components/Votes';
import Voters from './components/Voters';
import Position from './components/Position';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import Candidates from './components/Candidates';
import ElectionHistory from './components/ElectionHistory';
import CreateElection from './components/CreateElection';
function App() {
  
  return (
    <>
     <Routes>
      {/* Landing page */}
        <Route path="/" element={<LandingPage />} />
        {/* Login page */}
        <Route path="/login" element={<LoginForm />} />
        {/* Sign page */}
        <Route path="/signup" element={<RegistrationForm />} />
        {/* Admin DashBoard page */}
        <Route path="/dashboard" element={<DashBoard />} />
        {/* Votes page */}
        <Route path="/votes" element={<Votes />} />
        {/* Voters page */}
        <Route path="/voters" element={<Voters />} />
        {/* Position page */}
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/positions" element={<Position />} />
        <Route path="/history" element={<ElectionHistory />} />
        <Route path="/create" element={<CreateElection />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
