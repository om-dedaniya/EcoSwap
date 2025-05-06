import React, { useEffect, useState } from "react";
import axios from "axios";

const LandingPagePopup = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    axios
      .get("https://ecoswap-e24p.onrender.com/api/announcements")
      .then((res) => {
        if (res.data.length > 0) {
          setAnnouncement(res.data[0]); // Show the latest announcement
          setIsVisible(true);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const closePopup = () => setIsVisible(false);

  if (!isVisible || !announcement) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
      <div className="relative bg-gradient-to-br from-[#60B45A] to-[#085BDD] p-8 rounded-3xl shadow-2xl w-[90%] max-w-2xl text-white transform scale-95 animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={closePopup}
          className="absolute top-5 right-5 text-white text-3xl hover:scale-110 transition-transform"
        >
          &times;
        </button>

        {/* Image */}
        {announcement.image && (
          <div className="w-40 h-40 rounded-xl overflow-hidden mx-auto shadow-lg">
            <img
              src={announcement.image}
              alt="Announcement"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Title */}
        <h2 className="text-2xl font-extrabold text-center mt-5">
          {announcement.title || "Exciting Update!"}
        </h2>

        {/* Message */}
        <p className="text-lg text-center mt-3 px-6">
          {announcement.message || "Check out our latest features and offers!"}
        </p>

        {/* CTA Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={closePopup}
            className="px-6 py-3 bg-white text-[#60B45A] font-bold rounded-full shadow-md hover:shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-105"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPagePopup;
