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
        params: { page: currentPage, limit: 10 },
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
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">📦 Your Listed Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item._id} className="border p-4 rounded-lg shadow hover:shadow-lg transition">
              <img
  src={
    item.images?.length > 0 
      ? item.images[0].startsWith("http") 
        ? item.images[0] 
        : `http://localhost:5000/uploads/${item.images[0]}`
      : "/placeholder.png"
  }
  alt={item.itemName}
  className="w-full h-48 object-cover rounded-lg"
  onError={(e) => (e.target.src = "/placeholder.png")} // Fallback image
/>

              <h3 className="text-lg font-semibold mt-2">{item.itemName}</h3>
              <p className="text-sm text-gray-600"><strong>Category:</strong> {item.category}</p>
              <p className="text-sm text-gray-700"><strong>City:</strong> {item.city}</p>
              <p className="text-sm text-gray-700"><strong>Type:</strong> {item.swapOrGiveaway}</p>
              <button
                onClick={() => handleDelete(item._id)}
                className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 w-full"
              >
                🗑 Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-600">No items found.</p>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            ⬅ Previous
          </button>
          <span className="text-lg font-semibold">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
};

export default UserListedItem;
