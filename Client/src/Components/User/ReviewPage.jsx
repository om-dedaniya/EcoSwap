import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaStar, FaMoon, FaSun } from "react-icons/fa";

const ReviewPage = () => {
  const { isDarkMode, toggleDarkMode } = useOutletContext();
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ review: "", rating: "" });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("https://ecoswap-e24p.onrender.com/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        Swal.fire("Error", "Failed to fetch user data", "error");
      }
    };

    fetchUser();
  }, []);

  const validateForm = () => {
    const newErrors = { review: "", rating: "" };
    let isValid = true;

    if (!review.trim()) {
      newErrors.review = "Review is required";
      isValid = false;
    }
    if (rating <= 0 || rating > 5) {
      newErrors.rating = "Please select a rating between 1 and 5";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("Error", "Please log in to submit a review", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post(
        "https://ecoswap-e24p.onrender.com/api/review",
        {
          reviewText: review,
          rating,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire("Success", "Review submitted successfully!", "success");
      setReview("");
      setRating(0);
      setErrors({ review: "", rating: "" });
    } catch (err) {
      Swal.fire("Error", "Failed to submit review", "error");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (value) => {
    setRating(value);
    setErrors((prev) => ({ ...prev, rating: "" }));
  };

  return (
    <div
      className={`w-full max-w-xl mx-auto px-4 py-8 font-inter max-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`p-6 sm:p-8 rounded-2xl shadow-lg border backdrop-blur-lg transition-colors duration-300 ${
          isDarkMode
            ? "bg-gray-800/90 border-gray-700/50 text-gray-100"
            : "bg-white/90 border-gray-200/50 text-gray-800"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2
            className={`text-2xl sm:text-3xl font-bold ${
              isDarkMode ? "text-teal-400" : "text-teal-800"
            }`}
          >
            🌿 Share Your Experience
          </h2>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-colors duration-300 ${
              isDarkMode
                ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>
        </div>

        <div className="space-y-6">
          {/* Review Textarea */}
          <div>
            <label
              className={`block font-semibold mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Your Review
            </label>
            <textarea
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-colors duration-300 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
              }`}
              rows="4"
              placeholder="Write your review..."
              value={review}
              onChange={(e) => {
                setReview(e.target.value);
                setErrors((prev) => ({ ...prev, review: "" }));
              }}
            />
            {errors.review && (
              <p className="text-red-500 text-sm mt-1">{errors.review}</p>
            )}
          </div>

          {/* Rating Stars */}
          <div>
            <label
              className={`block font-semibold mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={24}
                  className={`cursor-pointer transition-colors duration-200 ${
                    star <= rating
                      ? "text-yellow-400"
                      : isDarkMode
                      ? "text-gray-600"
                      : "text-gray-300"
                  }`}
                  onClick={() => handleStarClick(star)}
                />
              ))}
            </div>
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2 ${
              isSubmitting
                ? "bg-teal-300 cursor-not-allowed"
                : isDarkMode
                ? "bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
                : "bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
            }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
      </div>

      {/* Inline Styles for Font */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          .font-inter { font-family: 'Inter', sans-serif; }
        `}
      </style>
    </div>
  );
};

export default ReviewPage;
