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

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/items");
      setItems(response.data.items);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
      const response = await axios.delete(`http://localhost:5000/api/delete-item/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
  
      if (response.status === 200) {
        setItems((prevItems) => prevItems.filter((item) => item._id !== id));
        toast.success("Item deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item.");
    }
  };
  

  const handleMessage = (email) => {
    window.location.href = `mailto:${email}?subject=Inquiry about your listed item&body=Hello, I am interested in your item listed on EcoSwap.`;
  };

  const filteredItems = items.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "" || item.category === selectedCategory)
  );

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Admin Item Management</h2>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          className="border p-2 rounded w-full sm:w-1/2"
          placeholder="Search by item name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border p-2 rounded w-full sm:w-1/4"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">#</th>
              <th className="border p-2">Item Name</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">City</th>
              <th className="border p-2">Condition</th>
              <th className="border p-2">Swap/Giveaway</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Listed By</th>
              <th className="border p-2">Mobile</th>
              <th className="border p-2">Images</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" className="text-center p-4">Loading items...</td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center p-4">No items found.</td>
              </tr>
            ) : (
              currentItems.map((item, index) => (
                <tr key={item._id} className="border-t">
                  <td className="border p-2">{indexOfFirstItem + index + 1}</td>
                  <td className="border p-2">{item.itemName}</td>
                  <td className="border p-2">{item.category}</td>
                  <td className="border p-2">{item.city}</td>
                  <td className="border p-2">{item.condition}</td>
                  <td className="border p-2">{item.swapOrGiveaway}</td>
                  <td className="border p-2">{item.price || "Free"}</td>
                  <td className="border p-2">{item.userName} ({item.email})</td>
                  <td className="border p-2">{item.mobile}</td>
                  <td className="border p-2">
                    {item.images.map((img, imgIndex) => (
                      <button key={imgIndex} className="text-blue-600 underline" onClick={() => setImagePreview(img)}>View {imgIndex + 1}</button>
                    ))}
                  </td>
                  <td className="border p-2">
                    <button className="bg-red-500 text-white px-3 py-1 rounded mr-2" onClick={() => handleDelete(item._id)}>🗑 Delete</button>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => handleMessage(item.email)}>✉ Message</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminItemShow;