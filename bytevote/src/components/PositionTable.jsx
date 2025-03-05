import React from "react";
import { useState, useEffect, useRef } from "react";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { RxReset } from "react-icons/rx";
import { IoIosAddCircleOutline } from "react-icons/io";
import clsx from "clsx";
import { BsExclamationCircle } from "react-icons/bs";
import axios from "axios";
function Positiontable(getToken) {
    const [positionName, setPositionName] = useState("");
  const [showModal, setShowModal] = useState(false); //handle add modal
  const [editModal, setEditModal] = useState(false); //handle edit modal
  const [deleteModal, setDeleteModal] = useState(false); //handle delete modal

  const [editPosition, setEditPosition] = useState(null); //handle
  const [delPosition, setDelPosition] = useState(null); //handle

  const [positions, setPositions] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredPositions, setFilteredPositions] = useState([]);
  useEffect(() => {
    const filteredPositions = async () => {
      try {
        const token = getToken.token; // Retrieve token
        console.log("Token: " + token);
        const response = await axios.get("http://localhost:5000/getPositions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPositions(response.data);
        setFilteredPositions(response.data);
      } catch (e) {
        console.error("Error fetching positions: ", e);
      }
    };
    filteredPositions();
    const interval = setInterval(filteredPositions, 5000);
    return () => clearInterval(interval);
  }, [getToken]);

  useEffect(() => {
    setFilteredPositions(
      positions.filter((position) =>
        position.position_name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, positions]);

  //hadle edit
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken.token;
      const response = await axios.patch(
        "http://localhost:5000/editPosition",
        {
          positionID: editPosition.position_id, // Ensure voter_id is included
          newPosName: editPosition.position_name, // Ensure
          // Optional password update
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ Update Successful");
      setEditModal(false);
    } catch (e) {
      alert(e.message);
      console.error("Error editing position: ", e);
    }
  };

  //handle delete
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const token = getToken.token;
      const response = await axios.delete(
        "http://localhost:5000/deletePosition", // Use DELETE method
        {
          data: {
            positionID: delPosition.position_id,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ Delete Successful");
      setDeleteModal(false);
    } catch (e) {
      alert(e.message);
      console.error("Error Deleting position: ", e);
    }
  };
  //handle add
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
        const token = getToken.token;  // Ensure getToken() returns the correct token
        const response = await axios.post(
            "http://localhost:5000/addPosition",
            { positionName: positionName },  // Ensure key matches backend
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        alert("✅ Add Successful");
        setShowModal(false);
    } catch (e) {
        alert(e.response?.data?.message || "An error occurred");
        console.error("Error adding position: ", e);
    }
};
  return (
    <div className=" h-auto">
      {/* Add Modal */}
      <div
        className={clsx(
          "fixed z-50 w-fit bg-white top-5  left-85 rounded-2xl  p-3",
          { hidden: !showModal }
        )}
      >
        <h1 className="text-3xl mb-3 pb-1 border-b-4 w-60">Add new position</h1>
        <form onSubmit={handleAdd}>
          <div className="flex gap-2">
            <div>
              <label
                htmlFor="positionName"
                className="block text-sm font-medium text-gray-900 dark:text-black"
              >
                Position Name
              </label>
              <input
                type="text"
                id="positionName"
                name="positionName"
                value={positionName}
                onChange={
                    (e) => setPositionName(e.target.value)
                }
                placeholder="Position Name"
                className="w-100 px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
              />
            </div>
          </div>

          <div className="mt-2 flex justify-center gap-2">
            <button
              type="submit"
              className="w-35 px-4 py-2 bg-blue-500  text-white rounded-lg hover:bg-blue-600 transition"
            >
              Add Position
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
          "fixed z-50 w-fit bg-white top-5  left-85 rounded-2xl  p-3",
          { hidden: !editModal }
        )}
      >
        <h1 className="text-3xl mb-3 pb-1 border-b-4 w-50">Edit Position</h1>
        <form onSubmit={handleEdit}>
          <div className="flex gap-2">
            <div>
              <input
                type="hidden"
                id="positionID"
                name="positionID"
                value={editPosition?.position_id || ""}
                className="w-100 px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="newPosName"
                className="block text-sm font-medium text-gray-900 dark:text-black"
              >
                New Position Name
              </label>
              <input
                type="text"
                id="newPosName"
                name="newPosName"
                value={editPosition?.position_name || ""}
                onChange={(e) => {
                  setEditPosition({
                    ...editPosition,
                    position_name: e.target.value,
                  });
                }}
                placeholder="New Position Name"
                className="w-100 px-4 py-2  border border-gray-300 focus:outline-none focus:border-blue-300 rounded-md"
              />
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
          "fixed z-50 p-2 left-150 flex flex-col justify-center items-center bg-white rounded-2xl",
          { hidden: !deleteModal }
        )}
      >
        <BsExclamationCircle size={50} color="red" />
        <h3>Are you sure you want continue?</h3>
        <form onSubmit={handleDelete}>
          <input
            type="hidden"
            value={delPosition?.position_id || ""}
            name="positionID"
            id="positionID"
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
            placeholder="Search Position..."
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
            <span className="mr-2">Add Position </span>
            <IoIosAddCircleOutline size={20} />
          </button>
        </div>
      </div>

      <div className="relative overflow-x-auto shadow-md h-129.5  overflow-auto scroll-smooth ">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Position ID
              </th>
              <th scope="col" className="px-6 py-3">
                Position Name
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPositions.map((position, index) => (
              <tr
                key={position.id || index}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {position.position_id}
                </th>
                <td className="px-6 py-4">{position.position_name}</td>
                <td className="px-6 py-4">
                  <button
                    data-modal-target="crud-modal"
                    data-modal-toggle="crud-modal"
                    className="text-white bg-green-600 rounded py-2 px-2 hover:bg-green-800"
                    onClick={() => {
                      setEditModal(true);
                      setEditPosition(position);
                    }}
                  >
                    <FaRegEdit size={16} />
                  </button>{" "}
                  <button
                    className="text-white bg-red-600 rounded py-2 px-2 hover:bg-red-800"
                    onClick={() => {
                      setDeleteModal(true);
                      setDelPosition(position);
                    }}
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

export default Positiontable;
