import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { CalendarDays, MapPin, Users, AlertCircle } from "lucide-react";
import { FaMoon, FaSun } from "react-icons/fa";

const EventJoining = () => {
  const { isDarkMode, toggleDarkMode } = useOutletContext();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("https://ecoswap-e24p.onrender.com/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://ecoswap-e24p.onrender.com/api/user-events"
        );
        setEvents(res.data || []);
      } catch (err) {
        setError("Failed to fetch events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleRegister = async (event) => {
    if (!user) {
      return Swal.fire("Error", "You are not logged in!", "error");
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to register for "${event.eventName}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Register",
    });

    if (result.isConfirmed) {
      try {
        const data = {
          eventName: event.eventName,
          eventDate: event.eventDate,
          eventLocation: event.location,
          memberName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.email,
          mobile: user.mobile || "N/A",
        };

        await axios.post(
          "https://ecoswap-e24p.onrender.com/api/join-event",
          data
        );

        Swal.fire(
          "Registered!",
          "You have successfully joined the event. Check your email for more details.",
          "success"
        );
      } catch (err) {
        const message = err?.response?.data?.message || "Registration failed.";
        Swal.fire("Error", message, "error");
      }
    }
  };

  const getCountdown = (eventDate) => {
    const now = new Date();
    const eventTime = new Date(eventDate);
    const diff = eventTime - now;

    if (diff <= 0) return "Event Started";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h left`;
  };

  return (
    <div
      className={`w-full max-w-7xl mx-auto px-4 py-8 font-inter min-h-screen transition-colors duration-300 relative ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      {/* Subtle Background Pattern */}
      <div
        className={`absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M20 20l-4-4m4 4l4-4m-4 4l4 4m-4-4l-4 4" stroke="${
          isDarkMode ? "%23A1A1AA" : "%234B5563"
        }" stroke-width="2" fill="none"/%3E%3C/svg%3E')] bg-repeat`}
      ></div>

      <div
        className={`relative p-6 sm:p-8 rounded-2xl shadow-lg border backdrop-blur-lg transition-colors duration-300 ${
          isDarkMode
            ? "bg-gray-800/90 border-gray-700/50 text-gray-100"
            : "bg-white/90 border-gray-200/50 text-gray-800"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2
            className={`text-2xl sm:text-3xl font-bold text-center ${
              isDarkMode ? "text-teal-400" : "text-teal-800"
            }`}
          >
            📅 Upcoming Events
          </h2>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-colors duration-300 ${
              isDarkMode
                ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>
        </div>

        {loading ? (
          <Loader isDarkMode={isDarkMode} />
        ) : error ? (
          <div
            className={`flex flex-col items-center justify-center py-12 rounded-lg ${
              isDarkMode
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <AlertCircle
              className={`w-12 h-12 mb-4 ${
                isDarkMode ? "text-red-400" : "text-red-500"
              }`}
            />
            <p className="text-lg font-medium">{error}</p>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                fetchEvents();
              }}
              className={`mt-4 px-4 py-2 rounded-lg text-white font-semibold transition-all transform hover:scale-105 ${
                isDarkMode
                  ? "bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
                  : "bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
              }`}
            >
              Retry
            </button>
          </div>
        ) : events.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center py-12 rounded-lg ${
              isDarkMode
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <CalendarDays className="w-12 h-12 mb-4 text-gray-400" />
            <p className="text-lg font-medium">No upcoming events found.</p>
            <p className="text-sm mt-2">
              Check back later for exciting events!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event._id}
                className={`relative rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 border-2 ${
                  isDarkMode
                    ? "bg-gray-800 border-teal-500/50"
                    : "bg-white border-teal-500/30"
                } group`}
              >
                {/* Gradient Overlay on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-teal-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>
                {/* Card Header with Gradient */}
                <div
                  className={`p-6 bg-gradient-to-r ${
                    isDarkMode
                      ? "from-teal-600/50 to-blue-600/50"
                      : "from-teal-500/50 to-blue-600/50"
                  } flex items-center gap-3`}
                >
                  <CalendarDays
                    className={`w-6 h-6 ${
                      isDarkMode ? "text-teal-300" : "text-teal-700"
                    }`}
                  />
                  <h3
                    className={`text-wrap font-semibold truncate ${
                      isDarkMode ? "text-teal-300" : "text-teal-700"
                    }`}
                  >
                    {event.eventName}
                  </h3>
                </div>
                {/* Card Content */}
                <div className="p-6 relative z-10">
                  <div
                    className={`flex items-center mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <CalendarDays className="w-5 h-5 mr-2 text-gray-400" />
                    <span>{new Date(event.eventDate).toDateString()}</span>
                  </div>
                  <div
                    className={`flex items-center mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                    <span>{event.location}</span>
                  </div>
                  <div
                    className={`flex items-center mb-4 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <Users className="w-5 h-5 mr-2 text-gray-400" />
                    <span>{event.totalParticipants} Participants</span>
                  </div>
                  <div
                    className={`text-sm font-medium mb-4 ${
                      isDarkMode ? "text-teal-400" : "text-teal-600"
                    }`}
                  >
                    {getCountdown(event.eventDate)}
                  </div>
                  <button
                    className={`w-full py-2 rounded-lg text-white font-semibold transition-all transform hover:scale-105 relative overflow-hidden group/button ${
                      isDarkMode
                        ? "bg-gradient-to-r from-teal-500 to-blue-600"
                        : "bg-gradient-to-r from-teal-500 to-blue-600"
                    }`}
                    onClick={() => handleRegister(event)}
                  >
                    <span className="relative z-10">Register</span>
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-700 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300`}
                    ></div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inline Styles for Font */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          .font-inter { font-family: 'Inter', sans-serif; }
        `}
      </style>
    </div>
  );
};

const Loader = ({ isDarkMode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={index}
        className={`border rounded-2xl shadow animate-pulse ${
          isDarkMode ? "bg-gray-700" : "bg-gray-200"
        }`}
      >
        <div
          className={`h-16 bg-gradient-to-r ${
            isDarkMode
              ? "from-gray-600 to-gray-500"
              : "from-gray-300 to-gray-200"
          }`}
        ></div>
        <div className="p-6 space-y-3">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mt-4"></div>
        </div>
      </div>
    ))}
  </div>
);

export default EventJoining;
