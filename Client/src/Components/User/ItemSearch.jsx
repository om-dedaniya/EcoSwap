import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaSearch,
  FaTag,
  FaExchangeAlt,
  FaTimes,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import Swal from "sweetalert2";
import "animate.css";

const ItemSearch = () => {
  const { isDarkMode, toggleDarkMode } = useOutletContext();
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [swapOrGiveaway, setSwapOrGiveaway] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 15;
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [itemsRes, categoryRes] = await Promise.all([
          axios.get(
            "https://ecoswap-e24p.onrender.com/api/items/exclude-user",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          axios.get("https://ecoswap-e24p.onrender.com/categories"),
        ]);

        setAllItems(itemsRes.data.items || []);
        setCategories(categoryRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    let temp = [...allItems];

    if (searchTerm) {
      temp = temp.filter((item) =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category) {
      temp = temp.filter((item) => item.category === category);
    }

    if (swapOrGiveaway) {
      temp = temp.filter((item) => item.swapOrGiveaway === swapOrGiveaway);
    }

    setFilteredItems(temp);
    setCurrentPage(1);
  }, [allItems, searchTerm, category, swapOrGiveaway]);

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleMessage = () => {
    Swal.fire({
      icon: "info",
      title: "Oops! Messaging is not available yet 😔",
      html: `
        <p class="text-sm">
          We’re currently working hard to bring you a better chat experience.<br /><br />
          <strong>Please visit the "Messages" section from the sidebar</strong> to continue chatting with the item owner.
        </p>
        <br />
        <p style="font-size: 0.9rem;">Thank you for your patience and understanding 💚</p>
      `,
      confirmButtonText: "Understood",
      confirmButtonColor: "#14b8a6",
      background: isDarkMode ? "#1f2937" : "#ffffff",
      color: isDarkMode ? "#f3f4f6" : "#1f2937",
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    });
  };

  const handleImageClick = (imageUrl, e) => {
    e.stopPropagation();
    setSelectedImage(imageUrl);
  };

  return (
    <div
      className={`w-full max-w-6xl mx-auto p-4 sm:p-6 font-inter min-h-screen transition-colors duration-300 ${
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
            className={`text-2xl sm:text-3xl font-bold text-center ${
              isDarkMode ? "text-teal-400" : "text-teal-800"
            }`}
          >
            🔍 Find Items
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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FaSearch
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              type="text"
              placeholder="Search by Item Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-colors duration-300 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            />
          </div>
          <div className="relative flex-1">
            <FaTag
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-colors duration-300 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            >
              <option value="">All Categories</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative flex-1">
            <FaExchangeAlt
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <select
              value={swapOrGiveaway}
              onChange={(e) => setSwapOrGiveaway(e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-colors duration-300 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            >
              <option value="">All</option>
              <option value="Swap">Swap</option>
              <option value="Giveaway">Giveaway</option>
            </select>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className={`border rounded-lg shadow animate-pulse ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <div className="w-full h-48 rounded-t-lg bg-gray-300 dark:bg-gray-600"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mt-4"></div>
                </div>
              </div>
            ))
          ) : paginatedItems.length > 0 ? (
            paginatedItems.map((item) => {
              const firstImage = item.images?.[0]?.startsWith("http")
                ? item.images[0]
                : item.images?.[0]
                ? `https://ecoswap-e24p.onrender.com/uploads/${item.images[0]}`
                : "https://via.placeholder.com/300x200?text=No+Image";

              return (
                <div
                  key={item._id}
                  className={`border rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <img
                    src={firstImage}
                    alt={item.itemName}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={(e) => handleImageClick(firstImage, e)}
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/300x200?text=No+Image")
                    }
                  />
                  <div className="p-4">
                    <h3
                      className={`text-lg font-semibold truncate ${
                        isDarkMode ? "text-gray-100" : "text-gray-800"
                      }`}
                    >
                      {item.itemName}
                    </h3>
                    <p
                      className={`text-sm truncate ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <strong>Description:</strong> {item.description}
                    </p>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-700"
                      }`}
                    >
                      <strong>Category:</strong> {item.category?.name}
                    </p>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-700"
                      }`}
                    >
                      <strong>Type:</strong> {item.swapOrGiveaway}
                    </p>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-700"
                      }`}
                    >
                      <strong>Condition:</strong> {item.condition || "N/A"}
                    </p>
                    {item.price && (
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-700"
                        }`}
                      >
                        <strong>Price:</strong> ₹{item.price}
                      </p>
                    )}
                    {item.tags?.length > 0 && (
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-700"
                        }`}
                      >
                        <strong>Tags:</strong> {item.tags.join(", ")}
                      </p>
                    )}
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-700"
                      }`}
                    >
                      <strong>Posted:</strong>{" "}
                      {new Date(item.createdAt).toLocaleDateString("en-GB")}
                    </p>
                    {item.owner?.name && (
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-700"
                        }`}
                      >
                        <strong>Owner:</strong> {item.owner.name}
                      </p>
                    )}
                    <button
                      onClick={() => handleMessage()}
                      className={`mt-3 w-full py-2 rounded-lg text-white font-semibold transition-all transform hover:scale-105 ${
                        isDarkMode
                          ? "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                          : "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                      }`}
                    >
                      Message
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p
              className={`text-center col-span-3 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              No items found.
            </p>
          )}
        </div>

        {/* Pagination */}
        {filteredItems.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-4 mt-8">
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
              Page {currentPage} of{" "}
              {Math.ceil(filteredItems.length / itemsPerPage)}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(filteredItems.length / itemsPerPage)
                  )
                )
              }
              disabled={
                currentPage === Math.ceil(filteredItems.length / itemsPerPage)
              }
              className={`px-4 py-2 rounded-lg text-white font-semibold transition-all transform hover:scale-105 ${
                currentPage === Math.ceil(filteredItems.length / itemsPerPage)
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

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity duration-300"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl w-full">
              <button
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-300 ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                    : "bg-white text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedImage(null)}
              >
                <FaTimes size={20} />
              </button>
              <img
                src={selectedImage}
                alt="Full Size"
                className="w-full h-auto max-h-[80vh] rounded-lg object-contain"
              />
            </div>
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

export default ItemSearch;
