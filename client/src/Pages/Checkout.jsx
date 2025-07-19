import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const Navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [book, setBook] = useState(null);

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

  const handlePaymentInitiation = async () => {
    try {
      const response = await axios.post(
        "http://localhost:9999/book/initiate-payment",
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
            "http://localhost:9999/book/verify-payment",
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

  return (
    <div className="w-[100vw] h-[100vh] bg-[#e0e0e0] relative flex items-center justify-center p-[7vw]">
      <div
        onClick={() => Navigate(-1)}
        className=" absolute left-[4vh] top-[4vh] flex items-center gap-x-[4vw] lg:gap-x-[3vw]"
      >
        {" "}
        <i className="chat-icon ri-close-line text-xl font-bold  rounded-full py-2 px-3"></i>
        <h1 className="font-[poppins] font-semibold text-2xl text-[#4d4d4d]">
          Checkout:
        </h1>
      </div>
      <div className="w-full h-full bg-violet-300 flex">
        <div className="w-[60%] h-full bg-red-300">
          <h1>Order Summary:</h1>
          <hr />
          <div className="w-full h-[40%] bg-pink-400"></div>
        </div>
        <div className="w-[40%] h-full bg-amber-300">
          <button className="border-2 p-3" onClick={handlePaymentInitiation}>
            Pay Rent
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
