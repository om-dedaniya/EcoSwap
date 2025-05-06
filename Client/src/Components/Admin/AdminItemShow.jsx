import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminItemShow = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, [currentPage]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://ecoswap-e24p.onrender.com/api/items?page=${currentPage}&limit=${itemsPerPage}`
      );
      setItems(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Failed to fetch items.");
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://ecoswap-e24p.onrender.com/categories"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `https://ecoswap-e24p.onrender.com/api/delete-item/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Item deleted successfully!");
        fetchItems(); // refresh items
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(error.response?.data?.message || "Failed to delete item.");
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "" || item.category?.name === selectedCategory)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Admin Item Management
        </h2>

        {/* Search & Filter */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            className="border border-gray-300 p-3 rounded-lg w-full sm:w-1/2 focus:ring-2 focus:ring-blue-500"
            placeholder="Search by item name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border border-gray-300 p-3 rounded-lg w-full sm:w-1/4 focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                {[
                  "#",
                  "Item",
                  "Category",
                  "City",
                  "Condition",
                  "Type",
                  "Price",
                  "User",
                  "Mobile",
                  "Images",
                  "Actions",
                ].map((header) => (
                  <th key={header} className="p-3 text-left">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="11" className="text-center py-6">
                    Loading items...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center py-6">
                    No items found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border-t hover:bg-gray-50 transition duration-200"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{item.itemName}</td>
                    <td className="p-3">{item.category?.name}</td>
                    <td className="p-3">{item.city}</td>
                    <td className="p-3">{item.condition}</td>
                    <td className="p-3">{item.swapOrGiveaway}</td>
                    <td className="p-3">{item.price || "Free"}</td>
                    <td className="p-3">
                      {item.memberID?.firstName} ({item.memberID?.email})
                    </td>
                    <td className="p-3">{item.memberID?.mobile}</td>
                    <td className="p-3 space-x-2">
                      {item.images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setImagePreview(img)}
                          className="text-blue-500 underline hover:text-blue-700"
                        >
                          View {i + 1}
                        </button>
                      ))}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Image Preview Modal */}
        {imagePreview && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={() => setImagePreview(null)}
          >
            <div className="bg-white p-4 rounded-lg max-w-3xl">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-[80vh] mx-auto"
              />
              <div className="text-center mt-4">
                <button
                  onClick={() => setImagePreview(null)}
                  className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminItemShow;
