import React from "react";
import { useNavigate } from "react-router-dom";
import SplashCursor from "../Components/SplashCursor";

const Login = () => {
  const Navigate = useNavigate();
  return (
    <div className="w-[100vw] h-[100vh] bg-[#e0e0e0] flex flex-col lg:flex-row z-50">
      <SplashCursor />
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
          className="w-full h-full flex flex-col items-center justify-center gap-y-[2vh] font-[poppins]"
        >
          <input
            className="neu-input w-[70%] lg:w-[50%] "
            type="text"
            placeholder="email"
          />
          <input
            className="neu-input w-[70%] lg:w-[50%] "
            type="text"
            placeholder="password"
          />
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
