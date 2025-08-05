import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import { useParams } from "react-router-dom";
import axios from "../api/axios";

const ViewBook = () => {
  const Navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [book, setBook] = useState(null);
  const { id } = useParams();

  const [chatBox, setChatBox] = useState(false);

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
          const bookinfo = await axios.get(`/book/${id}`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          setBook(bookinfo.data);
          // console.log(bookinfo.data);
        } catch (error) {
          if (error.response && error.response.status === 423) {
            alert(
              error.response.data.message || "Book transaction in process."
            );
            Navigate(-1);
          } else if (error.response && error.response.status === 404) {
            alert("Book not found");
            Navigate(-1);
          } else {
            alert("An unexpected error occurred. Please check the console.");
            console.error("Error fetching book:", error);
          }
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

  const handlePaymentInitiation = async () => {
    try {
      const response = await axios.post(
        "/book/initiate-payment",
        {
          amount: book.amount,
          bookId: id,
          tenantId: user._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { order } = response.data;
      console.log("Payment initiated:", order);

      const options = {
        key: "rzp_test_8aUEbFky0uBSqT",
        amount: order.amount,
        currency: order.currency,
        name: "Rentellect",
        description: "Book Rent Payment",
        order_id: order.id,
        handler: async function (response) {
          console.log("Payment successful:", response);

          // Send payment verification data to server (optional but recommended)
          await axios.post(
            "/book/verify-payment",
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              bookId: id,
              tenantId: user._id,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          alert("Payment successful! Happy Reading!");
          Navigate("/home");
        },
        prefill: {
          name: user.username,
          email: user.email,
        },
        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };

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

      {chatBox ? (
        <div className="w-[75%] lg:w-[50%] h-[80%] bg--700 border-gray-600 overflow-hidden border-[1.5px] rounded-4xl font-[poppins] flex flex-col">
          <div className="w-full h-[10%] bg--400 border-b-[1.5px] border-gray-600 flex justify-between items-center px-7">
            <h1 className="capitalize font-[poppins] text-zinc-900 ">
              {book.owner.name} <span>( {book.college.name} )</span>
            </h1>
            <i
              onClick={() => setChatBox(false)}
              className="cursor-pointer ri-close-line text-xl font-bold"
            ></i>
          </div>
          <div className="w-full h-[80%] bg--400"></div>
          <form className="w-full h-[10%] bg--400 border-t-[1.5px] border-gray-600 flex justify-between">
            <div className="w-[88%] h-full bg--400">
              <input
                type="text"
                className="w-full h-full pl-7 focus:outline-none focus:ring-0"
                placeholder="start typing your message here"
              />
            </div>
            {/* <div className="w-[15%] h-full bg--400 border-l-[1.5px] border-gray-600"></div> */}
            <button type="submit">
              <i class="ri-send-plane-2-line mx-auto my-auto text-lg chat-icon rounded-full px-2 py-2 mr-3"></i>
            </button>
          </form>
        </div>
      ) : (
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
            Condition:{" "}
            <span className={`${getBgColor()}`}>{book.condition}</span>
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
            <button
              onClick={() => setChatBox(true)}
              className="chat-icon px-[5vw] py-[1.5vh] rounded-3xl text-lg font-bold"
            >
              Text Owner
            </button>
            <button
              // onClick={() => Navigate(`/checkout/${book._id}`)}
              onClick={() => {
                if (user._id === book.owner._id) {
                  alert("You cannot rent your own book.");
                  return;
                }

                const confirmProceed = window.confirm(
                  "Are you sure you want to proceed?\n\nThis action cannot be reversed once payment is successful."
                );
                if (confirmProceed) {
                  handlePaymentInitiation();
                }
              }}
              className="chat-icon px-[5vw] py-[1.5vh] text-gradient rounded-3xl text-lg font-bold"
            >
              Pay Rent
            </button>
          </div>
        </div>
      )}
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
