import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { FaPaperPlane } from "react-icons/fa"; // Send icon

const socket = io("https://ecoswap-e24p.onrender.com");

const UserQuery = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user?.email) {
      console.error("User  not logged in");
      return;
    }

    socket.emit("registerUser ", user.email);
    fetchQueries();

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchQueries = async () => {
    try {
      const response = await axios.get(
        `https://ecoswap-e24p.onrender.com/queries/${user.email}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching queries:", error);
    }
  };

  const sendMessage = async () => {
    if (message.trim() === "") return;

    try {
      const newQuery = { email: user.email, message };
      await axios.post("https://ecoswap-e24p.onrender.com/queries", newQuery, {
        headers: { Authorization: `Bearer ${token}` },
      });

      socket.emit("sendMessage", newQuery);
      setMessages((prev) => [...prev, { sender: "user", message }]);
      setMessage("");
    } catch (error) {
      console.error("Error sending query:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto p-4 bg-green-50 rounded-lg shadow-lg">
      <div className="bg-green-600 text-white text-2xl font-bold text-center py-2 rounded-t-lg">
        Admin
      </div>

      <div className="flex-grow p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">
            No messages yet. Start a conversation!
          </p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col mb-4 ${
                msg.sender === "admin" ? "items-start" : "items-end"
              }`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg shadow-md transition-all duration-300 ${
                  msg.sender === "admin"
                    ? "bg-green-600 text-white"
                    : "bg-blue-400 text-white"
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <span className="text-xs text-gray-200">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex items-center p-2 border-t border-gray-300 bg-white">
        <input
          type="text"
          className="flex-grow p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Type your query..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="ml-2 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition duration-200"
          onClick={sendMessage}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default UserQuery;
