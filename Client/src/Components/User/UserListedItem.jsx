import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UserListedItem = () => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUserItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/items/user-items", {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: currentPage, limit: 9 },
      });
      setItems(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching user items:", error);
    }
  };

  useEffect(() => {
    fetchUserItems();
  }, [currentPage]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/delete-item/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Item deleted successfully!");
      fetchUserItems();
    } catch (error) {
      toast.error("Error deleting item.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        📦 Your Listed Items
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow hover:shadow-xl transition duration-300"
            >
              <img
                src={
                  item.images?.length > 0
                    ? item.images[0].startsWith("http")
                      ? item.images[0]
                      : `http://localhost:5000/uploads/${item.images[0]}`
                    : "/placeholder.png"
                }
                alt={item.itemName}
                className="w-full h-48 object-cover"
                onError={(e) => (e.target.src = "/placeholder.png")}
              />
              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.itemName}
                </h3>
                <p className="text-sm text-gray-600">
                  <strong>Category:</strong> {item.category}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>City:</strong> {item.city}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Type:</strong> {item.swapOrGiveaway}
                </p>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="mt-4 py-2 w-full bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No items found.
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            ⬅ Previous
          </button>
          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
};

export default UserListedItem;
