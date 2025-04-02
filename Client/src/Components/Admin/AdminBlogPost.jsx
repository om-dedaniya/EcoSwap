import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminBlogPost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingBlogId, setEditingBlogId] = useState(null);

  const blogsPerPage = 5;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/blogs");
      setBlogs(response.data.reverse());
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handleImageUpload = async () => {
    if (!image) return null;
    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.url;
    } catch (error) {
      console.error("Image upload failed:", error);
      Swal.fire("Error!", "Image upload failed.", "error");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = image ? await handleImageUpload() : null;

    const blogData = {
      title,
      description,
      content,
      image: imageUrl || undefined, // ✅ Use existing image if not uploading a new one
    };

    try {
      if (editingBlogId) {
        await axios.put(`http://localhost:5000/api/blogs/${editingBlogId}`, blogData);
        Swal.fire("Success!", "Blog updated successfully.", "success");
        setEditingBlogId(null);
      } else {
        await axios.post("http://localhost:5000/api/blogs", blogData);
        Swal.fire("Success!", "Blog added successfully.", "success");
      }

      fetchBlogs();
      setTitle("");
      setDescription("");
      setContent("");
      setImage(null);
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  const handleEdit = (blog) => {
    setTitle(blog.title);
    setDescription(blog.description);
    setContent(blog.content);
    setEditingBlogId(blog._id);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You cannot undo this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/api/blogs/${id}`);
          Swal.fire("Deleted!", "The blog has been removed.", "success");
          fetchBlogs();
        } catch (error) {
          console.error("Error deleting blog:", error);
        }
      }
    });
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        {editingBlogId ? "Edit Blog" : "Create New Blog"}
      </h2>

      {/* Blog Form */}
      <form onSubmit={handleSubmit} className="bg-white bg-opacity-60 shadow-xl backdrop-blur-lg rounded-lg p-6 mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Title</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Short blog description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Content</label>
          <textarea
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write full blog content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Upload Image</label>
          <input type="file" className="w-full px-3 py-2 border rounded-lg" onChange={(e) => setImage(e.target.files[0])} />
        </div>

        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all">
          {editingBlogId ? "Update Blog" : "Add Blog"}
        </button>
      </form>

      {/* Blog List */}
      <input
        type="text"
        className="w-full px-4 py-2 mb-4 border rounded-lg"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="bg-white shadow-xl rounded-lg p-6">
        {currentBlogs.map((blog) => (
          <div key={blog._id} className="flex items-center border-b py-4 space-x-4">
            {/* ✅ Display Blog Image */}
            {blog.image && (
              <img
                src={blog.image.startsWith("http") ? blog.image : `http://localhost:5000/uploads/${blog.image}`}
                alt={blog.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-800">{blog.title}</h4>
              <p className="text-gray-600 text-sm">{blog.description}</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg" onClick={() => handleEdit(blog)}>
                ✏ Edit
              </button>
              <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg" onClick={() => handleDelete(blog._id)}>
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBlogPost;
