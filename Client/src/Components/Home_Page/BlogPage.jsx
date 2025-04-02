import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/blogs")
      .then((response) => {
        setBlogs(response.data);
      })
      .catch((error) => console.error("Error fetching blogs:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#c8e6c9] to-[#e8f5e9] py-16 px-6 md:px-12 lg:px-24">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800">🌿 EcoSwap Blog Hub 🌱</h2>
        <p className="text-lg text-gray-600 mt-3">
          Stay updated with the latest eco-friendly insights, tips, and success stories!
        </p>
      </div>

      {/* Blog Listing Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {blogs.slice(0, 3).map((blog) => (
          <div
            key={blog._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl border border-gray-200"
          >
            <img src={blog.image} alt={blog.title} className="w-full h-56 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800">{blog.title}</h3>
              <p className="mt-2 text-gray-600 text-sm">
                {blog.description.length > 100 ? `${blog.description.substring(0, 100)}...` : blog.description}
              </p>
              <button
                className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-all"
                onClick={() => navigate(`/blog/${blog._id}`)}
              >
                Read Full Blog
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* More Blogs Button */}
      <div className="mt-12 text-center">
        <button
          className="bg-orange-500 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-orange-600 transition-all"
          onClick={() => navigate("/all-blogs")}
        >
          More Blogs 📖
        </button>
      </div>
    </div>
  );
};

export default BlogPage;
