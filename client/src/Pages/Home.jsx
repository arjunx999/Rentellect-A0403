import React, { useEffect, useState } from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
// import axios, { all } from "axios";
import axios from "../api/axios";
import BookCard from "../Components/BookCard";
import socket from "../socket";
import { useRef } from "react";

const Home = () => {
  const Navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [chatBox, setChatBox] = useState(false);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [recentChats, setRecentChats] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = sessionStorage.getItem("user");
      const storedToken = sessionStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        // console.log(user)
        try {
          const collegesRes = await axios.get("/colleges", {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          setColleges(collegesRes.data);
          // console.log(collegesRes.data);

          const booksRes = await axios.get("/book", {
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
            `book/get-by-college/${selectedFilter}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setBooks(booksRes.data);
          console.log(booksRes.data);
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

  useEffect(() => {
    if (!token || users.length > 0) return;
    const fetchAllusers = async () => {
      try {
        if (token) {
          const res = await axios.get("/user/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          // console.log(res.data);
          setUsers(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllusers();
  }, [chatBox]);

  useEffect(() => {
    if (query.trim() === "") {
      setFilteredUsers([]);
    } else {
      setFilteredUsers(
        users.filter(
          (u) =>
            u._id !== user._id &&
            u.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  }, [query, users, user]);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (text.trim().length < 1) return;

    const userId = selectedUser._id || selectedUser.id;
    const newMsg = {
      receiverId: userId,
      content: text,
      senderId: user._id,
    };

    socket.emit("send-message", newMsg);
    setMessages((prev) => [...prev, { ...newMsg, sender: user._id }]);
    setText("");
  };

  useEffect(() => {
    if (user?._id) {
      socket.emit("user-connected", user._id);
    }
  }, [user, chatBox]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg) => {
      if (
        selectedUser &&
        (msg.senderId === selectedUser._id ||
          msg.receiverId === selectedUser._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [selectedUser, socket]);

  useEffect(() => {
    if (!selectedUser || !token) return;
    const userId = selectedUser._id || selectedUser.id;

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const res = await axios.get(`/messages/get-messages/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedUser, token]);

  useEffect(() => {
    if (!token || !user) {
      return;
    }
    const fetchUserConversations = async () => {
      try {
        const res = await axios.get(`user/getConversations/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // console.log(res.data);
        setRecentChats(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserConversations();
  }, [user, chatBox, token]);

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
          <button
            className="chat-icon px-2 lg:px-2.5 py-1 lg:py-1.5 rounded-full text-sm font-semibold font-[poppins] text-gradient"
            onClick={() => setChatBox(!chatBox)}
          >
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

      {chatBox && (
        <div className="h-[88vh] absolute w-[90vw] lg:w-[55vw] chat-icon2 top-[11vh] right-[4vw] z-50 rounded-4xl flex overflow-hidden bg-[#e0e0e0] text-xs lg:text-sm">
          <div className="w-[35%] h-full bg--500 border-r-[0.1rem] border-gray-600 flex flex-col">
            <div className="w-full h-[10%] bg--300 border-b-[1.5px]">
              <div className="relative w-full px-3 py-2">
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2  text-sm font-[poppins] rounded-lg focus:outline-none focus:ring-0"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <i className="ri-search-2-line absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500"></i>

                {/* Dropdown */}
                {filteredUsers.length > 0 && (
                  <ul className="absolute z-20 mt-1 w-[90%] left-1/2 -translate-x-1/2 bg-[#e0e0e0] neu-drop rounded-lg shadow-lg max-h-48 overflow-y-auto text-sm">
                    {filteredUsers.map((u) => (
                      <li
                        key={u._id}
                        className="px-4 py-2 cursor-pointer hover:bg-indigo-200 transition"
                        onClick={() => {
                          setQuery(u.name);
                          setSelectedUser(u);
                          setFilteredUsers([]);
                        }}
                      >
                        {u.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="w-full h-[90%] bg--300 overflow-x-hidden overflow-y-scroll flex flex-col">
              {recentChats.length === 0 && (
                <div className="text-center text-zinc-400 my-auto">
                  No recent chats.
                </div>
              )}
              {recentChats.map((chat, index) => (
                <div
                  onClick={() => {
                    // setMessages([]);
                    setSelectedUser(chat);
                  }}
                  key={index}
                  className="w-full h-[8vh] bg--300 font-[poppins] cursor-pointer hover:bg-indigo-200 border-b-[1.3px] flex items-center justify-start pl-5"
                >
                  {chat.name}
                </div>
              ))}
            </div>
          </div>
          <div className="w-[65%] h-full bg--500 flex flex-col">
            <div className="w-full h-[10%] bg--300 border-b-[1.5px] flex justify-between items-center px-5">
              <h1 className="capitalize font-[poppins] text-zinc-900 ">
                {selectedUser
                  ? selectedUser.name
                  : "Select a user to start texting"}{" "}
              </h1>
            </div>
            <div
              className="w-full h-[80%] bg--300 border-b-[1.5px] overflow-x-hidden overflow-y-auto p-4 flex flex-col gap-2"
              ref={chatContainerRef}
            >
              {loadingMessages && (
                <div className="text-center text-zinc-400 my-auto">
                  Loading...
                </div>
              )}
              {messages.length === 0 && (
                <div className="text-center text-zinc-400 my-auto">
                  No messages yet.
                </div>
              )}
              {messages.map((msg, idx) => {
                const fromOwner =
                  msg.senderId === selectedUser._id ||
                  msg.sender === selectedUser._id;
                const fromUser =
                  msg.senderId === user._id || msg.sender === user._id;
                return (
                  <div
                    key={idx}
                    className={`flex ${
                      fromUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`chat-icon2 max-w-[70%] px-4 py-2 rounded-lg shadow-sm ${
                        fromUser
                          ? "rounded-br-2xl rounded-tr-2xl"
                          : "rounded-bl-2xl rounded-tl-2xl"
                      }text-base`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              {/* <div ref={messagesEndRef} /> */}
            </div>
            <form
              className="w-full h-[10%] bg--400 flex justify-between"
              onSubmit={handleSendMessage}
            >
              <div className="w-[88%] h-full bg--400">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full h-full pl-7 focus:outline-none focus:ring-0"
                  placeholder="start typing your message here"
                />
              </div>
              {/* <div className="w-[15%] h-full bg--400 border-l-[1.5px] border-gray-600"></div> */}
              <button type="submit">
                <i className="ri-send-plane-2-line mx-auto my-auto text-lg chat-icon rounded-full px-2 py-2 mr-3"></i>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Title */}
      <div
        className="w-[95%] h-[15vh] bg--400 mx-auto flex flex-col items-center justify-center lg:h-[32vh] lg:mt-[3.3vh] relative"
        onClick={() => setChatBox(false)}
      >
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
