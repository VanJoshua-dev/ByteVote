import React from "react";
import { useState, useEffect, useRef } from "react";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { RxReset } from "react-icons/rx";
import { IoIosAddCircleOutline } from "react-icons/io";
import clsx from "clsx";
import { BsExclamationCircle } from "react-icons/bs";
//images
import avatar from "../assets/userprofile/sampleProfile.png";
import axios from "axios";
function CandidateTable(getToken) {
  const [showModal, setShowModal] = useState(false); //handle add modal
  const [editModal, setEditModal] = useState(false); //handle edit modal
  const [deleteModal, setDeleteModal] = useState(false); //handle delete modal
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [editCandidates, setEditCandidates] = useState(null);
  const [positions, setPositions] = useState([]);
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const token = getToken.token; // Retrieve token
        console.log("Token: " + token);
        const response = await axios.get("http://localhost:5000/getPositions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPositions(response.data);
      } catch (e) {
        console.error("Error fetching positions: ", e);
      }
    };
    fetchPositions();
  }, []);
  useEffect(() => {
    const filteredCandidates = async () => {
      try {
        const token = getToken.token; // Retrieve token
        console.log("Token: " + token);
        const response = await axios.get(
          "http://localhost:5000/getCandidates",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCandidates(response.data);
        setFilteredCandidates(response.data);
      } catch (e) {
        console.error("Error fetching positions: ", e);
      }
    };
    filteredCandidates();
    const interval = setInterval(filteredCandidates, 5000);
    return () => clearInterval(interval);
  }, [getToken]);

  useEffect(() => {
    // Filter voters based on search input
    const results = candidates.filter((candidate) =>
      Object.values(candidate)
        .join(" ") // Convert object values to a string
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFilteredCandidates(results);
  }, [search, candidates]);

  //handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken.token; // Retrieve token
      console.log("Token: " + token);
      const { firstName, lastName } = e.target;
      const response = await axios.post(
        "http://localhost:5000/addCandidate",
        { firstName: firstName.value, lastName: lastName.value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setShowModal(false);
      setCandidates([...candidates, response.data]);
    } catch (e) {
      console.error("Error adding candidate: ", e);
    }
  };

  return (
    <div className=" h-auto">
      {/* Add Modal */}
      <div
        className={clsx(
          "fixed z-50 w-4xl bg-white top-5  left-85 rounded-2xl  p-3",
          { hidden: !showModal }
        )}
      >
        <h1 className="text-3xl mb-3 pb-1 border-b-4 w-70">
          Add new candidate
        </h1>
        <form action="">
          <div className="flex gap-2">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-900 dark:text-black"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Enter First Name"
                className="w-100 px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-900 dark:text-black"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Enter Last Name"
                className="w-100 px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
                required
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <div>
              <label
                htmlFor="candidatePosition"
                className="block text-sm font-medium text-gray-900 "
              >
                Position
              </label>
              <select
                id="candidatePosition"
                name="candidatePosition"
                className="w-100 px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
                required
              >
                <option defaultValue={""}>
                  -- Select Position --
                </option>
                {positions.map((position) => (
                  <option key={position.position_id} value={position.position_id}>
                    {position.position_name}
                  </option>
                ))}
              </select>
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
                className="w-100 px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
                required
              >
                <option defaultValue={""}>
                  -- Select Gender --
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Prefere Not to Say</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <div>
              <label
                htmlFor="credibility"
                className="block text-sm font-medium text-gray-900 dark:text-black"
              >
                Credibility
              </label>
              <textarea
                type="text"
                id="credibility"
                name="credibility"
                placeholder="Candidate Credibility"
                className="w-100 px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
                required
              ></textarea>
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="platform"
                className="block text-sm font-medium text-gray-900 dark:text-black"
              >
                Platform
              </label>
              <textarea
                type="text"
                id="platform"
                name="platform"
                placeholder="Candidate Platform"
                className="w-100 px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
                required
              ></textarea>
            </div>
          </div>
          <div className="">
            <label htmlFor="uploadImage" className="block text-sm font-medium  ">
              Upload Image
            </label>
            <input
              type="file"
              id="uploadImage"
              name="uploadImage"
              className=" w-100 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
            />
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
          "fixed z-50 w-4xl bg-white top-5  left-85 rounded-2xl  p-3",
          { hidden: !editModal }
        )}
      >
        <h1 className="text-3xl mb-3 pb-1 border-b-4 w-50">Edit Candidate</h1>
        <form action="">
          <div className="flex gap-2">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-900 dark:text-black"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Enter First Name"
                className="w-100 px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-900 dark:text-black"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Enter Last Name"
                className="w-100 px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
                required
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <div>
              <label
                htmlFor="candidatePosition"
                className="block text-sm font-medium text-gray-900 "
              >
                Position
              </label>
              <select
                id="candidatePosition"
                name="candidatePosition"
                className="w-100 px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
                required
              >
                <option defaultValue={""}>
                  -- Select Position --
                </option>
                {positions.map((position) => (
                  <option key={position.position_id} value={position.position_id}>
                    {position.position_name}
                  </option>
                ))}
              </select>
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
                className="w-100 px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
                required
              >
                <option defaultValue={""}>
                  -- Select Gender --
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Prefere Not to Say</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <div>
              <label
                htmlFor="credibility"
                className="block text-sm font-medium text-gray-900 dark:text-black"
              >
                Credibility
              </label>
              <textarea
                type="text"
                id="credibility"
                name="credibility"
                placeholder="Candidate Credibility"
                className="w-100 px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
                required
              ></textarea>
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="platform"
                className="block text-sm font-medium text-gray-900 dark:text-black"
              >
                Platform
              </label>
              <textarea
                type="text"
                id="platform"
                name="platform"
                placeholder="Candidate Platform"
                className="w-100 px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
                required
              ></textarea>
            </div>
          </div>
          <div className="">
            <label
              htmlFor="uploadImage"
              className="block text-sm font-medium text-gray-900 dark:text-black"
            >
              Upload Image
            </label>
            <input
              type="file"
              id="uploadImage"
              name="uploadImage"
              className="w-100 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
            />
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
          "fixed z-50 p-2 left-150 flex flex-col justify-center items-center bg-white rounded-2xl",
          { hidden: !deleteModal }
        )}
      >
        <BsExclamationCircle size={50} color="red" />
        <h3>Are you sure you want continue?</h3>
        <form action="">
          <input type="hidden" name="candidateID" id="candidateID" />
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="default-search"
            className="block w-96 p-2 ps-10  text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500  dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Candidate, Position..."
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
            <span className="mr-2">Add Candidate </span>
            <IoIosAddCircleOutline size={20} />
          </button>
        </div>
      </div>

      <div className="relative overflow-x-auto shadow-md h-128 overflow-auto scroll-smooth ">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Candidate ID
              </th>
              <th scope="col" className="px-6 py-3">
                Candidate Name
              </th>
              <th scope="col" className="px-6 py-3">
                Gender
              </th>
              <th scope="col" className="px-6 py-3">
                Position
              </th>
              <th scope="col" className="px-6 py-3">
                Credibility
              </th>
              <th scope="col" className="px-6 py-3">
                Platform
              </th>
              <th scope="col" className="px-6 py-3">
                Avatar
              </th>

              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map((candidate, index) => (
              <tr
                key={candidate.candidate_id || index}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {candidate.candidate_id}
                </th>
                <td className="px-6 py-4">
                  {candidate.firstname} {candidate.lastname}
                </td>
                <td className="px-6 py-4">{candidate.gender}</td>
                <td className="px-6 py-4">{candidate.position}</td>
                <td className="px-6 py-4">{candidate.credibility}</td>
                <td className="px-6 py-4">{candidate.platform}</td>
                <td className="px-6 py-4">
                  <img
                    src={avatar}
                    alt=""
                    className="w-12 h-12 border-2 border-amber-400 rounded-full"
                  />
                </td>
                <td className="px-6 py-4">
                  <button
                    data-modal-target="crud-modal"
                    data-modal-toggle="crud-modal"
                    className="text-white bg-green-600 rounded py-2 px-2 hover:bg-green-800"
                    onClick={() => {
                      setEditModal(true);
                      setEditCandidates(candidate);
                    }}
                  >
                    <FaRegEdit size={16} />
                  </button>{" "}
                  <button
                    className="text-white bg-red-600 rounded py-2 px-2 hover:bg-red-800"
                    onClick={() => setDeleteModal(true)}
                  >
                    <AiOutlineDelete size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CandidateTable;
