import React, { useEffect, useState } from "react";
import axios from "axios";

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
};

const getRandomColor = () => {
  const colors = [
    "#FFB6C1", "#FFD700", "#87CEFA", "#90EE90", "#FFA07A",
    "#DDA0DD", "#B0E0E6", "#F08080", "#E6E6FA", "#C1FFC1"
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
        const res = await axios.get("http://localhost:5000/api/reviews");
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews", err);
      }
    };
    fetchReviews();
  }, []);

  // Auto-slide every 5 seconds
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
    <div className="bg-white py-16 px-6 md:px-12 lg:px-24 text-center">
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-gray-800">Success Stories</h2>
        <p className="text-lg text-gray-600 mt-3">Real impact from our community members</p>
      </div>

      {/* Carousel Controls */}
      <div className="flex justify-center items-center mb-6 gap-6">
        <button
          onClick={prevSlide}
          className="p-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600 text-sm"
        >
          ⬅ Previous
        </button>
        <button
          onClick={nextSlide}
          className="p-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600 text-sm"
        >
          Next ➡
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto transition-all duration-500">
        {visibleReviews.map((review, index) => {
          const initials = getInitials(review.name || "User");
          const bgColor = getRandomColor();

          return (
            <div
              key={index}
              className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              {/* Avatar & Name */}
              <div className="flex items-center space-x-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold"
                  style={{ backgroundColor: bgColor }}
                >
                  {initials}
                </div>
                <div className="text-left">
                  <h5 className="text-lg font-semibold text-gray-800">{review.name}</h5>
                </div>
              </div>

              {/* Testimonial */}
              <p className="mt-4 text-gray-600 italic">"{review.reviewText}"</p>

              {/* Star Ratings */}
              <div className="mt-4 text-yellow-500 text-lg">
                {"⭐".repeat(Math.floor(review.rating))}
                {review.rating % 1 !== 0 ? "✨" : ""}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots Navigation */}
      <div className="mt-8 flex justify-center gap-2">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${
              idx === currentSlide ? "bg-gray-800" : "bg-gray-400"
            }`}
            onClick={() => setCurrentSlide(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default SuccessStory;
