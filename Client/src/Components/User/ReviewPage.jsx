import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ReviewPage = () => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:5000/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token || !review || !rating) {
      Swal.fire("Error", "Please fill out both fields", "error");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/review",
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
    } catch (err) {
      Swal.fire("Error", "Failed to submit review", "error");
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Share Your Experience 🌿</h2>
      <textarea
        className="w-full border p-3 rounded mb-4"
        rows="4"
        placeholder="Write your review..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />

      <div className="flex items-center mb-4">
        <span className="mr-2 text-gray-700">Rating:</span>
        <input
          type="number"
          step="0.5"
          min="0"
          max="5"
          value={rating}
          onChange={(e) => setRating(parseFloat(e.target.value))}
          className="border px-2 py-1 rounded w-24"
        />
        <span className="ml-2 text-yellow-500 text-xl">⭐</span>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
      >
        Submit Review
      </button>
    </div>
  );
};

export default ReviewPage;
