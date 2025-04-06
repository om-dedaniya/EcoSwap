import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { CalendarDays, MapPin, Users } from "lucide-react";

const EventJoining = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await axios.get("http://localhost:5000/user", {
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
        const res = await axios.get("http://localhost:5000/api/user-events");
        setEvents(res.data);
      } catch (err) {
        setError("Failed to fetch events.");
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

        await axios.post("http://localhost:5000/api/join-event", data);

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

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        📅 Upcoming Events
      </h2>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : events.length === 0 ? (
        <p className="text-center text-gray-500">No upcoming events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white border border-gray-200 rounded-2xl shadow-md p-6"
            >
              <h3 className="text-xl font-semibold text-blue-700 mb-2">{event.eventName}</h3>
              <div className="flex items-center text-gray-700 mb-1">
                <CalendarDays className="w-5 h-5 mr-2 text-gray-500" />
                <span>{new Date(event.eventDate).toDateString()}</span>
              </div>
              <div className="flex items-center text-gray-700 mb-1">
                <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center text-gray-700 mb-4">
                <Users className="w-5 h-5 mr-2 text-gray-500" />
                <span>{event.totalParticipants} Participants</span>
              </div>
              <button
                className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg w-full hover:bg-blue-700 transition"
                onClick={() => handleRegister(event)}
              >
                Register
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Loader = () => (
  <div className="flex justify-center items-center h-48">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default EventJoining;
