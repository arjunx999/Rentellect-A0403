import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { useState, useEffect } from "react";
import { useRef } from "react";
import axios from "../api/axios";
import socket from "../socket";

const Admin = () => {
  const Navigate = useNavigate();
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const [totalListed, setTotalListed] = useState();
  const [totalListedBooks, setTotalListedBooks] = useState([]);
  const [totalRented, setTotalRented] = useState();
  const [totalRentedBooks, setTotalRentedBooks] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalRentedOut, setTotalRentedOut] = useState(0);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);

  const [chatBox, setChatBox] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedChatUser, setSelectedChatUser] = useState(null);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (user?._id) {
      socket.emit("user-connected", user._id);
    }
  }, [user, chatBox]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (text.trim().length < 1 || !selectedChatUser) return;

    const newMsg = {
      receiverId: selectedChatUser._id,
      content: text,
      senderId: user._id,
    };

    socket.emit("send-message", newMsg);
    setMessages((prev) => [...prev, { ...newMsg, sender: user._id }]);
    setText("");
  };

  useEffect(() => {
    const FetchMessages = async () => {
      try {
        if (!selectedChatUser?._id) return;
        const token = sessionStorage.getItem("token");
        const res = await axios.get(
          `/messages/get-messages/${selectedChatUser._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(res.data);
      } catch (error) {
        console.log("error loading messages: ", error);
      }
    };

    if (chatBox && selectedChatUser) {
      FetchMessages();
    }
  }, [chatBox, selectedChatUser]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg) => {
      if (
        selectedChatUser &&
        (msg.sender === selectedChatUser._id ||
          msg.receiver === selectedChatUser._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [selectedChatUser, socket]);

  const fetchUserDetails = async () => {
    try {
      const storedUser = sessionStorage.getItem("user");
      const storedToken = sessionStorage.getItem("token");

      if (!storedUser || !storedToken) return;

      const parsedUser = JSON.parse(storedUser);
      const res = await axios.get(`/user/${parsedUser._id}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      const userData = res.data;
      setUser(userData);
      setToken(storedToken);

      setTotalListed(userData.listed_books?.length || 0);
      setTotalListedBooks(userData.listed_books || []);

      setTotalRented(userData.rented_books?.length || 0);
      setTotalRentedBooks(userData.rented_books || []);

      setTotalRevenue(userData.totalRevenue || 0);

      const rentedOutBooks = userData.listed_books.filter(
        (book) => book.isRented === true
      );
      setTotalRentedOut(rentedOutBooks.length);

      sessionStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [Navigate]);

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      Navigate("/");
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this book?"
      );
      if (!confirmed) return;

      const res = await axios.delete(`/book/delete-listing/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 404) {
        alert("Error deleting book");
      }

      if (res.status === 200) {
        alert("Book deleted successfully!");
        // console.log(res);

        fetchUserDetails();
      }
    } catch (error) {
      alert("Error! Please check console.");
      console.log("error deleting book: ", error);
    }
  };

  const handleBookReturn = async (id) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you have received the Book?"
      );
      if (!confirmed) return;

      const res = await axios.patch(
        `/book/return-book/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 404) {
        alert("Error deleting book");
      }

      if (res.status === 200) {
        alert("Book re-listed successfully!");
        // console.log(res);

        fetchUserDetails();
      }
    } catch (error) {
      alert("Error! Please check console.");
      console.log("error deleting book: ", error);
    }
  };

  return (
    <div className="w-[100vw] min-h-[100vh] h-auto bg-[#e0e0e0] overflow-x-hidden overflow-y-scroll relative">
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
            onClick={() => Navigate(`/home`)}
            className="chat-icon px-2 lg:px-5 py-1 lg:py-2.5 rounded-full text-sm font-semibold font-[poppins] text-gradient"
          >
            <i className="ri-user-3-line text-xl block lg:hidden"></i>

            <span className="hidden lg:inline text-gradient">Home</span>
          </button>
          <button
            onClick={() => Navigate("/list-book")}
            className="chat-icon px-2 lg:px-5 py-1 lg:py-2.5 rounded-full text-sm font-semibold font-[poppins] flex items-center gap-1 text-gradient"
          >
            <i className="ri-add-circle-line text-xl block lg:hidden"></i>

            <span className="hidden lg:inline">List new Book</span>
          </button>
        </div>
      </div>

      <div className="w-full min-h-[92vh] h-auto flex bg--400 relative">
        <div className="hidden sm:block w-[21%] h-full bg--300 border--[1.5px] border-gray-800 lg:flex justify-center items-start mt-[2vh] pl-[2vw] flex-col gap-y-[3vh]">
          <div className="w-[100%] h-[36vh] rounded-4xl chat-icon flex flex-col items-center pt-[5vh] gap-y-[0.5vh]">
            <div className="w-[5.5vw] h-[5.5vw] bg-zinc-300 rounded-full mb-1 flex items-center justify-center text-4xl font-[poppins]">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {user && (
              <>
                <h1>{user.name}</h1>
                <h1>{user.email}</h1>
                <h1 className="capitalize">📍{user.college.name}</h1>
              </>
            )}
          </div>
          <div className="w-[100%] h-[25vh] chat-icon rounded-4xl bg--700 flex flex-col items-center font-[poppins] gap-y-2 justify-center">
            <h1 className="text-2xl">Active Rentals</h1>
            <span className="text-lg -mt-2">(taken)</span>
            <h1 className="text-3xl">
              <i className="ri-store-3-line mr-2"></i>
              {user && totalRented}
            </h1>
          </div>
        </div>

        <div className="w-[79%] h-auto bg--300 pt-[1vh] pb-[5vh] flex flex-col items-center overflow-y-scroll">
          <div className="w-[95%] h-[25vh] bg--700 flex items-center justify-center gap-x-[2vw]">
            <div className="w-[31%] h-[92%] chat-icon rounded-4xl bg--700 flex flex-col items-center pt-8 font-[poppins] gap-y-2">
              <h1 className="text-2xl">Total Books Listed</h1>
              <h1 className="text-3xl">{user && totalListed}</h1>
            </div>
            <div className="w-[31%] h-[92%] chat-icon rounded-4xl bg--700 flex flex-col items-center pt-8 font-[poppins] gap-y-2">
              <h1 className="text-2xl">
                Active Rentals <span className="text-lg">(given)</span>
              </h1>
              <h1 className="text-3xl">
                <i className="ri-store-3-line mr-2"></i>
                {user && totalRentedOut}
              </h1>
            </div>
            <div className="w-[31%] h-[92%] chat-icon rounded-4xl bg--700 flex flex-col items-center pt-8 font-[poppins] gap-y-2">
              <h1 className="text-2xl">Total Revenue</h1>
              <h1 className="text-3xl">₹{user && totalRevenue}</h1>
            </div>
          </div>

          {chatBox ? (
            <div className="w-[75%] lg:w-[93%] mt-2 h-[100%] text-xs lg:text-sm lg:h-[70vh] bg--700 border-gray-600 overflow-hidden border-[1.5px] rounded-4xl font-[poppins] flex flex-col">
              <div className="w-full h-[10%] bg--400 border-b-[1.5px] border-gray-600 flex justify-between items-center px-7">
                <h1 className="capitalize font-[poppins] text-zinc-900 ">
                  {selectedChatUser?.name}{" "}
                </h1>
                <i
                  onClick={() => setChatBox(false)}
                  className="cursor-pointer ri-close-line text-xl font-bold"
                ></i>
              </div>
              <div
                className="w-full h-[80%] bg--400 overflow-y-auto p-4 flex flex-col gap-2"
                ref={chatContainerRef}
              >
                {messages.length === 0 && (
                  <div className="text-center text-zinc-400">
                    No messages yet.
                  </div>
                )}
                {messages.map((msg, idx) => {
                  const fromOther =
                    msg.senderId === selectedChatUser?._id ||
                    msg.sender === selectedChatUser?._id;
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
                        } text-base`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              <form
                className="w-full h-[10%] bg--400 border-t-[1.5px] border-gray-600 flex justify-between"
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
                <button type="submit">
                  <i className="ri-send-plane-2-line mx-auto my-auto text-lg chat-icon rounded-full px-2 py-2 mr-3"></i>
                </button>
              </form>
            </div>
          ) : (
            <>
              <div className="w-[95%] min-h-[35vh] h-auto bg--700 rounded-4xl chat-icon flex flex-col gap-x-[2vw] mt-[2.5vh] p-7 font-[poppins]">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  My Listings:
                </h2>
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-600">
                      <th className="py-2">Name</th>
                      <th className="py-2">Condition</th>
                      <th className="py-2">Price</th>
                      <th className="py-2">Tenant</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Duration</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user &&
                      totalListedBooks.map((book) => (
                        <tr key={book._id} className="border-t border-gray-300">
                          <td className="py-2">{book.title}</td>
                          <td className="py-2">{book.condition}</td>
                          <td className="py-2">₹{book.price}</td>
                          <td className="py-2">
                            {book.isRented ? book.tenant.name : "Null"}
                          </td>
                          <td className="py-2">
                            {book.isRented ? "Rented" : "Available"}
                          </td>
                          <td className="py-2">{book.rental_time} Days</td>
                          <td className="py-2 cursor-pointer text-lg flex gap-3">
                            {book.isRented && (
                              <div className="relative group inline-block">
                                <i
                                  onClick={() => {
                                    setSelectedChatUser(book.tenant);
                                    setChatBox(true);
                                  }}
                                  className="ri-chat-1-line text-xl text-gradient"
                                ></i>
                                <div
                                  className="absolute -top-5 left-1/2 -translate-x-1/2 
                            bg-gray-900 text-white text-xs px-2 py-1 rounded 
                            opacity-0 group-hover:opacity-100 
                            transition-opacity duration-300 whitespace-nowrap"
                                >
                                  Contact Tenant
                                </div>
                              </div>
                            )}

                            {!book.isRented && (
                              <div className="relative group inline-block">
                                <i
                                  onClick={() => {
                                    handleDeleteBook(book._id);
                                  }}
                                  className="ri-delete-bin-5-line text-red-600"
                                ></i>
                                <div
                                  className="absolute -top-5 left-1/2 -translate-x-1/2 
                            bg-gray-900 text-white text-xs px-2 py-1 rounded 
                            opacity-0 group-hover:opacity-100 
                            transition-opacity duration-300 whitespace-nowrap"
                                >
                                  Delete Listing
                                </div>
                              </div>
                            )}

                            {book.isRented && (
                              <div className="relative group inline-block">
                                <i
                                  onClick={() => {
                                    setSelectedBookId(book._id);
                                    setShowReturnModal(true);
                                  }}
                                  className="ri-checkbox-circle-line text-xl text-blue-600 cursor-pointer"
                                />

                                <div
                                  className="absolute -top-5 left-1/2 -translate-x-1/2 
                            bg-gray-900 text-white text-xs px-2 py-1 rounded 
                            opacity-0 group-hover:opacity-100 
                            transition-opacity duration-300 whitespace-nowrap"
                                >
                                  Complete Return
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="w-[95%] min-h-[35vh] h-auto bg--700 rounded-4xl chat-icon flex flex-col gap-x-[2vw] mt-[2.5vh] p-7 font-[poppins]">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  My Rentals:
                </h2>
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-600">
                      <th className="py-2">Name</th>
                      <th className="py-2">Owner</th>
                      <th className="py-2">Location</th>
                      <th className="py-2">Rented At</th>
                      <th className="py-2">Duration</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user &&
                      totalRentedBooks.map((book) => (
                        <tr key={book._id} className="border-t border-gray-300">
                          <td className="py-2">{book.title}</td>
                          <td className="py-2">{book.owner.name}</td>
                          <td className="py-2">{book.college.name}</td>
                          <td className="py-2">
                            {new Date(book.rentedAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td className="py-2">{book.rental_time} Days</td>
                          <td className="py-2 text-xl cursor-pointer">
                            <div className="relative group inline-block">
                              <i
                                onClick={() => {
                                  setSelectedChatUser(book.owner);
                                  setChatBox(true);
                                }}
                                className="ri-chat-1-line text-xl text-gradient"
                              ></i>
                              <div
                                className="absolute -top-5 left-1/2 -translate-x-1/2 
                          bg-gray-900 text-white text-xs px-2 py-1 rounded 
                          opacity-0 group-hover:opacity-100 
                          transition-opacity duration-300 whitespace-nowrap"
                              >
                                Contact Owner
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="w-full lg:h-[35vh] bg-gray-900 mx-auto flex overflow-hidden mt-[3vh] lg:mt-[1vh] rounded-t-[70px] ">
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

      {showReturnModal && (
        <div className="fixed inset-0 bg--500 font-[poppins] backdrop-blur-[5px] flex items-center justify-center z-50">
          <div className="neu-box-l h-[40vh] flex flex-col items-center justify-center rounded-xl p-[5vh] shadow-lg w-[90vw] max-w-md text-center relative">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 mt-5">
              What would you like to do with this book?
            </h2>

            <div className="font-semibold flex justify-center gap-4 mt-3">
              <button
                onClick={() => {
                  handleBookReturn(selectedBookId);
                  setShowReturnModal(false);
                }}
                className="text-gradient px-4 py-2 rounded neu-button-log"
              >
                Relist Book
              </button>
              <button
                onClick={() => {
                  handleDeleteBook(selectedBookId);
                  setShowReturnModal(false);
                }}
                className="px-4 py-2 rounded neu-button-log "
              >
                <h1 className="text-red-700">Delete Book</h1>
              </button>
            </div>

            <button
              onClick={() => setShowReturnModal(false)}
              className="font-black text-2xl cursor-pointer text-gray-600 hover:text-gray-800 absolute top-3 right-3"
            >
              <i class="ri-close-fill"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
