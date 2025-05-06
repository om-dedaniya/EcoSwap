import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrash, FaMoon, FaSun } from "react-icons/fa";

const UserListedItem = () => {
  const { isDarkMode, toggleDarkMode } = useOutletContext();
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserItems = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        "https://ecoswap-e24p.onrender.com/api/items/user-items",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: currentPage, limit: 9 },
        }
      );
      setItems(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching user items:", error);
      toast.error("Error fetching items.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserItems();
  }, [currentPage]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://ecoswap-e24p.onrender.com/api/delete-item/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Item deleted successfully!");
      fetchUserItems();
    } catch (error) {
      toast.error("Error deleting item.");
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div
      className={`w-full max-w-7xl mx-auto px-4 py-8 font-inter max-h-screen transition-colors duration-300 ${
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
        <div className="flex justify-between items-center mb-8">
          <h2
            className={`text-2xl sm:text-3xl font-bold text-center ${
              isDarkMode ? "text-teal-400" : "text-teal-800"
            }`}
          >
            📦 Your Listed Items
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

        {/* Items Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className={`border rounded-xl shadow animate-pulse ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <div className="w-full h-48 rounded-t-xl bg-gray-300 dark:bg-gray-600"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mt-4"></div>
                </div>
              </div>
            ))
          ) : items.length > 0 ? (
            items.map((item) => (
              <div
                key={item._id}
                className={`border rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <img
                  src={
                    item.images?.length > 0
                      ? item.images[0].startsWith("http")
                        ? item.images[0]
                        : `https://ecoswap-e24p.onrender.com/uploads/${item.images[0]}`
                      : "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={item.itemName}
                  className="w-full h-48 object-cover"
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/300x200?text=No+Image")
                  }
                />
                <div className="p-4 flex flex-col gap-2">
                  <h3
                    className={`text-lg font-semibold truncate ${
                      isDarkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    {item.itemName}
                  </h3>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <strong>Category:</strong> {item.category?.name}
                  </p>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <strong>City:</strong> {item.city}
                  </p>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <strong>Type:</strong> {item.swapOrGiveaway}
                  </p>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className={`mt-4 py-2 w-full rounded-lg text-white font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2 ${
                      isDarkMode
                        ? "bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700"
                        : "bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700"
                    }`}
                  >
                    <FaTrash size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div
              className={`col-span-full text-center py-10 rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <p className="text-lg font-medium">No items found.</p>
              <p className="text-sm mt-2">
                Start listing items to see them here!
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg text-white font-semibold transition-all transform hover:scale-105 ${
                currentPage === 1
                  ? "bg-gray-500 cursor-not-allowed"
                  : isDarkMode
                  ? "bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
                  : "bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
              }`}
            >
              ⬅ Previous
            </button>
            <span
              className={`text-lg font-semibold ${
                isDarkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg text-white font-semibold transition-all transform hover:scale-105 ${
                currentPage === totalPages
                  ? "bg-gray-500 cursor-not-allowed"
                  : isDarkMode
                  ? "bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
                  : "bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
              }`}
            >
              Next ➡
            </button>
          </div>
        )}

        {/* Inline Styles for Font */}
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            .font-inter { font-family: 'Inter', sans-serif; }
          `}
        </style>
      </div>
    </div>
  );
};

export default UserListedItem;
