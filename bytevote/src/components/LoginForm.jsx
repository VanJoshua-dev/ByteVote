import React from "react";
import { Link } from "react-router-dom";

const LoginForm = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-80 mt-36 md:w-96 sm:w-96 lg:w-96 2xl:w-96">
        <h2 className="text-3xl font-extrabold text-center mb-6" >BYTEVote Login</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-600">Username</label>
            <input 
              type="text" 
              name="username" 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter your username" 
            />
          </div>
          <div>
            <label className="block text-gray-600">Password</label>
            <input 
              type="password" 
              name="password" 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter your password" 
            />
          </div>
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">Login</button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">Forgot Password?</Link>
        </div>
        <div className="mt-4 text-center text-sm">
          <p>Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link></p>
        </div>
       
      </div>
    </div>
  );
};

export default LoginForm;
