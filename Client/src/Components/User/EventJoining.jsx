

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const EventJoining = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logged-in user using token
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  // Fetch events from database
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user-events");
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch events.");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle event registration
  const handleRegister = async (event) => {
    if (!user) {
      Swal.fire("Error", "You are not logged in!", "error");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to register for the event: ${event.eventName}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Register",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const registrationData = {
            eventName: event.eventName,
            eventDate: event.eventDate,
            eventLocation: event.location,
            memberName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
            email: user?.email,
            mobile: user?.mobile || "N/A",
          };

          await axios.post("http://localhost:5000/api/join-event", registrationData);

          Swal.fire(
            "Success!",
            "You have successfully registered for the event.<br /> For more details, check your registration details. If the event is virtual, you will receive full details via email a day before the event.",
            "success"
          );
        } catch (error) {
          if (error.response && error.response.status === 400) {
            Swal.fire("Error", error.response.data.message, "error");
          } else {
            Swal.fire("Error", "Failed to register for the event. Try again!", "error");
          }
        }
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white border border-green-800 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📅 Upcoming Events</h2>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : events.length === 0 ? (
        <p className="text-gray-500 text-center">No upcoming events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="relative bg-white p-5 rounded-lg shadow-md border border-gray-200 transition-transform transform hover:-translate-y-2 hover:shadow-lg group"
            >
              <h3 className="text-xl font-semibold text-blue-600">{event.eventName}</h3>
              <p className="text-gray-700">📅 <b>Date:</b> {event.eventDate}</p>
              <p className="text-gray-700">📍 <b>Location:</b> {event.location}</p>
              <p className="text-gray-700">👥 <b>Participants:</b> {event.totalParticipants}</p>
              <button
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 w-full"
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

// Loader Component
const Loader = () => (
  <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
);

export default EventJoining;
