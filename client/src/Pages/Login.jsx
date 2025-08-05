import React from "react";
import { useNavigate } from "react-router-dom";
import SplashCursor from "../Components/SplashCursor";
import { useState } from "react";
import axios from "../api/axios";

const Login = () => {
  const Navigate = useNavigate();

  const [loginInfo, setLoginInfo] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = loginInfo;
    if (!email || !password) {
      return alert("Incomplete Credentials");
    }
    try {
      const response = await axios.post("/auth/login", loginInfo);

      const { success, token, user, message } = response.data;

      if (success) {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));
        alert("Login successful!");
        setTimeout(() => {
          Navigate("/home");
        }, 500);
      } else {
        alert(message || "Log-in failed. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        const { status } = error.response;

        if (status === 404) {
          alert("User does not exist. Signup to continue");
        } else if (status === 400) {
          alert("Incorrect password");
        } else {
          alert("Login failed. Please try again.");
        }
      } else {
        console.error("Error during login:", error);
        alert("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] bg-[#e0e0e0] flex flex-col lg:flex-row z-50">
      {/* <SplashCursor /> */}
      <div className="w-full h-[30%] lg:w-[55%] lg:h-full bg--400 rounded-b-[120px] lg:rounded-l-[0px] lg:rounded-r-[140px] neu-box-l font-[poppins] flex flex-col items-center justify-center bg-red-400 ">
        <h1 className="text-3xl lg:text-[4vw] mt-14 font-black text-zinc-700">
          Glad to see you again!
        </h1>
        <h2 className=" text-sm lg:text-lg lg:mt-1">
          Don't have an account? SignUp instead ..
        </h2>
        <button
          className="neu-button-log font-semibold mt-3 lg:mt-"
          onClick={() => Navigate("/register")}
        >
          Signup
        </button>
      </div>
      <div className="w-full h-[70%] lg:w-[45%] lg:h-full bg--400 flex">
        <form
          action=""
          onSubmit={handleLogin}
          className="w-full h-full flex flex-col items-center justify-center gap-y-[2vh] font-[poppins]"
        >
          <input
            className="neu-input w-[70%] lg:w-[50%] "
            type="email"
            placeholder="email"
            required
            name="email"
            value={loginInfo.email}
            onChange={handleInputChange}
          />
          <div className="relative w-[70%] lg:w-[50%]">
            <input
              className="neu-input w-full pr-10"
              type={showPassword ? "text" : "password"}
              placeholder="password"
              required
              name="password"
              value={loginInfo.password}
              onChange={handleInputChange}
            />
            <i
              className="ri-eye-fill absolute right-4.5 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
              title={showPassword ? "Hide Password" : "Show Password"}
            ></i>
          </div>
          <button
            className="neu-button-log font-semibold mt-3 lg:mt-1"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
