import React, {useState, useEffect} from "react";
//dom routing
import { BrowserRouter as Router, Routes, Route, Link, useLocation,useNavigate } from "react-router-dom";
//images
import byteicon from "../assets/byte-icon.png";
import loyolaLogo from "../assets/loyola-shs-logo.png";
import ByteLogo from "../assets/Byte-net-logo.png";
import trojanICT from "../assets/trojan-ICT.png";


const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (userRole === "admin") {
      navigate("/adminDashboard");
    } else if (userRole === "voter") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // ✅ Clear old session before login
      localStorage.removeItem("user_id");
      localStorage.removeItem("role");
      localStorage.removeItem("user_name");
      localStorage.removeItem("avatar");

      const response = await fetch("https://byte-vote.vercel.app/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid login credentials");
        return;
      }

      // ✅ Store user details in localStorage
      localStorage.setItem("user_id", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user_name", data.user);
      localStorage.setItem("avatar", data.avatar);
      localStorage.setItem("voterID", data.voterID);

      // ✅ Debugging logs
      console.log("User ID:", localStorage.getItem("user_id"));
      console.log("Role:", localStorage.getItem("role"));

      alert("✅ Login successful!");

      // ✅ Redirect based on role
      if (data.role === "admin") {
        navigate("/adminDashboard");
      } else if (data.role === "voter") {
        navigate("/dashboard");
      }
    } catch (error) {
      setError("Something went wrong. Please try again. " + error.message);
    }
  };


  return (
    <div className="ladingPageContainer grid  grid-cols-5 grid-rows-5 gap-1 h-screen">
      <div className="imagesContainer col-span-5 flex p-4 h-24 justify-between">
        <div>
          <img src={byteicon} alt="" className="h-10 md:h-20 sm:h-16 lg:h-20 2x1:h-20"/>
        </div>
        
        <div className="gap-1 ">
          
          <div className="flex gap-1">
            <img src={loyolaLogo} alt="" className="h-16 md:h-20 sm:h-20 lg:h-20 2x1:h-20 rounded-full"/>
            <img src={ByteLogo} alt="" className="h-16 md:h-20 sm:h-20 lg:h-20 2x1:h-20 rounded-full "/>
          </div>
          <img src={trojanICT} alt="" className="h-32 md:h-40 sm:h-40 lg:h-40 2x1:h-40 float-end p-2 "/>
        </div>
        
        
      </div>
      <div className="col-start-5 row-start-2">
        
      </div>
      <div className="col-span-3 row-span-4 col-start-2 row-start-2 flex flex-col justify-center items-center h-96">
      <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-80 mt-36 md:w-96 sm:w-96 lg:w-96 2xl:w-96">
        <h2 className="text-3xl font-extrabold text-center mb-6" >BYTEVote Login</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-gray-600">Username</label>
            <input 
              type="text" 
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter your username" 
            />
          </div>
          <div>
            <label className="block text-gray-600">Password</label>
            <input 
              type="password" 
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
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
              
      </div>
     
    </div>
  );
}

export default LoginForm;
