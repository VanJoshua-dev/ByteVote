import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaBarsStaggered } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { IoHomeSharp } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import image from "../assets/userprofile/sampleProfile.png";
import { MdHowToVote } from "react-icons/md";
import clsx from 'clsx';
function UserSidebar() {
    const [isOpen, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
     const handleLogout = () => {
        localStorage.clear();

        alert("👋 Logged out successfully!");

        navigate("/login"); // Redirect to login page
    };

    //fetch data from voters

  return (
    <div className='fixed top-35 '>
        {!isOpen ? <button className='p-2' onClick={() => setOpen(true)}>
            <FaBarsStaggered color='white' size={30} />
        </button> : <button className='p-2' onClick={() => setOpen(false)}>
            <IoClose color='white' size={30} />
        </button>}
        
        <div className={clsx('fixed bg-gray-700 h-full rounded-r-md p-4', {"left-0": isOpen, "left-[-1000px]": !isOpen})}>
            <div className='p-4 flex flex-col justify-center items-center'>
                <div>
                    <img src={image} alt="" className='h-18 w-18 rounded-full border-3 border-amber-500'/>
                </div>
                <div>
                    <span className='text-white text-2xl font-semibold'>Username</span>
                    <p className='text-gray-400'>Admin</p>
                </div>
            </div>
            <ul className='list-group  h-full'>
                <li className='mb-10 '>
                    <Link to="/dashboard" className={clsx("flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md cursor-pointer", { "bg-blue-800": location.pathname === "/dashboard" })}>
                    <IoHomeSharp color='white' size={30} />
                    <span className={clsx("text-white text-2xl", { hidden: !isOpen })}>Dashboard</span>
                    </Link>
                </li>
                <li className=''>
                    <Link to="/login" className={clsx("flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md cursor-pointer", { "bg-gray-700": location.pathname === "/positions" })}>
                    <FiLogOut color='white' size={30} />
                    <span className={clsx("text-white text-2xl", { hidden: !isOpen })} onClick={handleLogout}>Logout</span>
                    </Link>
                </li>
                
            </ul>
        </div>
    </div>
  )
}

export default UserSidebar
