import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";

const ViewBook = () => {
  const Navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [book, setBook] = useState(null);
  const { id } = useParams();

  const [currentIndex, setCurrentIndex] = useState(0);
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? book.photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === book.photos.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = sessionStorage.getItem("user");
      const storedToken = sessionStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        try {
          const bookinfo = await axios.get(`http://localhost:9999/book/${id}`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          setBook(bookinfo.data);
          // console.log(bookinfo.data);
        } catch (error) {
          alert("Error: Please check console");
          console.error("Error fetching book:", error);
        }
      } else {
        setTimeout(() => {
          alert("Please login to access this page");
          Navigate("/login");
        }, 500);
      }
    };
    fetchData();
  }, [id, Navigate]);
  if (!user)
    return (
      <div className="w-[100vw] h-[100vh] bg-[#e0e0e0] text-8xl font-black flex items-center justify-center font-[poppins]">
        Login to access
      </div>
    );

  const getBgColor = () => {
    if (book.condition === "Good") return "text-green-600";
    if (book.condition === "Fair") return "text-amber-600";
    if (book.condition === "Poor") return "text-red-500";
    return "text-gray-500";
  };
  return book ? (
    <div className="w-[100vw] h-[100vh] bg-[#e0e0e0] relative flex flex-col lg:flex-row items-center justify-center px-[5vw]">
      <div
        onClick={() => Navigate(-1)}
        className="absolute left-[4vh] top-[4vh] flex items-center gap-x-[4vw] lg:gap-x-[5vw]"
      >
        <i className="chat-icon ri-close-line text-xl font-bold rounded-full py-2 px-3"></i>
      </div>

      <div className="w-[75%] lg:w-[50%] h-[80%] relative mt-15 lg:mt-0 lg:p-[1vw] flex items-center justify-center overflow-auto rounded-[1rem]">
        <img
          src={book.photos?.[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="object-contain max-w-full max-h-full"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/40 hover:bg-white/70 rounded-full p-1 chat-icon"
        >
          <i className="ri-arrow-left-s-line text-2xl"></i>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/30 hover:bg-white/70 rounded-full p-1 chat-icon"
        >
          <i className="ri-arrow-right-s-line text-2xl"></i>
        </button>
      </div>

      <div className="w-[75%] lg:w-[50%] h-[80%] bg--700 -[1px] p-[1vw] font-[poppins]">
        <h1 className="text-[3vw] font-semibold leading-11 text-gray-900 capitalize">
          {book.title}
        </h1>
        <h1 className="text-xl mt-3 border-t-1 border-black pt-3 text-left font-semibold text-gray-800">
          Author: {book.author}
        </h1>
        <h1 className="w-[50%] text-lg mt-1 font-semibold text-gray-600">
          ISBN: {book.isbn}
        </h1>
        <h1 className="mt-2 text-3xl font-black text-emerald-500">
          ₹{book.price}
        </h1>
        <h1 className="mt-2 text-xl font-bold text-zinc-800">
          Condition: <span className={`${getBgColor()}`}>{book.condition}</span>
        </h1>
        <h1 className="mt-1 text-lg font-semibold text-zinc-700">
          Rental Period: {book.rental_time} days
        </h1>
        <h1 className="mt-1 text-lg font-semibold text-zinc-700 capitalize">
          Location: {book.college.name}
        </h1>
        <h1 className="text-lg font-semibold text-zinc-700 ">
          Owner: {book.owner.name}
        </h1>
        <h1 className="text-lg font-semibold text-zinc-700 ">
          Listed on:{" "}
          {book.createdAt &&
            new Date(book.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
        </h1>
        <div className="flex mt-2 gap-3">
          <button className="chat-icon px-[5vw] py-[1.5vh] rounded-3xl text-lg font-bold">
            Text Owner
          </button>
          <button className="chat-icon px-[5vw] py-[1.5vh] text-gradient rounded-3xl text-lg font-bold">
            Rent Now
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="w-[100vw] h-[100vh] bg-[#e0e0e0] flex items-center justify-center">
      <div className="text-xl font-semibold animate-pulse text-zinc-700 font-[poppins]">
        Loading book details...
      </div>
    </div>
  );
};

export default ViewBook;
