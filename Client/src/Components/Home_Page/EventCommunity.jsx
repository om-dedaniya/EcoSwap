import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const EventCommunity = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [eventIndex, setEventIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user-events");
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch events");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const cycleArray = (array, index) => {
    return [
      ...array.slice(index, index + 3),
      ...array.slice(0, Math.max(0, 3 - (array.length - index))),
    ];
  };

  const handleRegisterClick = () => {
    Swal.fire({
      title: "Please Do Login",
      text: "Refer the Event Menu from the sidebar.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Login",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");
      }
    });
  };

  return (
    <div className="min-h-95 bg-gradient-to-b from-[#C8E6C9] to-[#E8F5E9] p-8">
      {/* Upcoming Events Section */}
      <section className="mt-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-blue-800 mb-8">
          📅 Upcoming Events
        </h2>
        {loading ? (
          <p className="text-center text-gray-700">Loading events...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-700">No upcoming events found.</p>
        ) : (
          <div className="flex items-center justify-center">
            <button
              className="text-3xl text-blue-600 hover:text-blue-800 transition duration-300 mx-2"
              onClick={() =>
                setEventIndex((eventIndex - 3 + events.length) % events.length)
              }
            >
              ❮
            </button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-4 w-full max-w-6xl">
              {cycleArray(events, eventIndex).map((event) => (
                <div
                  key={event._id}
                  className="bg-white bg-opacity-80 backdrop-blur-lg shadow-lg rounded-xl p-6 transition-transform transform hover:scale-105"
                >
                  <span
                    className={`px-3 py-1 text-sm font-bold rounded-full text-white ${
                      event.eventType === "Virtual" ? "bg-blue-500" : "bg-green-500"
                    }`}
                  >
                    {event.eventType} Event
                  </span>
                  <h3 className="text-2xl font-semibold text-gray-900 mt-4">
                    {event.eventName}
                  </h3>
                  <p className="text-gray-700 mt-2">📅 {event.eventDate}</p>
                  <p className="text-gray-700 mt-1">📍 {event.location}</p>
                  <p className="text-gray-700 mt-1">
                    👥 {event.totalParticipants} participants
                  </p>
                  <button
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full transition duration-300"
                    onClick={handleRegisterClick}
                  >
                    Register Now
                  </button>
                </div>
              ))}
            </div>
            <button
              className="text-3xl text-blue-600 hover:text-blue-800 transition duration-300 mx-2"
              onClick={() =>
                setEventIndex((eventIndex + 3) % events.length)
              }
            >
              ❯
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default EventCommunity;
