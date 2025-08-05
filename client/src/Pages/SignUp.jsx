import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SplashCursor from "../Components/SplashCursor";
import axios from "../api/axios"

const SignUp = () => {
  const Navigate = useNavigate();

  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const { name, email, password, college } = signupInfo;
    if (!name || !email || !password || !college) {
      return alert("Incomplete Credentials");
    }
    try {
      const response = await axios.post("/auth/signup", signupInfo);
      alert("SignUp successful. Please login to continue.");
      setTimeout(() => {
        Navigate("/login");
      }, 500);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("User already exists with this mail. Login to continue");
      } else {
        console.error("Error during sign-up:", error);
        alert("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] bg-[#e0e0e0] flex flex-col lg:flex-row z-50">
      {/* <SplashCursor /> */}
      <div className="w-full h-[70%] lg:w-[45%] lg:h-full bg--400 flex">
        <form
          onSubmit={handleSignup}
          action=""
          className="w-full h-full flex flex-col items-center justify-center gap-y-[2vh] font-[poppins]"
        >
          <input
            className="neu-input w-[70%] lg:w-[50%] "
            type="text"
            placeholder="name"
            required
            name="name"
            value={signupInfo.name}
            onChange={handleInputChange}
          />
          <input
            className="neu-input w-[70%] lg:w-[50%] "
            type="email"
            placeholder="email"
            required
            name="email"
            value={signupInfo.email}
            onChange={handleInputChange}
          />
          <div className="relative w-[70%] lg:w-[50%]">
            <input
              className="neu-input w-full pr-10"
              type={showPassword ? "text" : "password"}
              placeholder="password"
              required
              name="password"
              value={signupInfo.password}
              onChange={handleInputChange}
            />
            <i
              className="ri-eye-fill absolute right-4.5 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
              title={showPassword ? "Hide Password" : "Show Password"}
            ></i>
          </div>
          <input
            className="neu-input w-[70%] lg:w-[50%] "
            type="text"
            placeholder="college name"
            required
            name="college"
            value={signupInfo.college}
            onChange={handleInputChange}
          />
          <button
            className="neu-button-log font-semibold mt-3 lg:mt-1"
            type="submit"
          >
            Sign Up
          </button>
        </form>
      </div>
      <div className="w-full h-[30%] lg:w-[55%] lg:h-full bg--400 rounded-t-[120px] lg:rounded-l-[140px] lg:rounded-r-[0px] neu-box-s font-[poppins] flex flex-col items-center justify-center ">
        <h1 className="text-3xl lg:text-[4vw] mt-14 font-black text-zinc-700">
          Join Rentellect Today!
        </h1>
        <h2 className=" text-sm lg:text-lg lg:-mt-2">
          Already have an account? LogIn instead ..
        </h2>
        <button
          className="neu-button-log font-semibold mt-3 lg:mt-2"
          onClick={() => Navigate("/login")}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default SignUp;
