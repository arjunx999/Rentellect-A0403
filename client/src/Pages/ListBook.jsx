import React, { useState, useEffect } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as tmImage from "@teachablemachine/image";
import axios from "../api/axios";

const ListBook = () => {
  const Navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    isbn: "",
    rental_time: "",
    condition: "",
  });
  const [images, setImages] = useState([]);
  const token = sessionStorage.getItem("token");

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Machine model prediction
  const MODEL_URL = "https://teachablemachine.withgoogle.com/models/8X3ZD51m-/";
  let model, maxPredictions;

  const loadModel = async () => {
    model = await tmImage.load(
      `${MODEL_URL}model.json`,
      `${MODEL_URL}metadata.json`
    );
    maxPredictions = model.getTotalClasses();
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedToken = sessionStorage.getItem("token");

    if (storedUser && storedToken) {
      loadModel();
      setUser(storedUser);
    } else {
      setTimeout(() => {
        alert("Please login to access this page");
        Navigate("/login");
      }, 500);
    }
  }, [Navigate]);

  if (!user)
    return (
      <div className="w-[100vw] h-[100vh] bg-[#e0e0e0] text-8xl font-black flex items-center justify-center font-[poppins]">
        Login to access
      </div>
    );

  const fileToImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => resolve(img);
    });
  };

  const predictCondition = async (images) => {
    if (!model) await loadModel();

    const classScores = {};

    for (const imageFile of images) {
      const image = await fileToImage(imageFile);
      const predictions = await model.predict(image);

      // Store class-wise probabilities
      for (let i = 0; i < predictions.length; i++) {
        const predictedClass = predictions[i].className;
        const confidence = predictions[i].probability;

        // Class not found: Hence, initialize
        if (!classScores[predictedClass]) {
          classScores[predictedClass] = 0;
        }

        // Update confidence score
        classScores[predictedClass] += confidence;
      }
    }

    // Pick the class with the highest total confidence
    let highestScore = 0;
    let predictedClass = "";

    for (const condition in classScores) {
      const score = classScores[condition];

      if (score > highestScore) {
        highestScore = score;
        predictedClass = condition;
      }
    }

    // console.log("🔍 Confidence breakdown (sum of all 4 images):");
    // Object.entries(classScores).forEach(([name, score]) => {
    //   console.log(`${name}: ${((score / 4) * 100).toFixed(2)}%`);
    // });

    return {
      className: predictedClass,
      confidence: (highestScore / 4) * 100,
    };
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length !== 4) {
      alert("Please upload exactly 4 images: Front, Back, Spine, Pages.");
      return;
    }
    setImages(files);
  };

  const handlePredict = async (e) => {
    e.preventDefault();

    if (images.length !== 4) {
      alert("Upload exactly 4 images in the correct order.");
      return;
    }

    setShowModal(true);
    setIsLoading(true);

    const prediction = await predictCondition(images);
    // console.log("Predicted Book Condition:", prediction.className);
    // console.log("Confidence:", prediction.confidence.toFixed(2) + "%");

    setPredictionResult(prediction);
    setFormData((prev) => ({
      ...prev,
      condition: prediction.className,
    }));
    setIsLoading(false);
  };

  const resetImages = () => {
    setImages([]);
    setPredictionResult(null);
    setShowModal(false);
  };

  const submitListing = async () => {
    setIsSubmitting(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    images.forEach((img) => data.append("bookImages", img));

    try {
      const res = await axios.post("/book/list-new", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Book listed successfully!");
      // console.log(res.data);
      setShowModal(false);
      Navigate("/home");
    } catch (err) {
      console.error("Error listing book:", err);
      alert("Error listing book.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="w-[100vw] lg:h-[100vh] bg-[#e0e0e0] flex flex-col font-[poppins]
     bg--300 items-center justify-center relative"
    >
      <div
        onClick={() => Navigate(-1)}
        className=" absolute left-[4vh] top-[4vh] flex items-center gap-x-[4vw] lg:gap-x-[3vw]"
      >
        {" "}
        <i className="chat-icon ri-close-line text-xl font-bold  rounded-full py-2 px-3"></i>
        <h1 className="font-[poppins] font-semibold text-2xl text-[#4d4d4d]">
          List a Book :
        </h1>
      </div>
      <form
        onSubmit={handlePredict}
        className="w-[80%] h-auto my-[13vh] lg:h-[80%] bg--300 flex flex-col lg:flex-row gap-4"
      >
        <div className="lg:w-[50%] h-full flex flex-col px-[3vw] gap-[2vh] justify-center">
          <input
            type="text"
            name="title"
            placeholder="Book Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="neu-input"
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleChange}
            required
            className="neu-input"
          />
          <input
            type="number"
            name="price"
            placeholder="Price (in ₹)"
            value={formData.price}
            onChange={handleChange}
            required
            className="neu-input"
          />
          <input
            type="text"
            name="isbn"
            placeholder="ISBN"
            value={formData.isbn}
            onChange={handleChange}
            className="neu-input"
            required
          />
          <input
            type="number"
            name="rental_time"
            placeholder="Rental Time (in days)"
            value={formData.rental_time}
            onChange={handleChange}
            className="neu-input"
            required
          />
          <button
            type="submit"
            className="neu-button-log text-gradient font-semibold py-2 rounded-lg transition"
          >
            Get Condition Predicted
            <i className="ri-image-circle-ai-line ml-2 text-xl"></i>
          </button>
        </div>

        <div className="w-full lg:w-[50%] h-[100%] flex flex-col px-[3vw] gap-[2vh] justify-center">
          {/* 📷 Image Guidance Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {["Front Cover", "Back Cover", "Spine", "Pages Sample"].map(
              (label, idx) => (
                <div key={idx} className="text-center">
                  <p className="font-semibold mb-[0.6vh]">{label}</p>
                  <div className="w-full h-[17vh] flex items-center justify-center neu-drop text-gray-500">
                    {images[idx] ? (
                      <img
                        src={URL.createObjectURL(images[idx])}
                        alt={label}
                        className="h-full object-contain rounded"
                      />
                    ) : (
                      <span>Upload {idx + 1}</span>
                    )}
                  </div>
                </div>
              )
            )}
          </div>

          {/* 📥 File Input */}
          <input
            type="file"
            name="bookImages"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            // required
            className="neu-input mt-[2vh]"
          />
          <h1 className="text-gray-800 text-sm">
            *Note: For best results, take photos against a white background and
            upload them in the specified order.
          </h1>
        </div>
      </form>

      {/* Modal for Prediction */}
      {showModal && (
        <div className="fixed inset-0 bg--500 font-[poppins] backdrop-blur-[5px] flex items-center justify-center z-50">
          <div className="neu-box-l h-[50vh] flex flex-col items-center justify-center rounded-xl p-[5vh] shadow-lg w-[90vw] max-w-md text-center">
            {isLoading || isSubmitting ? (
              <>
                <div className="loader mb-4"></div>
                <h2 className="text-2xl font-bold mt-4 text-gray-800">
                  {isLoading
                    ? "Getting condition predicted by our trained model..."
                    : "Submitting your book listing..."}
                </h2>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2 text-gray-800">
                  Predicted Book Condition :
                </h2>
                <p className="text-3xl text-gradient font-semibold">
                  {predictionResult.className}
                </p>
                <p className="text-lg font-semibold text-gray-500 mb-4">
                  Confidence:{" "}
                  <span className="text-gradient">
                    {predictionResult.confidence.toFixed(2)}%
                  </span>
                </p>

                <div className="font-semibold flex justify-center gap-4 mt-3">
                  <button
                    onClick={submitListing}
                    className=" text-gradient px-4 py-2 rounded neu-button-log"
                  >
                    Submit Listing
                  </button>
                  <button
                    onClick={resetImages}
                    className=" px-4 py-2 rounded neu-button-log"
                  >
                    Take Pictures Again
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListBook;
