import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

const getRandomColor = () => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-emerald-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const REVIEWS_PER_PAGE = 5;

const AdminReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          "https://ecoswap-e24p.onrender.com/api/reviews"
        );
        setReviews(res.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const currentReviews = reviews.slice(
    startIndex,
    startIndex + REVIEWS_PER_PAGE
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🌟 User Reviews</h1>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                User
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                Rating
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                Review
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {currentReviews.map((review, idx) => {
              const initials =
                review.name?.split(" ")[0]?.[0]?.toUpperCase() +
                (review.name?.split(" ")[1]?.[0]?.toUpperCase() || "");
              return (
                <tr key={idx} className="border-t">
                  <td className="flex items-center gap-3 px-6 py-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${getRandomColor()}`}
                    >
                      {initials || "U"}
                    </div>
                    <span className="font-medium">{review.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {review.email}
                  </td>
                  <td className="px-6 py-4 text-yellow-500 text-lg">
                    {review.rating} ⭐
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-pre-line">
                    {review.reviewText}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {moment(review.createdAt).format("MMM D, YYYY")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center gap-4 items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded disabled:opacity-50"
        >
          ⬅ Previous
        </button>
        <span className="text-gray-600 text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded disabled:opacity-50"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default AdminReviewPage;
