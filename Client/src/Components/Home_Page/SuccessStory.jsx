import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
};

const getRandomColor = () => {
  const colors = [
    "#FFB6C1",
    "#FFD700",
    "#87CEFA",
    "#90EE90",
    "#FFA07A",
    "#DDA0DD",
    "#B0E0E6",
    "#F08080",
    "#E6E6FA",
    "#C1FFC1",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const SuccessStory = () => {
  const [reviews, setReviews] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesToShow = 3;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          "https://ecoswap-e24p.onrender.com/api/reviews"
        );
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews", err);
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide, reviews]);

  const totalSlides = Math.ceil(reviews.length / slidesToShow);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const visibleReviews = reviews.slice(
    currentSlide * slidesToShow,
    currentSlide * slidesToShow + slidesToShow
  );

  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-green-100 py-20 px-6 md:px-12 text-center">
      {/* Header */}
      <div className="mb-14">
        <h2 className="text-5xl font-bold text-green-800">
          ✨ Success Stories
        </h2>
        <p className="text-lg text-gray-600 mt-3">
          Real impact from our inspiring community 🌱
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center mb-10 gap-6">
        <button
          onClick={prevSlide}
          className="px-5 py-2 bg-green-200 hover:bg-green-300 text-green-800 font-semibold rounded-full transition"
        >
          ← Prev
        </button>
        <button
          onClick={nextSlide}
          className="px-5 py-2 bg-green-200 hover:bg-green-300 text-green-800 font-semibold rounded-full transition"
        >
          Next →
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {visibleReviews.map((review, index) => {
            const initials = getInitials(review.name || "User");
            const bgColor = getRandomColor();

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="bg-white/70 backdrop-blur-xl border border-green-100 shadow-lg rounded-2xl p-6 transform hover:scale-[1.03] hover:shadow-2xl transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md"
                    style={{ backgroundColor: bgColor }}
                  >
                    {initials}
                  </div>
                  <div className="text-left">
                    <h5 className="text-lg font-semibold text-gray-800">
                      {review.name}
                    </h5>
                  </div>
                </div>
                <p className="mt-4 text-gray-700 italic leading-relaxed">
                  “{review.reviewText}”
                </p>
                <div className="mt-4 text-yellow-500 text-lg">
                  {"⭐".repeat(Math.floor(review.rating))}
                  {review.rating % 1 !== 0 ? "✨" : ""}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="mt-10 flex justify-center gap-3">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <button
            key={idx}
            className={`w-3.5 h-3.5 rounded-full transition-all ${
              idx === currentSlide ? "bg-green-800 scale-110" : "bg-gray-400"
            }`}
            onClick={() => setCurrentSlide(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default SuccessStory;
