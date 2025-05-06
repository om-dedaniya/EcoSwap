import React, { useEffect, useState } from "react";
import axios from "axios";

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    axios
      .get("https://ecoswap-e24p.onrender.com/api/announcements")
      .then((res) => {
        setAnnouncements(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-center text-3xl font-bold text-gray-800 mb-8">
        📢 Latest Announcements
      </h2>

      {announcements.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((announcement) => (
            <div
              key={announcement._id}
              className="bg-gray-50 border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-5 flex flex-col items-center text-center"
            >
              {announcement.image ? (
                <img
                  src={announcement.image}
                  alt="Announcement"
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-400 text-sm">
                  No image
                </div>
              )}
              <h5 className="text-xl font-semibold text-gray-900 line-clamp-2">
                {announcement.title || "Untitled Announcement"}
              </h5>
              <p className="text-gray-700 mt-2 text-sm line-clamp-4">
                {announcement.message || "No message provided."}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 italic mt-6">
          No announcements available.
        </p>
      )}
    </div>
  );
};

export default Announcement;
