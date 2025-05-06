import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://ecoswap-e24p.onrender.com/api/blogs")
      .then((response) => {
        setBlogs(response.data);
      })
      .catch((error) => console.error("Error fetching blogs:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5e9] to-[#f1f8e9] py-20 px-6 md:px-12 lg:px-24">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-green-800">
          🌿 EcoSwap Blog Hub 🌱
        </h2>
        <p className="text-lg text-gray-700 mt-4 max-w-2xl mx-auto">
          Stay updated with the latest eco-friendly insights, tips, and
          inspiring success stories.
        </p>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {blogs.slice(0, 3).map((blog) => (
          <div
            key={blog._id}
            className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-56 object-cover rounded-t-2xl"
            />
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-800">
                {blog.title}
              </h3>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                {blog.description.length > 100
                  ? `${blog.description.substring(0, 100)}...`
                  : blog.description}
              </p>
              <button
                className="mt-6 inline-block bg-green-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-green-700 transition-all"
                onClick={() => navigate(`/blog/${blog._id}`)}
              >
                Read Full Blog →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* More Blogs CTA */}
      <div className="mt-16 text-center">
        <button
          onClick={() => navigate("/all-blogs")}
          className="bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold px-8 py-3 rounded-full shadow-md transition-all"
        >
          Explore More Blogs 📖
        </button>
      </div>
    </div>
  );
};

export default BlogPage;
