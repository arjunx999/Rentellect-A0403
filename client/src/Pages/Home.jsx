import React, { useEffect, useState } from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import axios, { all } from "axios";
import BookCard from "../Components/BookCard";

const Home = () => {
  const Navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = sessionStorage.getItem("user");
      const storedToken = sessionStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        // console.log(user)
        try {
          const collegesRes = await axios.get(
            "http://localhost:9999/colleges/",
            {
              headers: { Authorization: `Bearer ${storedToken}` },
            }
          );
          setColleges(collegesRes.data);
          // console.log(collegesRes.data);

          const booksRes = await axios.get("http://localhost:9999/book/", {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          setAllBooks(booksRes.data);
          setBooks(booksRes.data);
          // console.log(booksRes.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        setTimeout(() => {
          alert("Please login to access this page");
          Navigate("/login");
        }, 500);
      }
    };
    fetchData();
  }, [Navigate]);

  useEffect(() => {
    if (searchQuery === "") {
      setBooks(allBooks);
    }
  }, [searchQuery, allBooks]);

  useEffect(() => {
    const fetchBooksByCollege = async () => {
      if (selectedFilter && selectedFilter !== "all" && token) {
        try {
          const booksRes = await axios.get(
            `http://localhost:9999/book/get-by-college/${selectedFilter}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setBooks(booksRes.data);
          // console.log(booksRes.status)
        } catch (error) {
          if (error.response && error.response.status === 404) {
            alert("No books found for the selected college.");
            setSelectedFilter("all");
          } else {
            console.error("Error fetching books by college:", error);
          }
        }
      } else {
        // fallback to all books
        setBooks(allBooks);
      }
    };

    fetchBooksByCollege();
  }, [selectedFilter, token, allBooks]);

  if (!user)
    return (
      <div className="w-[100vw] h-[100vh] bg-[#e0e0e0] text-8xl font-black flex items-center justify-center font-[poppins]">
        Login to access
      </div>
    );

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      Navigate("/");
    }
  };

  const handleSearch = () => {
    const filtered = allBooks.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setBooks(filtered);
  };

  return (
    <div className="w-[100vw] min-h-[100vh] bg-[#e0e0e0] overflow-x-hidden overflow-y-auto relative">
      <div className="group fixed bottom-5 left-5 z-50">
        <button
          className="bg-[#e0e0e0]/80 backdrop-blur-md border-2 border-gray-900 px-2 lg:px-2.5 py-1 lg:py-1.5 rounded-full text-sm font-semibold font-[poppins] text-gradient btn hover:scale-110"
          onClick={handleLogout}
        >
          <i className="ri-logout-circle-line text-xl font-medium"></i>
        </button>
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Logout
        </div>
      </div>

      {/* Navbar */}
      <div className="w-full h-[8vh] lg:h-[12vh] bg--300 flex items-center justify-between px-[4vw] lg:px-[4vw] ">
        <img className="w-[40vw] lg:w-[13vw] mr-0" src={logo} alt="logo" />
        <div className="w- h-[80%] bg--400 flex items-center justify-center gap-x-3">
          <button className="chat-icon px-2 lg:px-2.5 py-1 lg:py-1.5 rounded-full text-sm font-semibold font-[poppins] text-gradient">
            <i className="ri-chat-1-line text-xl font-medium"></i>
          </button>
          <button
            onClick={() => Navigate("/list-book")}
            className="chat-icon px-2 lg:px-5 py-1 lg:py-2.5 rounded-full text-sm font-semibold font-[poppins] flex items-center gap-1 text-gradient"
          >
            <i className="ri-add-circle-line text-xl block lg:hidden"></i>

            <span className="hidden lg:inline">List a Book</span>
          </button>

          <button
            onClick={() => Navigate(`/admin/${user._id}`)}
            className="chat-icon px-2 lg:px-5 py-1 lg:py-2.5 rounded-full text-sm font-semibold font-[poppins] text-gradient"
          >
            <i className="ri-user-3-line text-xl block lg:hidden"></i>

            <span className="hidden lg:inline text-gradient">Dashboard</span>
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="w-[95%] h-[15vh] bg--400 mx-auto flex flex-col items-center justify-center lg:h-[32vh] lg:mt-[3.3vh] relative">
        <h1 className="font-[poppins] text-[6vw] lg:text-[6vw] font-black ">
          Affordable books. Zero hassle.
        </h1>
        <h1 className="font-[poppins] text-[5.5vw] -mt-[0.5vh] lg:-mt-[5vh] lg:text-[5.1vw] font-black ">
          All on your campus.
        </h1>
      </div>

      {/* Down Button */}
      <div className="hidden sm:flex w-[5vw] h-[5vw] bg--400 mx-auto rounded-full  items-center justify-center">
        <i
          className="cursor-pointer ri-arrow-down-wide-line text-4xl text-gray-700"
          onClick={() =>
            document
              .getElementById("head2")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        ></i>
      </div>

      {/* heaed2 */}
      <div
        className="w-[95%] h-[10vh] bg--600 mx-auto flex items-center justify-between px-3"
        id="head2"
      >
        {/* <h2 className="font-[poppins] text-3xl font-bold ">Top Shelf Reads</h2> */}
        <span className="relative inline-block z-0">
          <span className="font-[poppins] text-[5vw] lg:text-3xl font-semibold relative z-10">
            Top Shelf
            <br className="block lg:hidden" />
            <span className="hidden lg:inline"> </span>
            Reads
          </span>

          <span className="absolute inset-0 bg-green-300 opacity-40 z-0 rounded-sm -skew-y-1"></span>
        </span>
        <div className="w-[60%] lg:w-[30%] h-full bg--400 flex items-center gap-x-[1vw] justify-end">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className=" rounded-lg border text-[2.5vw] lg:text-xs w-[40%] h-[40%] lg:w-[36%] lg:h-[70%] font-[poppins] neu-drop text-center"
          >
            <option value="all">all colleges</option>
            {colleges?.map((college) => (
              <option key={college._id} value={college._id}>
                {college.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books by name..."
            className="lg:p-2 rounded-lg border w-[40%] lg:w-[60%] h-[45%] lg:h-[70%] text-xs neu-input font-[poppins] "
          />
          <button
            onClick={handleSearch}
            className="chat-icon px-2 lg:px-3 py-1.5 lg:py-2.5 rounded-full text-sm font-semibold font-[poppins] flex items-center gap-1 text-gradient"
          >
            <i className="ri-search-2-line text-gradient font-semibold "></i>
          </button>
        </div>
      </div>

      {/* Books */}
      <div className="w-[95%] min-h-[60vh] mt-[2vh] bg--300 mx-auto flex flex-wrap justify- gap-y-[3vh] justify-start gap-x-[1.33%]">
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>

      {/* Footer */}
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
            <i className="ri-github-fill text-[4.5vw] lg:text-[3vw] text-[#e0e0e0] cursor-pointer"></i>
          </a>
          <a
            target="blank"
            href="https://www.linkedin.com/in/arjun-verma-5b4326292/"
          >
            <i className="ri-linkedin-fill text-[4.5vw] lg:text-[3vw] text-[#e0e0e0] cursor-pointer"></i>
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

export default Home;
