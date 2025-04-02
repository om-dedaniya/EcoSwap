import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/blogs")
      .then((response) => setBlogs(response.data))
      .catch((error) => console.error("Error fetching blogs:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 pt-24 relative">
      {/* pt-24 ensures content starts below the navbar */}
      
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">Latest Blogs</h2>

      {/* Blog Grid Container */}
      <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <div 
            key={blog._id} 
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
            onClick={() => navigate(`/blog/${blog._id}`)}
          >
            {/* Blog Image */}
            <img 
              src={blog.image} 
              alt={blog.title} 
              className="w-full h-56 object-cover"
            />

            {/* Blog Content */}
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{blog.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{blog.description.substring(0, 100)}...</p>

              {/* Read More Button */}
              <button className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300">
                Read Full Blog
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllBlogs;
