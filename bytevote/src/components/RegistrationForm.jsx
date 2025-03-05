import React, {useState} from "react";
//dom routing
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  BrowserRouter,
  useNavigate,
} from "react-router-dom";
import LandingPageContent from "../components/LandingPageContent";
import LoginForm from "../components/LoginForm";
//images
import byteicon from "../assets/byte-icon.png";
import loyolaLogo from "../assets/loyola-shs-logo.png";
import ByteLogo from "../assets/Byte-net-logo.png";
import trojanICT from "../assets/trojan-ICT.png";
import Image1 from "../assets/userprofile/default_profile-f1.jpg";
console.log(Image1);
const RegistrationForm = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [lrn, setLrn] = useState("");
  const [gender, setGender] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Redirect function

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname, lastname, lrn, gender, username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Registration failed");
      } else {
        alert("Registration successful!");
        setInterval(() => {
          navigate("/login");
        }, 1000)
      }
    } catch (error) {
      alert("Something went wrong. Please try again." + error);
    }
  };
  return (
    <div className="ladingPageContainer grid  grid-cols-5 grid-rows-5 gap-1 h-screen">
      <div className="imagesContainer col-span-5 flex p-4 h-24 justify-between">
        <div>
          <img
            src={byteicon}
            alt=""
            className="h-10 md:h-20 sm:h-16 lg:h-20 2x1:h-20"
          />
        </div>
        <img src="../assets/userprofile/default_profile.jpg" alt="" />
        <div className="gap-1 ">
          <div className="flex gap-1">
            <img
              src={loyolaLogo}
              alt=""
              className="h-16 md:h-20 sm:h-20 lg:h-20 2x1:h-20 rounded-full"
            />
            <img
              src={ByteLogo}
              alt=""
              className="h-16 md:h-20 sm:h-20 lg:h-20 2x1:h-20 rounded-full "
            />
          </div>
          <img
            src={trojanICT}
            alt=""
            className="h-32 md:h-40 sm:h-40 lg:h-40 2x1:h-40 float-end p-2 "
          />
        </div>
      </div>
      <div className="col-start-5 row-start-2"></div>
      <div className="col-span-3 row-span-4 col-start-2 row-start-2 flex flex-col justify-center items-center h-96">
        <div className=" flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md w-80 h-140 mt-70 overflow-auto sm:h-160 sm:mt-40   md:w-96 sm:w-96 lg:w-96 lg:h-180 2xl:w-96 2xl:mt-20 2xl:h-170">
            <h2 className="text-3xl font-extrabold text-center mb-6">
              BYTEVote Register
            </h2>
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-600">
                  Firstname
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your firstname"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-600">
                  Lastname
                </label>
                <input
                  type="lastname"
                  name="lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your Last Name"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-600">
                  LRN
                </label>
                <input
                  type="number"
                  name="lrn"
                  value={lrn}
                  onChange={(e) => setLrn(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your LRN"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-600">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option disabled value="">
                    -- Select a gender --
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Prefere not to say</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-600">
                  Prefered Username
                </label>
                <input
                  type="text"
                  id="prefUsername"
                  name="prefUsername"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your prefered username"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-600">
                  Prefered Password
                </label>
                <input
                  type="text"
                  id="prefPassword"
                  name="prefPassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => navigate("/login")}
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="col-span-5 row-start-5 bg-amber-900 ">
        this is footer
        </div> */}
    </div>
  );
};

export default RegistrationForm;
