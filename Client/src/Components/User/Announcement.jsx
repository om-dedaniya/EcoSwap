import React, { useEffect, useState } from "react";
import axios from "axios";

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/announcements")
      .then((res) => {
        setAnnouncements(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">
        📢 Announcements
      </h2>
      <div className="flex flex-col gap-4">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <div
              key={announcement._id}
              className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center text-center"
            >
              {announcement.image && (
                <img
                  src={announcement.image}
                  alt="Announcement"
                  className="w-3/4 h-auto rounded-md mb-4"
                />
              )}
              <h5 className="text-lg font-semibold text-gray-900">
                {announcement.title}
              </h5>
              <p className="text-sm text-gray-700 mt-2">
                {announcement.message}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 italic">
            No announcements available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Announcement;
