import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const FullBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(`https://ecoswap-e24p.onrender.com/api/blogs/${id}`)
      .then((response) => {
        if (response.data) {
          setBlog(response.data);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blog:", error);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 mt-4">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-red-500 text-lg font-semibold">Blog not found!</p>
      </div>
    );
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6 sm:px-10">
      {/* Back Button */}
      {location.pathname.startsWith("/blog/") && (
        <button
          className="text-green-600 flex items-center gap-2 mb-6 hover:text-green-800 transition duration-300"
          onClick={handleBack}
        >
          <span className="text-2xl">←</span> <span>Back</span>
        </button>
      )}

      {/* Blog Content */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6 sm:p-10">
        <h2 className="text-3xl font-bold text-gray-900">{blog.title}</h2>
        <p className="text-gray-600 text-sm mt-2">
          Published on {formattedDate}
        </p>

        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-64 sm:h-80 object-cover rounded-lg mt-6"
        />

        <p className="text-gray-700 text-lg mt-6">{blog.description}</p>

        <div className="mt-6 text-gray-800 text-base leading-relaxed">
          {blog.content}
        </div>
      </div>
    </div>
  );
};

export default FullBlog;
