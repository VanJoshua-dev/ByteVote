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
import UserProfile from './components/UserProfile';
import VoterProfile from './components/VoterProfile';
import Home from './pages/Home';
import ElectionPage from './components/ElectionPage';
import Unautorized from './components/Unauthorized';
import Middleware from './components/Middleware';
import VotingPage from './components/VotingPage';
import Thankyou from './components/Thankyou';
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
        <Route path="/adminDashboard" element={
          <Middleware requiredRole={"admin"}>
              <DashBoard />
          </Middleware>
        } />
        {/* Votes page */}
        <Route path="/votes" element={ 
          <Middleware requiredRole={"admin"}>
              <Votes />
          </Middleware>
        } />
        {/* Voters page */}
        <Route path="/voters" element={
          <Middleware requiredRole={"admin"}>
              <Voters />
          </Middleware>
        } />
        {/* Candidates page */}
        <Route path="/candidates" element={
          <Middleware requiredRole={"admin"}>
              <Candidates />
          </Middleware>
        } />
        {/* Position page */}
        <Route path="/positions" element={
          <Middleware requiredRole={"admin"}>
              <Position />
          </Middleware>
        } />
        {/* Election History page */}
        <Route path="/history" element={
          <Middleware requiredRole={"admin"}>
              <ElectionHistory />
          </Middleware>
        } />
        {/* Create Election page */}
        <Route path="/create" element={
          <Middleware requiredRole={"admin"}>
              <CreateElection />
          </Middleware>
        } />
        {/* UserProfile page */}
        <Route path="/profile" element={<UserProfile />} />

        {/* Home page page */}
        <Route path="/dashboard" element={
          
          <Middleware requiredRole={"voter"}>
              <Home />
          </Middleware>
        } />
        {/* Election Page */}
        <Route path="/election" element={
          <Middleware requiredRole={"voter"}>
              <ElectionPage />
          </Middleware>
        } />

        {/* handle user profile */}
        <Route path="/voterprofile" element={
          <Middleware requiredRole={"voter"}>
              <VoterProfile />
          </Middleware>
          
        } />

        {/* handle voting page */}
        <Route path="/votingpage" element={
          <Middleware requiredRole={"voter"}>
             <VotingPage />
          </Middleware>
          
        } />
        <Route path="/tnx" element={
            <Thankyou />
        } />
        {/* handle not existing page page */}
        <Route path="*" element={<NotFound />} />
        {/* Unautorized access */}
        <Route path="/unauthorized" element={<Unautorized />} />
      </Routes>
    </>
  )
}

export default App
