import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Users, Settings, Menu, Vote, UserCheck, Archive, PlayCircle } from "lucide-react";
import { FaUserTie } from "react-icons/fa";
import { LiaUserTieSolid } from "react-icons/lia";
import clsx from "clsx";

//image
import sampleProfile from "../assets/userprofile/sampleProfile.png"
const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);//handle sidebar
  const location = useLocation();//handle active page
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Detect mobile

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigate = useNavigate();

  return (
      <div className="sideBar">
        <div
          className={clsx(
            "bg-gray-800 text-white h-185 sm:h-180 md:h-180 lg:h-178 2xl:h-155 shadow-orange-300 p-4  transition-all duration-300",
            { "w-64": isOpen, "w-20": !isOpen }
          )}
        >
          <div className="flex items-center justify-between">
            <h1 className={clsx("text-lg font-bold", { hidden: !isOpen })}>Admin Panel</h1>
            <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
              <Menu />
            </button>
          </div>
          {/* user profile */}
          {isMobile && (
          <div className={clsx("mt-4 flex items-center space-x-3 p-2 rounded-md ", { "bg-gray-700": location.pathname === "/profile"})} onClick={() => navigate("/profile")}>
            {/* Profile Image (Always Visible) */}
            <img src={sampleProfile} alt="Profile" className="w-10 h-10 rounded-full" />

            {/* Name & Role (Hidden When Sidebar is Closed) */}
            <div className={clsx("transition-all duration-300", { hidden: !isOpen })}>
              <p className="text-sm font-semibold">John Doe</p>
              <p className="text-xs text-gray-300">Admin</p>
            </div>
          </div>
        )}
          <div className="mt-5">
            <h2 className="text-gray-400 text-sm uppercase">Reports</h2>
            <ul className="space-y-2 mt-2">
              <li>
                <Link to="/adminDashboard" className={clsx("flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md cursor-pointer", { "bg-gray-700": location.pathname === "/adminDashboard" })}>
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
                  <LiaUserTieSolid size={25} />
                  <span className={clsx({ hidden: !isOpen })}>Candidates</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="mt-5">
            <h2 className="text-gray-400 text-sm uppercase">History</h2>
            <ul className="space-y-2 mt-2">
              <li>
                <Link to="/history" className={clsx("flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md cursor-pointer", { "bg-gray-700": location.pathname === "/history" })}>
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
                <Link to="/create" className={clsx("flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md cursor-pointer", { "bg-gray-700": location.pathname === "/create" })}>
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
