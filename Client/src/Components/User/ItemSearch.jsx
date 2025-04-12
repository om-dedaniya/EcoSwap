import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ItemSearch = () => {
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [swapOrGiveaway, setSwapOrGiveaway] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 15;
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, categoryRes] = await Promise.all([
          axios.get("http://localhost:5000/api/items/exclude-user", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/categories"),
        ]);

        setAllItems(itemsRes.data.items || []);
        setCategories(categoryRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

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

  // components/User/ItemSearch.js
  const handleMessage = async (item) => {
    if (!item.owner || item.owner._id === userId) return;

    try {
      const response = await axios.post("http://localhost:5000/api/chats", {
        buyerId: userId,
        sellerId: item.owner._id,
        itemId: item._id,
      });

      const chatId = response.data._id;
      navigate(`/dashboard/chat/${chatId}`);
    } catch (err) {
      console.error("Error accessing or creating chat:", err);
    }
  };

  const handleImageClick = (imageUrl, e) => {
    e.stopPropagation();
    setSelectedImage(imageUrl);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">🔍 Find Items</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <input
          type="text"
          placeholder="Search by Item Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={swapOrGiveaway}
          onChange={(e) => setSwapOrGiveaway(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">All</option>
          <option value="Swap">Swap</option>
          <option value="Giveaway">Giveaway</option>
        </select>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {paginatedItems.length > 0 ? (
          paginatedItems.map((item) => {
            const firstImage = item.images?.[0]?.startsWith("http")
              ? item.images[0]
              : item.images?.[0]
              ? `http://localhost:5000/uploads/${item.images[0]}`
              : "/placeholder.png";

            return (
              <div
                key={item._id}
                className="border p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <img
                  src={firstImage}
                  alt={item.itemName}
                  className="w-full h-48 object-cover rounded-lg cursor-pointer"
                  onClick={(e) => handleImageClick(firstImage, e)}
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
                <h3 className="text-lg font-semibold mt-2">{item.itemName}</h3>
                <p className="text-sm text-gray-600">
                  <strong>Description:</strong> {item.description}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Category:</strong> {item.category}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Type:</strong> {item.swapOrGiveaway}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Condition:</strong> {item.condition || "N/A"}
                </p>
                {item.price && (
                  <p className="text-sm text-gray-700">
                    <strong>Price:</strong> ₹{item.price}
                  </p>
                )}
                {item.tags?.length > 0 && (
                  <p className="text-sm text-gray-700">
                    <strong>Tags:</strong> {item.tags.join(", ")}
                  </p>
                )}
                <p className="text-sm text-gray-700">
                  <strong>Posted:</strong>{" "}
                  {new Date(item.createdAt).toLocaleDateString("en-GB")}
                </p>
                {item.owner?.name && (
                  <p className="text-sm text-gray-700">
                    <strong>Owner:</strong> {item.owner.name}
                  </p>
                )}
                <button
                  onClick={() => handleMessage(item)}
                  className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 w-full"
                >
                  Message
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-center col-span-3 text-gray-600">
            No items found.
          </p>
        )}
      </div>

      {/* Pagination */}
      {filteredItems.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            ⬅ Previous
          </button>
          <span className="text-lg font-semibold">
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
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            Next ➡
          </button>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative">
            <button
              className="absolute top-2 right-2 bg-white p-2 rounded-full text-black"
              onClick={() => setSelectedImage(null)}
            >
              ✖
            </button>
            <img
              src={selectedImage}
              alt="Full Size"
              className="max-w-full max-h-screen rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemSearch;
