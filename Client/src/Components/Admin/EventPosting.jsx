import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const EventPosting = () => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("Virtual");
  const [location, setLocation] = useState("");
  const [totalParticipants, setTotalParticipants] = useState("");
  const [events, setEvents] = useState([]);
  const [editEventId, setEditEventId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin-events");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventData = {
      eventName,
      eventDate,
      eventType,
      location: eventType === "Physical" ? location : "Virtual Event",
      totalParticipants,
    };

    try {
      if (editEventId) {
        await axios.put(`http://localhost:5000/api/events/${editEventId}`, eventData);
        Swal.fire("Success!", "Event updated successfully!", "success");
        setEditEventId(null);
      } else {
        await axios.post("http://localhost:5000/api/events", eventData);
        Swal.fire("Success!", "Event posted successfully!", "success");
      }
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error("Error posting event:", error);
      Swal.fire("Error!", "Failed to post event.", "error");
    }
  };

  const resetForm = () => {
    setEventName("");
    setEventDate("");
    setEventType("Virtual");
    setLocation("");
    setTotalParticipants("");
  };

  const handleEdit = (event) => {
    setEventName(event.eventName);
    setEventDate(event.eventDate);
    setEventType(event.eventType);
    setLocation(event.location !== "Virtual Event" ? event.location : "");
    setTotalParticipants(event.totalParticipants);
    setEditEventId(event._id);
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
          await axios.delete(`http://localhost:5000/api/events/${id}`);
          Swal.fire("Deleted!", "The event has been removed.", "success");
          fetchEvents();
        } catch (error) {
          console.error("Error deleting event:", error);
        }
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        {editEventId ? "Edit Event" : "Post a New Event"}
      </h2>

      {/* Event Form */}
      <form onSubmit={handleSubmit} className="bg-white bg-opacity-80 shadow-xl backdrop-blur-lg rounded-lg p-6 mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Event Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter event name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Event Date</label>
          <input
            type="date"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Event Type</label>
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            <option value="Virtual">Virtual</option>
            <option value="Physical">Physical</option>
          </select>
        </div>

        {eventType === "Physical" && (
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Location</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Total Participants</label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter number of participants"
            value={totalParticipants}
            onChange={(e) => setTotalParticipants(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all"
        >
          {editEventId ? "Update Event" : "Post Event"}
        </button>
      </form>

      {/* Event List */}
      <div className="bg-white shadow-xl rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Events</h3>

        <ul className="divide-y divide-gray-300">
          {events.length > 0 ? (
            events.map((event) => (
              <li key={event._id} className="flex justify-between items-center py-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-800">{event.eventName}</h4>
                  <p className="text-gray-600 text-sm">
                    {event.eventDate} | {event.eventType} | {event.location} | {event.totalParticipants} Participants
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all"
                    onClick={() => handleEdit(event)}
                  >
                    ✏ Edit
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                    onClick={() => handleDelete(event._id)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-center">No events posted yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default EventPosting;
