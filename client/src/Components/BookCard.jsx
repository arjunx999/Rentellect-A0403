import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BookCard = ({ book }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const Navigate = useNavigate();
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? book.photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === book.photos.length - 1 ? 0 : prev + 1));
  };

  const getBgColor = () => {
    if (book.condition === "Good") return "text-green-600";
    if (book.condition === "Fair") return "text-amber-600";
    if (book.condition === "Poor") return "text-red-500";
    return "text-gray-500";
  };

  return (
    <div
      onClick={() => Navigate(`/view-book/${book._id}`)}
      className="w-[90%] mx-auto lg:mx-0 lg:w-[24%] rounded-3xl h-[50vh] lg:h-[60vh] bg--400 neu-button flex justify-center items-center font-[poppins]"
    >
      <div className="w-[100%] h-[95%] rounded-4xl overflow-hidden bg--400 flex justify-start items-center flex-col">
        {/* Image Carousel */}
        <div className="w-full h-[72%] relative rounded-[2rem] bg--300 overflow-hidden">
          <img
            src={book.photos[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover rounded-[2rem]"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/30 hover:bg-white/70 rounded-full p-1"
          >
            <i className="ri-arrow-left-s-line text-2xl"></i>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/30 hover:bg-white/70 rounded-full p-1"
          >
            <i className="ri-arrow-right-s-line text-2xl"></i>
          </button>
        </div>

        {/* Title */}
        <h1 className="text-xl lg:text-lg font-semibold mt-2">
          {book.title.length > 24 ? (
            <span>
              {book.title.slice(0, 24)}
              <span className="text-blue-400">...</span>
            </span>
          ) : (
            book.title
          )}
        </h1>

        {/* Price and Condition */}
        <div className="w-full flex bg--400 items-center justify-center">
          <div className="w-[50%] text-xl pl-1 text-green-600 font-black bg--400">
            <h1>₹{book.price}</h1>
          </div>
          <div
            className={`w-[50%] text-xl pl-1 font-black text-right pr-1 ${getBgColor()}`}
          >
            <h1>{book.condition}</h1>
          </div>
        </div>

        {/* College */}
        <div className="w-full text-lg font-semibold flex bg--400 flex-col items-center justify-center text-gray-500 border-t-1 pt-1 capitalize">
          <h1>📍{book.college.name}</h1>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
