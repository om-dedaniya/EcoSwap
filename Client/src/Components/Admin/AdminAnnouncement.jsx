import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminAnnouncement = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [active, setActive] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/announcements");
      setAnnouncements(res.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("message", message);
    if (image) formData.append("image", image);
    formData.append("active", active);

    try {
      await axios.post("http://localhost:5000/api/announcements", formData);
      fetchAnnouncements();
      Swal.fire("Success!", "Announcement added successfully.", "success");
      setTitle("");
      setMessage("");
      setImage(null);
      setActive(false);
    } catch (error) {
      console.error("Error posting announcement:", error);
      Swal.fire("Error!", "Failed to post announcement.", "error");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/api/announcements/${id}`);
          fetchAnnouncements();
          Swal.fire("Deleted!", "The announcement has been removed.", "success");
        } catch (error) {
          console.error("Error deleting announcement:", error);
        }
      }
    });
  };

  const toggleActiveStatus = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/announcements/${id}`, {
        active: !currentStatus,
      });

      setAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement._id === id
            ? { ...announcement, active: !currentStatus }
            : announcement
        )
      );
    } catch (error) {
      console.error("Error updating announcement status:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        📢 Manage Announcements
      </h2>

      {/* Announcement Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">Post New Announcement</h4>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Title</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Message</label>
          <textarea
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter announcement message (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="3"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Upload Image</label>
          <input type="file" className="w-full px-3 py-2 border rounded-lg" onChange={(e) => setImage(e.target.files[0])} />
        </div>

        <div className="flex items-center mb-4">
          <input type="checkbox" className="mr-2" checked={active} onChange={() => setActive(!active)} />
          <label className="text-gray-700 font-semibold">Set as Active</label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all"
        >
          ➕ Post Announcement
        </button>
      </form>

      {/* Existing Announcements */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Existing Announcements</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements.map((announcement) => (
          <div key={announcement._id} className="bg-white shadow-lg rounded-lg p-6 relative">
            <div className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gray-700">
              {announcement.active ? "Active" : "Inactive"}
            </div>
            <h5 className="text-lg font-bold text-gray-800">{announcement.title || "No Title"}</h5>
            <p className="text-gray-600 text-sm">{announcement.message || "No Message"}</p>
            {announcement.image && (
              <img
                src={announcement.image}
                alt="Announcement"
                className="w-full h-40 object-cover rounded-lg mt-3"
              />
            )}

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => toggleActiveStatus(announcement._id, announcement.active)}
                className={`px-4 py-2 rounded-lg text-white font-semibold transition-all ${
                  announcement.active ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {announcement.active ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => handleDelete(announcement._id)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAnnouncement;
