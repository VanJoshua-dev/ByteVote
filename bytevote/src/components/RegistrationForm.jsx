import React from "react";
import { Link } from "react-router-dom";
function RegistrationForm() {
  return (
    <div className=" flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-80 h-140 mt-70 overflow-auto sm:h-160 sm:mt-40   md:w-96 sm:w-96 lg:w-96 lg:h-180 2xl:w-96 2xl:mt-20 2xl:h-170">
        <h2 className="text-3xl font-extrabold text-center mb-6">
          BYTEVote Register
        </h2>
        <form className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">Firstname</label>
            <input
              type="text"
              name="username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">Lastname</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">LRN</label>
            <input
              type="text"
              name="gender"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your LRN"
            />
          </div>
          <div>
            <label
              className="block mb-2 text-sm font-medium text-gray-600">
              Gender
            </label>
            <select
              id="countries"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option disabled selected>-- Select a gender --</option>
              <option value="US">Male</option>
              <option value="CA">Female</option>
              <option value="FR">Prefere not to say</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">Prefered Username</label>
            <input
              type="text"
              name="pref-username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your prefered username"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">Prefered Password</label>
            <input
              type="text"
              name="pref-password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your prefered password"
            />
          </div>
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
            Sign up
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;
