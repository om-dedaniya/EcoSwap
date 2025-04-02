

import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminEventManagement = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/admin-events");
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to load events.");
      setLoading(false);
    }
  };

  const fetchEventRegistrations = async (eventId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/event-registrations/${eventId}`);
      setSelectedEvent({ ...response.data, _id: eventId });
      setLoading(false);
    } catch (error) {
      setError("Failed to load event registrations.");
      setLoading(false);
    }
  };

  const sendMessageToParticipants = async () => {
    if (!selectedEvent || !message.trim()) {
      Swal.fire("Warning", "Please select an event and enter a message.", "warning");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/send-event-message", {
        eventName: selectedEvent.eventName, // ✅ FIX: Send eventName instead of eventId
        message,
      });

      Swal.fire("Success", "Message sent to all registered members!", "success");
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error.response ? error.response.data : error);
      Swal.fire("Error", "Failed to send the message. Try again!", "error");
    }
  };

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto px-6 py-10 space-y-6 md:space-y-0 md:space-x-6">
      {/* Sidebar for Event Selection */}
      <div className="w-full md:w-1/3 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">📅 Events</h2>
        {loading ? (
          <p className="text-gray-500">Loading events...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : events.length === 0 ? (
          <p className="text-gray-500">No events found.</p>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <button
                key={event._id}
                className={`w-full px-4 py-2 rounded-lg text-left transition ${
                  selectedEvent?._id === event._id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => fetchEventRegistrations(event._id)}
              >
                {event.eventName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Event Details Section */}
      <div className="w-full md:w-2/3 bg-white shadow-lg rounded-lg p-6">
        {selectedEvent ? (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{selectedEvent.eventName}</h2>
            <p className="text-gray-600 mb-2">📅 <strong>Date:</strong> {selectedEvent.eventDate}</p>
            <p className="text-gray-600 mb-4">📍 <strong>Location:</strong> {selectedEvent.location}</p>

            {/* Registered Participants */}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">👥 Registered Participants</h3>
            <div className="max-h-40 overflow-y-auto border rounded-lg p-3 bg-gray-100">
              {selectedEvent.participants.length === 0 ? (
                <p className="text-gray-500">No members registered.</p>
              ) : (
                <ul className="space-y-2">
                  {selectedEvent.participants.map((participant, index) => (
                    <li key={participant._id} className="text-gray-700">
                      <strong>{index + 1}.</strong> {participant.memberName} - {participant.email}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Message Box for Sending Messages */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">📢 Send Message</h3>
              <textarea
                className="w-full h-24 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all"
                onClick={sendMessageToParticipants}
              >
                Send Message
              </button>
            </div>
          </div>
        ) : (
          <h2 className="text-xl font-semibold text-gray-600">Select an event to manage</h2>
        )}
      </div>
    </div>
  );
};

export default AdminEventManagement;
