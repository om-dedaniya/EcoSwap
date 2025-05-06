import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { FaPaperPlane } from "react-icons/fa";

const socket = io("https://ecoswap-e24p.onrender.com");

const AdminQuery = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [response, setResponse] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchUsers();
    socket.on("receiveMessage", (newMessage) => {
      if (selectedUser === newMessage.userEmail) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });
    return () => socket.off("receiveMessage");
  }, [selectedUser]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://ecoswap-e24p.onrender.com/queries/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchMessages = async (userEmail) => {
    setSelectedUser(userEmail);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://ecoswap-e24p.onrender.com/queries/${userEmail}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendResponse = async () => {
    if (!response.trim() || !selectedUser) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `https://ecoswap-e24p.onrender.com/queries/${selectedUser}`,
        { response },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(res.data.messages);
      socket.emit("sendResponse", { email: selectedUser, response });
      setResponse("");
    } catch (error) {
      console.error("Error sending response:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-6">
      {/* Sidebar - User List */}
      <div className="w-full md:w-1/3 bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">📬 Users</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {users.length === 0 ? (
            <p className="text-gray-500">No queries raised yet.</p>
          ) : (
            users.map((user) => (
              <button
                key={user.userEmail}
                className={`w-full px-4 py-2 rounded-lg text-left transition ${
                  selectedUser === user.userEmail
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => fetchMessages(user.userEmail)}
              >
                {user.userName} ({user.userEmail})
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Box */}
      <div className="w-full md:w-2/3 bg-white shadow-lg rounded-lg p-6 flex flex-col">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          💬 Messages
        </h3>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto max-h-96 bg-gray-100 rounded-lg p-4">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">
              Select a user to view messages.
            </p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "admin" ? "justify-end" : "justify-start"
                } mb-3`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-sm ${
                    msg.sender === "admin"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-800"
                  }`}
                >
                  <span className="block font-semibold">
                    {msg.sender === "admin" ? "Admin" : "User"}
                  </span>
                  <p>{msg.message}</p>
                  <span className="text-xs opacity-75 block mt-1">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Section */}
        {selectedUser && (
          <div className="flex items-center mt-4">
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your response..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
            />
            <button
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-all"
              onClick={sendResponse}
            >
              <FaPaperPlane />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQuery;
