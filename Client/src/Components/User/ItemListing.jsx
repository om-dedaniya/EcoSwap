import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import Swal from "sweetalert2";
import { FaTimes, FaUpload } from "react-icons/fa";

const ItemListing = () => {
  const { isDarkMode, toggleDarkMode } = useOutletContext();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [images, setImages] = useState(Array(5).fill(null));
  const [user, setUser] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [condition, setCondition] = useState("");
  const [swapOrGiveaway, setSwapOrGiveaway] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("https://ecoswap-e24p.onrender.com/categories").then((res) => {
      setCategories(res.data);
    });

    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("https://ecoswap-e24p.onrender.com/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }

    axios
      .post("https://countriesnow.space/api/v0.1/countries/cities", {
        country: "India",
      })
      .then((res) => {
        if (res.data?.data) {
          const cityOptions = res.data.data
            .map((c) => ({ value: c, label: c }))
            .sort((a, b) => a.label.localeCompare(b.label));
          setCities(cityOptions);
        }
      });
  }, []);

  useEffect(() => {
    if (swapOrGiveaway === "Giveaway") setPrice("");
  }, [swapOrGiveaway]);

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...images];
      updatedImages[index] = file;
      setImages(updatedImages);
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages[index] = null;
    setImages(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return Swal.fire("Error", "User not logged in.", "error");
    if (images.every((img) => img === null))
      return Swal.fire("Error", "Please upload at least 1 image.", "error");
    if (swapOrGiveaway === "Swap" && !price)
      return Swal.fire("Error", "Please enter price for swap item.", "error");

    const formData = new FormData();
    images.forEach((img) => {
      if (img) formData.append("images", img);
    });

    formData.append(
      "category",
      selectedCategory === "Other" ? otherCategory : selectedCategory
    );
    formData.append("itemName", itemName);
    formData.append("description", description);
    formData.append("keywords", keywords);
    formData.append("city", selectedCity?.value || "");
    formData.append("condition", condition);
    formData.append("swapOrGiveaway", swapOrGiveaway);
    if (swapOrGiveaway === "Swap") {
      formData.append("price", price);
    }

    try {
      setLoading(true);
      await axios.post(
        "https://ecoswap-e24p.onrender.com/api/list-item",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      Swal.fire("Success", "Item listed successfully!", "success");

      // Reset fields
      setItemName("");
      setSelectedCategory("");
      setOtherCategory("");
      setKeywords("");
      setDescription("");
      setImages(Array(5).fill(null));
      setSelectedCity(null);
      setCondition("");
      setSwapOrGiveaway("");
      setPrice("");
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to list item.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Custom styles for react-select with dark mode support
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      border: `1px solid ${isDarkMode ? "#4B5563" : "#d1d5db"}`,
      backgroundColor: isDarkMode ? "#374151" : "white",
      color: isDarkMode ? "#E5E7EB" : "#1f2937",
      padding: "0.5rem",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
      "&:hover": { borderColor: "#14b8a6" },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      backgroundColor: isDarkMode ? "#374151" : "white",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#14b8a6"
        : isDarkMode
        ? "#374151"
        : "white",
      color: state.isSelected ? "white" : isDarkMode ? "#E5E7EB" : "#1f2937",
      "&:hover": {
        backgroundColor: isDarkMode ? "#4B5563" : "#ccfbf1",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isDarkMode ? "#E5E7EB" : "#1f2937",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: isDarkMode ? "#9CA3AF" : "#6B7280",
    }),
  };

  return (
    <div
      className={`w-full max-w-4xl mx-auto p-4 sm:p-6 font-inter min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`p-6 sm:p-8 rounded-2xl shadow-lg border transition-colors duration-300 ${
          isDarkMode
            ? "bg-gray-800/90 border-gray-700/50 text-gray-100"
            : "bg-white/90 border-gray-200/50 text-gray-800"
        } backdrop-blur-lg`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2
            className={`text-2xl sm:text-3xl font-bold text-center ${
              isDarkMode ? "text-teal-400" : "text-teal-800"
            }`}
          >
            📦 List an Item
          </h2>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-colors duration-300 ${
              isDarkMode
                ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {isDarkMode ? "Switch to Light" : "Switch to Dark"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label
              className={`block font-semibold mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Upload Photos (1 vertical + 4 horizontal)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <label
                className={`relative flex flex-col items-center justify-center h-48 sm:h-64 border-2 border-dashed rounded-lg cursor-pointer hover:border-teal-500 transition ${
                  isDarkMode
                    ? "border-gray-600 bg-gray-700"
                    : "border-gray-300 bg-white"
                }`}
              >
                {images[0] ? (
                  <>
                    <img
                      src={URL.createObjectURL(images[0])}
                      alt="Vertical Preview"
                      className="w-full h-max object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(0)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                    >
                      <FaTimes size={18} />
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <FaUpload
                      className={`mx-auto mb-2 ${
                        isDarkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                      size={24}
                    />
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Vertical Image
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 0)}
                />
              </label>

              <div className="grid grid-cols-2 gap-4 sm:col-span-4">
                {[1, 2, 3, 4].map((index) => (
                  <label
                    key={index}
                    className={`relative flex items-center justify-center h-24 sm:h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-teal-500 transition ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {images[index] ? (
                      <>
                        <img
                          src={URL.createObjectURL(images[index])}
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                        >
                          <FaTimes size={16} />
                        </button>
                      </>
                    ) : (
                      <div className="text-center">
                        <FaUpload
                          className={`mx-auto mb-2 ${
                            isDarkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                          size={20}
                        />
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Horizontal
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, index)}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Title & City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label
                className={`block font-semibold mb-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Title
              </label>
              <input
                type="text"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-colors duration-300 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g., Old Bicycle"
                required
              />
            </div>
            <div>
              <label
                className={`blockDEVICE font-semibold mb-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                City
              </label>
              <Select
                options={cities}
                value={selectedCity}
                onChange={setSelectedCity}
                placeholder="Select city"
                styles={customSelectStyles}
                className="text-sm"
              />
            </div>
          </div>

          {/* Category & Keywords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label
                className={`block font-semibold mb-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Category
              </label>
              <select
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-colors duration-300 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
              {selectedCategory === "Other" && (
                <input
                  type="text"
                  className={`w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-colors duration-300 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                  value={otherCategory}
                  onChange={(e) => setOtherCategory(e.target.value)}
                  placeholder="Enter category name"
                />
              )}
            </div>
            <div>
              <label
                className={`block font-semibold mb-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Keywords
              </label>
              <input
                type="text"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-colors duration-300 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                required
                placeholder="e.g., books, kids, sports"
              />
            </div>
          </div>

          {/* Condition & Swap/Giveaway */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label
                className={`block font-semibold mb-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Condition
              </label>
              <select
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-colors duration-300 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                required
              >
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Gently Used">Gently Used</option>
                <option value="Heavily Used">Heavily Used</option>
              </select>
            </div>
            <div>
              <label
                className={`block font-semibold mb-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Swap or Giveaway
              </label>
              <select
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-colors duration-300 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
                value={swapOrGiveaway}
                onChange={(e) => setSwapOrGiveaway(e.target.value)}
                required
              >
                <option value="">Select Option</option>
                <option value="Swap">Swap</option>
                <option value="Giveaway">Giveaway</option>
              </select>
              {swapOrGiveaway === "Swap" && (
                <input
                  type="number"
                  className={`w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-colors duration-300 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price (₹)"
                />
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              className={`block font-semibold mb-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Description
            </label>
            <textarea
              rows={4}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-colors duration-300 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Provide some details about the item..."
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all transform hover:scale-105 shadow-md flex items-center justify-center ${
              loading
                ? "bg-teal-300 cursor-not-allowed"
                : isDarkMode
                ? "bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
                : "bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
            }`}
          >
            {loading ? (
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
              "Submit"
            )}
          </button>
        </form>
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

export default ItemListing;
