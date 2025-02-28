import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { Home, Users, Settings, Menu, Vote, UserCheck, Archive, PlayCircle } from "lucide-react";
import clsx from "clsx";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  return (
      <div className="sideBar">
        <div
          className={clsx(
            "bg-gray-800 text-white h-185 sm:h-183 md:h-180 lg:h-178 mt-2 p-4 transition-all duration-300",
            { "w-64": isOpen, "w-20": !isOpen }
          )}
        >
          <div className="flex items-center justify-between">
            <h1 className={clsx("text-lg font-bold", { hidden: !isOpen })}>Admin Panel</h1>
            <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
              <Menu />
            </button>
          </div>
          
          <div className="mt-5">
            <h2 className="text-gray-400 text-sm uppercase">Reports</h2>
            <ul className="space-y-2 mt-2">
              <li>
                <Link to="/dashboard" className={clsx("flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md cursor-pointer", { "bg-gray-700": location.pathname === "/dashboard" })}>
                  <Home />
                  <span className={clsx({ hidden: !isOpen })}>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/votes" className={clsx("flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md cursor-pointer", { "bg-gray-700": location.pathname === "/votes" })}>
                  <Vote />
                  <span className={clsx({ hidden: !isOpen })}>Votes</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="mt-5">
            <h2 className="text-gray-400 text-sm uppercase">Manage</h2>
            <ul className="space-y-2 mt-2">
              <li>
                <Link to="/voters" className={clsx("flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md cursor-pointer", { "bg-gray-700": location.pathname === "/voters" })}>
                  <Users />
                  <span className={clsx({ hidden: !isOpen })}>Voters</span>
                </Link>
              </li>
              <li>
                <Link to="/positions" className={clsx("flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md cursor-pointer", { "bg-gray-700": location.pathname === "/positions" })}>
                  <UserCheck />
                  <span className={clsx({ hidden: !isOpen })}>Positions</span>
                </Link>
              </li>
              <li>
                <Link to="/candidates" className={clsx("flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md cursor-pointer", { "bg-gray-700": location.pathname === "/candidates" })}>
                  <Settings />
                  <span className={clsx({ hidden: !isOpen })}>Candidates</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="mt-5">
            <h2 className="text-gray-400 text-sm uppercase">History</h2>
            <ul className="space-y-2 mt-2">
              <li>
                <Link to="/history" className={clsx("flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md cursor-pointer", { "bg-gray-700": location.pathname === "/election-history" })}>
                  <Archive />
                  <span className={clsx({ hidden: !isOpen })}>Election History</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="mt-5">
            <h2 className="text-gray-400 text-sm uppercase">Control</h2>
            <ul className="space-y-2 mt-2">
              <li>
                <Link to="/create" className={clsx("flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md cursor-pointer", { "bg-gray-700": location.pathname === "/start-election" })}>
                  <PlayCircle />
                  <span className={clsx({ hidden: !isOpen })}>Start Election</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        
      </div>
  );
};

export default SideBar;
