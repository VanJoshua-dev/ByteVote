import React from "react";
import { useState, useEffect, useRef } from "react";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { RxReset } from "react-icons/rx";
import { IoIosAddCircleOutline } from "react-icons/io";
import clsx from "clsx";
import { BsExclamationCircle } from "react-icons/bs";
import Image from "../assets/userprofile/default_profile-m1.jpg";
import axios from "axios";
import { FaCircleCheck } from "react-icons/fa6";
import { BsExclamationCircleFill } from "react-icons/bs";
function VoterTable(getToken) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState();
  const [voters, setVoters] = useState([]);
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  const [editSuccess, setEditSuccess] = useState(false);
  const [editFailed, setEditFailed] = useState(false);

  const [delSuccess, setDelSuccess] = useState(false);
  const [delFailed, setDelFailed] = useState(false);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    LRN: "",
    gender: "",
    username: "",
    password: "",
  });

  const [showModal, setShowModal] = useState(false); //handle add modal
  const [editModal, setEditModal] = useState(false); //handle edit modal
  const [deleteModal, setDeleteModal] = useState(false); //handle delete modal

  const [editVoter, setEditVoter] = useState(null); // store the voter information based on id
  const [deleteVoter, setDeleteVoter] = useState(null); //handle delete voter

  const [search, setSearch] = useState(""); // Search query state
  const [filteredVoters, setFilteredVoters] = useState([]);
  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const token = getToken.token; // Retrieve token
        
        const response = await axios.get("https://byte-vote.vercel.app/api/getVoters", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
  
        if (Array.isArray(response.data.voters)) { // ✅ Ensure response is an array
          setVoters(response.data.voters);
          setFilteredVoters(response.data.voters);
        } else {
          console.error("API returned non-array data:", response.data);
          setVoters([]); // Fallback to empty array
        }
      } catch (err) {
        console.error("Error fetching voters:", err);
        setVoters([]); // Prevent filter errors
      }
    };
  
    fetchVoters();
    const interval = setInterval(fetchVoters, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Filter voters based on search input
    const results = voters.filter((voter) =>
      Object.values(voter)
        .join(" ") // Convert object values to a string
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFilteredVoters(results);
  }, [search, voters]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const token = getToken.token; // Get token for authentication
      const response = await axios.post(
        "https://byte-vote.vercel.app/api/addVoter",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Voter added successfully:", response.data);
      alert("Voter added successfully!");

      // Clear form fields after submission
      setFormData({
        firstname: "",
        lastname: "",
        LRN: "",
        gender: "",
        username: "",
        password: "",
      });

      setShowModal(false); // Close modal after successful submission
    } catch (error) {
      console.error("Error adding voter:", error);
      alert("Failed to add voter.");
    }
  };
  const handleEdit = async (e) => {
    e.preventDefault();
    
    if (!editVoter || !editVoter.voter_id) {
        console.error("No voter selected for editing");
        return;
    }

    try {
        const token = localStorage.getItem("user_id"); // Ensure correct key

        const response = await fetch("https://byte-vote.vercel.app/api/editVoter", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                voter_id: editVoter.voter_id,
                new_Firstname: editVoter.firstname,
                new_Lastname: editVoter.lastname,
                newLRN: editVoter.lrn,
                newGender: editVoter.gender,
                newUsername: editVoter.username,
                newPassword: editVoter.password || undefined,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Voter updated successfully:", data);
        setEditModal(false);
        setEditSuccess(true);
        setTimeout(() => setEditSuccess(false), 2000);

    } catch (error) {
        setEditFailed(true);
        setTimeout(() => setEditFailed(false), 2000);
        console.error("Error updating voter:", error.message);
    }
};

const handleDelete = async (e) => {
  e.preventDefault();
  try {
      const token = localStorage.getItem("user_id");

      await axios.delete(`https://byte-vote.vercel.app/api/deleteVoter/${deleteVoter.voter_id}`, { // ✅ Use URL param
          headers: { Authorization: `Bearer ${token}` }
      });

      setDeleteModal(false);
      setDelSuccess(true);
      setTimeout(() => setDelSuccess(false), 2000); // ✅ Use setTimeout instead of setInterval

  } catch (error) {
      setDelFailed(true);
      setTimeout(() => setDelFailed(false), 2000);
      console.error("Error deleting voter:", error.response?.data || error.message);
  }
};
  return (
    <div className=" h-139">
      {/* Success modal */}
      <div
        className={clsx(
          "w-50 d-flex justify-center item-center fixed bottom-0 right-3",
          { "right-[-300px]": !editSuccess }
        )}
      >
        <div
          id="alert-1"
          className="flex items-center p-4 mb-4 text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
          role="alert"
        >
          <FaCircleCheck size={20} />
          <h3 className="text-center flex justify-center items-center gap pl-1">
            {" "}
            Update Successfully
          </h3>
        </div>
      </div>
      {/* failed modal */}
      <div
        className={clsx(
          "w-50 d-flex justify-center item-center fixed bottom-0 right-3",
          { "right-[-300px]": !editFailed }
        )}
      >
        <div
          id="alert-1"
          className="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <BsExclamationCircleFill size={20} />
          <h3 className="text-center flex justify-center items-center gap pl-1">
            {" "}
            Update Failed
          </h3>
        </div>
      </div>
      {/* Delete Success */}
      <div
        className={clsx(
          "w-50 d-flex justify-center item-center fixed bottom-0 right-3",
          { "right-[-300px]": !delSuccess }
        )}
      >
        <div
          id="alert-1"
          className="flex items-center p-4 mb-4 text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:green-red-400"
          role="alert"
        >
          <FaCircleCheck size={20} />
          <h3 className="text-center flex justify-center items-center gap pl-1">
            {" "}
            Voter has been deleted
          </h3>
        </div>
      </div>
      {/* Delete Failed */}
      <div
        className={clsx(
          "w-50 d-flex justify-center item-center fixed bottom-0 right-3",
          { "right-[-300px]": !delFailed }
        )}
      >
        <div
          id="alert-1"
          className="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <BsExclamationCircleFill size={20} />
          <h3 className="text-center flex justify-center items-center gap pl-1">
            {" "}
            Voter delition failed
          </h3>
        </div>
      </div>
      {/* Add Modal */}
      <div
        className={clsx(
          "fixed z-50 w-4xl bg-white top-5  left-85 rounded-2xl shadow  p-3",
          { hidden: !showModal }
        )}
      >
        <h1 className="text-3xl mb-3 pb-1 border-b-4 w-50">Add new voter</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <div>
              <label
                htmlFor="firstname"
                className="block text-sm font-medium text-gray-900 dark:text-black"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="Enter First Name"
                className="w-100 px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-gray-900 dark:text-black"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Enter Last Name"
                className="w-100 px-4 py-2  border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
                required
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <div>
              <label
                htmlFor="LRN"
                className="block text-sm font-medium text-gray-900 dark:text-black"
              >
                LRN
              </label>
              <input
                type="number"
                id="LRN"
                name="LRN"
                value={formData.LRN}
                onChange={handleChange}
                placeholder="Enter LRN"
                className="w-100 px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-900 "
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-100 px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
              >
                <option defaultValue={""}>-- Select Gender --</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Prefere Not to Say</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-900 dark:text-black"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter Username"
                className="w-100 px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
                required
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900 dark:text-black"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                className="w-100 px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
                required
              />

              <div className="flex item-center  gap-1 mt-1">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={handleTogglePassword}
                  className="w-5 h-5 "
                />
                <p>Show Password</p>
              </div>
            </div>
          </div>
          <div className="mt-2 flex justify-center gap-2">
            <button
              type="submit"
              className="w-30 px-4 py-2 bg-blue-500  text-white rounded-lg hover:bg-blue-600 transition"
            >
              Add Voter
            </button>
            <button
              type="button"
              className="w-30 px-4 py-2 bg-red-500  text-white rounded-lg hover:bg-red-600 transition"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      {/* Edit modal */}
      <div
        className={clsx(
          "fixed z-50 w-4xl bg-white top-5  left-85 rounded-2xl shadow  p-3",
          { hidden: !editModal }
        )}
      >
        <h1 className="text-3xl mb-3 pb-1 border-b-4 w-50">Edit voter</h1>
        <form onSubmit={handleEdit}>
          <div className="flex gap-2">
            <input
              type="hidden"
              id="voter_ID"
              name="voter_id"
              value={editVoter?.voter_id || ""}
            />
            <div>
              <label
                htmlFor="firstname"
                className="block text-sm font-medium text-gray-900 dark:text-black"
              >
                First Name
              </label>
              <input
                type="text"
                id="newFirstname"
                value={editVoter?.firstname || ""}
                onChange={(e) =>
                  setEditVoter({ ...editVoter, firstname: e.target.value })
                } // Fix: Make input editable
                name="newFirstname"
                placeholder="Enter New First Name"
                className="w-100 px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                htmlFor="newLastname"
                className="block text-sm font-medium text-gray-900 dark:text-black"
              >
                Last Name
              </label>
              <input
                type="text"
                id="newLastname"
                value={editVoter?.lastname || ""}
                onChange={(e) =>
                  setEditVoter({ ...editVoter, lastname: e.target.value })
                }
                name="newLastname"
                placeholder="Enter New Last Name"
                className="w-100 px-4 py-2  border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
                required
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <div>
              <label
                htmlFor="newLRN"
                className="block text-sm font-medium text-gray-900 dark:text-black"
              >
                LRN
              </label>
              <input
                type="number"
                id="newLRN"
                value={editVoter?.lrn || ""}
                onChange={(e) =>
                  setEditVoter({ ...editVoter, lrn: e.target.value })
                }
                name="newLRN"
                placeholder="Enter New LRN"
                className="w-100 px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                htmlFor="newGender"
                className="block text-sm font-medium text-gray-900 "
              >
                Gender
              </label>
              <select
                id="newGender"
                value={editVoter?.gender || ""}
                onChange={(e) =>
                  setEditVoter({ ...editVoter, gender: e.target.value })
                }
                name="newGender"
                className="w-100 px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
                required
              >
                <option defaultValue={""}>-- Select New Gender --</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Prefere Not to Say</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <div>
              <label
                htmlFor="newUsername"
                className="block text-sm font-medium text-gray-900 dark:text-black"
              >
                Username
              </label>
              <input
                type="text"
                id="newUsername"
                value={editVoter?.username || ""}
                onChange={(e) =>
                  setEditVoter({ ...editVoter, username: e.target.value })
                }
                name="newUsername"
                placeholder="Enter New Username"
                className="w-100 px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
                required
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-900 dark:text-black"
              >
                New Password
              </label>{" "}
              {/* Optional for password to be edit modal */}
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                placeholder="Enter New Password (optional)"
                className="w-100 px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
              />
              <div className="flex item-center  gap-1 mt-1">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={handleTogglePassword}
                  className="w-5 h-5"
                />
                <p>Show Password</p>
              </div>
            </div>
          </div>
          <div className="mt-2 flex justify-center gap-2">
            <button
              type="submit"
              className="w-30 px-4 py-2 bg-blue-500  text-white rounded-lg hover:bg-blue-600 transition"
            >
              Save
            </button>
            <button
              type="button"
              className="w-30 px-4 py-2 bg-red-500  text-white rounded-lg hover:bg-red-600 transition"
              onClick={() => setEditModal(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      {/* delete modal */}
      <div
        className={clsx(  
          "fixed z-50 p-2 left-150 flex flex-col justify-center items-center bg-white shadow rounded-2xl",
          { hidden: !deleteModal }
        )}
      >
        <BsExclamationCircle size={50} color="red" />
        <h3>Are you sure you want continue?</h3>
        <form onSubmit={handleDelete}>
          <input
            type="hidden"
            name="voterID"
            value={deleteVoter?.voter_id || ""}
            id="voterID"
          />
          <div className="mt-5">
            <button
              type="button"
              className="bg-blue-500 text-white rounded-md px-4 py-2 ml-2 hover:bg-blue-800"
              onClick={() => setDeleteModal(false)}
            >
              No
            </button>
            <button
              type="submit"
              className="bg-red-500 text-white rounded-md px-4 py-2 ml-2 hover:bg-red-800"
            >
              Yes
            </button>
          </div>
        </form>
      </div>
      <div className="flex gap-2 p-2 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-t-md">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-96 p-2 ps-10  text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500  dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Name, LRN, Username..."
            required
          />
        </div>
        <div>
          <button
            type="button"
            data-modal-target="crud-modal"
            data-modal-toggle="crud-modal"
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-800 transition"
            onClick={() => setShowModal(true)}
          >
            <span className="mr-2">Add Voter </span>
            <IoIosAddCircleOutline size={20} />
          </button>
        </div>
      </div>

      <div className="relative overflow-x-auto shadow-md h-120 overflow-auto scroll-smooth ">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Voter ID
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                LRN
              </th>
              <th scope="col" className="px-6 py-3">
                Gender
              </th>
              <th scope="col" className="px-6 py-3">
                Username
              </th>
              <th scope="col" className="px-6 py-3">
                Password
              </th>
              <th scope="col" className="px-6 py-3">
                Avatar
              </th>
              <th scope="col" className="px-6 py-3">
                Date Created
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredVoters.length > 0 ? (
              filteredVoters.map((voter, index) => (
                <tr
                  key={voter.id || index}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {voter.voter_id}
                  </th>
                  <td className="px-6 py-4">
                    {voter.firstname} {voter.lastname}
                  </td>
                  <td className="px-6 py-4">{voter.lrn}</td>
                  <td className="px-6 py-4">{voter.gender}</td>
                  <td className="px-6 py-4">{voter.username}</td>
                  <td className="px-2 py-2 w-40 overflow-auto">
                    {voter.password.slice(0, 10)}...
                  </td>
                  <td className="px-6 py-4">
                    <img
                      src={"https://byte-vote.vercel.app/public/userprofile/" + voter.image_path}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td className="px-6 py-4">
                    {new Date(voter.date_created).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="text-white bg-green-600 rounded py-2 px-2 hover:bg-green-800"
                      onClick={() => {
                        setEditVoter(voter);
                        setEditModal(true);
                      }}
                    >
                      <FaRegEdit size={16} />
                    </button>{" "}
                    <button
                      className="text-white bg-red-600 rounded py-2 px-2 hover:bg-red-800"
                      onClick={() => {
                        setDeleteVoter(voter);
                        setDeleteModal(true);
                      }}
                    >
                      <AiOutlineDelete size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  No voters found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VoterTable;
