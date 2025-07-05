import React from "react";
import logo from "../assets/logo.svg";
import bookImg from "../assets/book_vector.svg";
import { useNavigate } from "react-router-dom";
import SplashCursor from "../Components/SplashCursor";

const Landing = () => {
  const Navigate = useNavigate();
  return (
    <div
      id="home"
      className="w-[100vw] min-h-[100vh] overflow-x-hidden overflow-y-scroll bg-[#e0e0e0] font-[poppins] select-none z-50"
    >
      <SplashCursor />
      {/* Navbar */}
      <div className="w-full h-[8vh] lg:h-[12vh] bg--300 flex items-center justify-between px-[4vw] lg:px-[4vw] ">
        <img className="w-[40vw] lg:w-[13vw] mr-0" src={logo} alt="logo" />
        <div className="hidden lg:flex flex-row neu-button gap-x-[1vw] ">
          <p
            className="relative inline-block text-sm
              before:absolute before:bottom-0 before:left-1/2 before:h-[1px] 
              before:w-0 before:bg-current before:transition-all 
              before:duration-300 before:ease-in-out 
              hover:before:w-full hover:before:left-0"
            onClick={() =>
              document
                .getElementById("home")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Home
          </p>
          <span className="text-sm">|</span>
          <p
            className="relative inline-block text-sm
              before:absolute before:bottom-0 before:left-1/2 before:h-[1px] 
              before:w-0 before:bg-current before:transition-all 
              before:duration-300 before:ease-in-out 
              hover:before:w-full hover:before:left-0"
            onClick={() =>
              document
                .getElementById("why-rentellect")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Why Rentellect?
          </p>
          <span className="text-sm">|</span>
          <p
            className="relative inline-block text-sm
              before:absolute before:bottom-0 before:left-1/2 before:h-[1px] 
              before:w-0 before:bg-current before:transition-all 
              before:duration-300 before:ease-in-out 
              hover:before:w-full hover:before:left-0"
            onClick={() =>
              document
                .getElementById("working")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            How does it work?
          </p>
        </div>
        <button
          onClick={() => Navigate("login")}
          className="neu-button-log text-sm font-[poppins] "
        >
          Login
        </button>
      </div>

      {/* Title */}
      <div className="w-[95%] h-[8vh] bg--400 mx-auto flex items-center justify-center lg:h-[30vh] lg:mt-[7vh] relative">
        <h1 className="font-[poppins] text-[15vw] lg:text-[16vw] font-black ">
          RENTELLECT
        </h1>
      </div>
      <div className="w-[90%] lg:w-[63%] px-4 py-1 h-[17.3vh] bg--400 ml-[2.5vw] lg:h-[28vh]">
        <h1 className="font-[poppins] text-[3.7vw] lg:text-2xl lg:leading-relaxed text-gray-900">
          Why buy when you can{" "}
          <span className="relative inline-block z-0">
            <span className="relative z-10">borrow</span>
            <span className="absolute inset-0 bg-pink-300 opacity-40 z-0 rounded-sm -skew-y-1"></span>
          </span>
          ? Share knowledge,{" "}
          <span className="relative inline-block z-0">
            <span className="relative z-10">save money</span>
            <span className="absolute inset-0 bg-green-300 opacity-30 z-0 rounded-sm -skew-y-1"></span>
          </span>
          , and{" "}
          <span className="relative inline-block z-0">
            <span className="relative z-10">reduce waste</span>
            <span className="absolute inset-0 bg-green-300 opacity-30 z-0 rounded-sm -skew-y-1"></span>
          </span>
          — all within your college network. <br />
          Join a{" "}
          <span className="relative inline-block z-0">
            <span className="relative z-10">smarter way to study</span>
            <span className="absolute inset-0 bg-blue-300 opacity-30 z-0 rounded-sm -skew-y-1"></span>
          </span>{" "}
          while taking a small step towards a{" "}
          <span className="relative inline-block z-0">
            <span className="relative z-10">greener planet</span>
            <span className="absolute inset-0 bg-emerald-300 opacity-30 z-0 rounded-sm -skew-y-1"></span>
          </span>
          .{" "}
          <span className="relative inline-block z-0 font-bold">
            <span className="relative z-10">Rent. Read. Return. Repeat.</span>
            <span className="absolute inset-0 bg-indigo-300 opacity-30 z-0 rounded-sm -skew-y-1"></span>
          </span>
        </h1>
      </div>
      <button
        onClick={() => Navigate("register")}
        className="ml-[5vw] lg:ml-[3vw] neu-button-log text-gray-800 font-semibold font-[poppins] "
      >
        Get Started
      </button>
      <div className="hidden sm:flex w-[5vw] h-[5vw] bg--400 mx-auto rounded-full  items-center justify-center mt-[4vh]">
        <i
          className="cursor-pointer ri-arrow-down-wide-line text-4xl text-gray-700"
          onClick={() =>
            document
              .getElementById("why-rentellect")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        ></i>
      </div>

      <div
        id="why-rentellect"
        className="w-[90%] lg:w-[95%] h-[5vh] lg:h-[17vh] mt-[2vh] lg:mt-[5vh] bg--400 mx-auto lg:px-4"
      >
        <h1 className="font-[poppins] text-[7.1vw] lg:text-[6vw] font-black text-zinc-950 ">
          Why Choose Rentellect?
        </h1>
      </div>
      <div className="w-[90%] h-auto lg:w-[95%] lg:h-[50vh] bg--400 mx-auto lg:mt-[1vh] lg:flex items-center justify-center gap-x-[1vw]">
        <div className="neu-button w-[100%] h-[22vh] mt-[0.5vh] mb-[1.3vh] lg:w-[38%] lg:h-[95%] font-[poppins]">
          <h1 className="lg:text-4xl text-3xl text-gradient font-semibold lg:font-bold px-2 pb-0 lg:pb-2 pt-3">
            AI-Powered Book Verification
          </h1>
          <h2 className="text-sm lg:text-lg px-2 py-1">
            Each uploaded image is analyzed by a trained machine learning model
            to predict the condition of the book. You get honest insights before
            renting—no guesswork, no scams.
          </h2>
        </div>
        <div className="neu-button w-[100%] h-[20vh] my-[1.3vh] lg:w-[29%] lg:h-[95%] font-[poppins]">
          <h1 className="lg:text-4xl text-3xl text-gradient font-semibold lg:font-bold px-2 pb-0 lg:pb-2 pt-3">
            Direct & Safe Borrowing
          </h1>
          <h2 className="text-sm lg:text-lg px-2 py-1">
            Connect directly with fellow students in your campus network. No
            middlemen, no unnecessary delays
          </h2>
        </div>
        <div className="neu-button w-[100%] h-[20vh] my-[1.3vh] lg:w-[29%] lg:h-[95%] font-[poppins]">
          <h1 className="lg:text-4xl text-3xl text-gradient font-semibold lg:font-bold px-2 pb-0 lg:pb-2 pt-3">
            Eco-Friendly & Budget-Smart
          </h1>
          <h2 className="text-sm lg:text-lg px-2 py-1">
            Cut costs and reduce waste by borrowing instead of buying. It’s a
            small step toward a greener campus.
          </h2>
        </div>
      </div>

      <div
        id="working"
        className="w-[90%] lg:w-[95%] h-[5vh] lg:h-[17vh] mt-[2vh] lg:mt-[5vh] bg--400 mx-auto lg:px-4"
      >
        <h1 className="font-[poppins] text-[7.1vw] lg:text-[6vw] font-black text-zinc-950 ">
          How does it work?
        </h1>
      </div>

      <div className="w-[90%] lg:w-[70%] h-auto bg--400 ml-[4vw] flex flex-col relative font-[poppins]">
        <div className="w-full lg:h-[45vh] bg--400 mt-[0.5vh] lg:mt-0 lg:flex items-center justify-center gap-x-[2vw]">
          <div className="hidden sm:flex w-[17vh] h-[17vh] rounded-full bg--400 items-center justify-center text-4xl neu-button-log">
            1
          </div>
          <div className="hidden sm:flex w-[10vw] h-[10%] bg--400 items-center justify-center">
            <h1 className="font-black text-lg">-------</h1>
          </div>
          <div className="lg:w-[35vw] h-[20vh] lg:h-[85%] bg--400 rounded-3xl neu-button-log flex justify-center flex-col">
            <h1 className="text-3xl font-semibold lg:font-bold lg:text-3xl px-4">List a Book :</h1>
            <h2 className="px-4 lg:pt-4 text-sm lg:text-base">
              Enter the book details and upload clear photos — our trained model
              will automatically predict and tag its condition (good, fair, or
              poor), saving your time.
            </h2>
          </div>
        </div>

        <div className="w-full lg:h-[45vh] bg--400 mt-[1.3vh] lg:mt-0 lg:flex items-center justify-center gap-x-[2vw]">
          <div className="hidden sm:flex w-[17vh] h-[17vh] rounded-full bg--400 items-center justify-center text-4xl neu-button-log">
            2
          </div>
          <div className="hidden sm:flex w-[10vw] h-[10%] bg--400 items-center justify-center">
            <h1 className="font-black text-lg">-------</h1>
          </div>
          <div className="lg:w-[35vw] h-[20vh] lg:h-[85%] bg--400 rounded-3xl neu-button-log flex justify-center flex-col">
            <h1 className="text-3xl font-semibold lg:font-bold lg:text-3xl px-4">Rent or Borrow :</h1>
            <h2 className="px-4 lg:pt-4 text-sm lg:text-base">
              Find a book you need and request the owner to rent it. You can
              directly chat with them for any questions, meetups, or
              clarifications.
            </h2>
          </div>
        </div>

        <div className="w-full lg:h-[45vh] bg--400 mt-[1.3vh] lg:mt-0 lg:flex items-center justify-center gap-x-[2vw]">
          <div className="hidden sm:flex w-[17vh] h-[17vh] rounded-full bg--400 items-center justify-center text-4xl neu-button-log">
            3
          </div>
          <div className="hidden sm:flex w-[10vw] h-[10%] bg--400 items-center justify-center">
            <h1 className="font-black text-lg">-------</h1>
          </div>
          <div className="lg:w-[35vw] h-[20vh] lg:h-[85%] bg--400 rounded-3xl neu-button-log flex justify-center flex-col">
            <h1 className="text-3xl font-semibold lg:font-bold lg:text-3xl px-4">
              Secure Payment via Razorpay :
            </h1>
            <h2 className="px-4 lg:pt-4 text-sm lg:text-base">
              Pay the rental amount securely through Razorpay Gateway with just
              a few clicks — quick, safe, and reliable.
            </h2>
          </div>
        </div>

        <img
          className="hidden sm:block absolute top-78 -right-166 opacity-90 scale-75"
          src={bookImg}
          alt=""
        />
        {/* <h1 className="font-[poppins] text-[20vw] absolute top-1 text-zinc-900 -right-48 font-black ">*</h1> */}
        <div
          className="hidden sm:flex absolute top-4 w-[20vw] h-[20vw] -right-65 flex-col items-center justify-center bg--400 pt-25"
          style={{
            animation: "spin 8s linear infinite",
            transformOrigin: "center",
          }}
        >
          <h1 className="font-[poppins] text-[20vw] font-black">*</h1>
        </div>
      </div>

      <div className="w-full lg:h-[35vh] bg-gray-900 mx-auto flex overflow-hidden mt-[3vh] lg:mt-[10vh] rounded-t-[70px] ">
        <div className="hidden sm:flex w-[65%] h-full bg--400  items-start justify-center flex-col pl-[6vw]">
          <h1 className="font-[poppins] text-[8vw] font-black text-[#e0e0e0]">
            RENTELLECT
          </h1>
          <h1 className="font-[poppins] text-[2vw] font-black text-[#e0e0e0] -mt-8">
            Peer to peer. Book to book. Deal to deal.
          </h1>
        </div>
        <div className="lg:w-[35vw] lg:h-[60%] mx-auto my-[5vh] lg:mt-[10vh] bg--500 flex font-[poppins] items-center justify-start lg:gap-x-[3vw] gap-x-[5vw]">
          <a target="blank" href="https://github.com/arjunx999/">
            <i class="ri-github-fill text-[4.5vw] lg:text-[3vw] text-[#e0e0e0] cursor-pointer"></i>
          </a>
          <a
            target="blank"
            href="https://www.linkedin.com/in/arjun-verma-5b4326292/"
          >
            <i class="ri-linkedin-fill text-[4.5vw] lg:text-[3vw] text-[#e0e0e0] cursor-pointer"></i>
          </a>
          <h1 className="text-[#e0e0e0] text-sm lg:text-base">
            Crafted with ❤️ <br />
            for all the bookworms out there.
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Landing;
