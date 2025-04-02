import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const CategoryDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", id: null });

  const API_URL = "http://localhost:5000/categories";

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add or Update Category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await axios.put(`${API_URL}/${form.id}`, { name: form.name, description: form.description });
      } else {
        await axios.post(API_URL, { name: form.name, description: form.description });
      }
      setForm({ name: "", description: "", id: null });
      fetchCategories();
      Swal.fire("Success!", "Category saved successfully.", "success");
    } catch (error) {
      console.error("Error saving category", error);
      Swal.fire("Error!", "Failed to save category.", "error");
    }
  };

  // Edit Category
  const handleEdit = (category) => {
    setForm({ name: category.name, description: category.description, id: category._id });
  };

  // Delete Category with SweetAlert Confirmation
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/${id}`);
          fetchCategories();
          Swal.fire("Deleted!", "The category has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting category", error);
          Swal.fire("Error!", "Failed to delete category.", "error");
        }
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">📂 Category Dashboard</h2>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Category Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter category name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter category description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all"
        >
          {form.id ? "Update Category" : "Add Category"}
        </button>
      </form>

      {/* Category List Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 Categories</h3>

        <ul className="divide-y divide-gray-300">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <li key={cat._id} className="py-4 flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-bold text-gray-800">{cat.name}</h4>
                  <p className="text-gray-600 text-sm">{cat.description}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all"
                    onClick={() => handleEdit(cat)}
                  >
                    ✏ Edit
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                    onClick={() => handleDelete(cat._id)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-center">No categories available.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CategoryDashboard;
