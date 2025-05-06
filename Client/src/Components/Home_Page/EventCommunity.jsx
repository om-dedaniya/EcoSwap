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
        const response = await axios.get(
          "https://ecoswap-e24p.onrender.com/api/user-events"
        );
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
    if (array.length <= 3) return array; // No cycling if less than or equal to 3 events
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
    <div className=" bg-gradient-to-br from-green-100 via-white to-green-50 py-20 px-6 md:px-12">
      <section>
        <h2 className="text-5xl font-extrabold text-center text-green-800 mb-6 tracking-tight">
          🌍 Community Events
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg max-w-2xl mx-auto">
          Discover exciting eco-friendly events and initiatives in your
          community!
        </p>

        {loading ? (
          <p className="text-center text-gray-600 text-lg">Loading events...</p>
        ) : error ? (
          <p className="text-center text-red-500 text-lg">{error}</p>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No upcoming events found.
          </p>
        ) : (
          <div className="flex items-center justify-center">
            {/* Prev Button */}
            {events.length > 3 && (
              <button
                className="text-4xl text-green-700 hover:text-green-900 transition duration-300 mx-4"
                onClick={() =>
                  setEventIndex(
                    (eventIndex - 3 + events.length) % events.length
                  )
                }
              >
                ❮
              </button>
            )}

            {/* Events Grid */}
            <div
              className={`grid grid-cols-1 ${
                events.length >= 2 ? "md:grid-cols-3" : ""
              } gap-10 w-full max-w-7xl`}
            >
              {cycleArray(events, eventIndex).map((event) => (
                <div
                  key={event._id}
                  className="bg-white bg-opacity-70 backdrop-blur-lg rounded-2xl p-6 shadow-xl transition-transform transform hover:scale-105 border border-green-100"
                >
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${
                      event.eventType === "Virtual"
                        ? "bg-blue-500"
                        : "bg-green-500"
                    }`}
                  >
                    {event.eventType} Event
                  </span>
                  <h3 className="mt-4 text-2xl font-bold text-gray-900 leading-snug">
                    {event.eventName}
                  </h3>
                  <ul className="mt-3 text-sm text-gray-700 space-y-1">
                    <li>
                      📅 <strong>Date:</strong> {event.eventDate}
                    </li>
                    <li>
                      📍 <strong>Location:</strong> {event.location}
                    </li>
                    <li>
                      👥 <strong>Participants:</strong>{" "}
                      {event.totalParticipants}
                    </li>
                  </ul>
                  <button
                    className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-full transition duration-300"
                    onClick={handleRegisterClick}
                  >
                    Register Now
                  </button>
                </div>
              ))}
            </div>

            {/* Next Button */}
            {events.length > 3 && (
              <button
                className="text-4xl text-green-700 hover:text-green-900 transition duration-300 mx-4"
                onClick={() => setEventIndex((eventIndex + 3) % events.length)}
              >
                ❯
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default EventCommunity;
