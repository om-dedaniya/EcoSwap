import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("https://ecoswap-e24p.onrender.com");

export default function ChatPage() {
  const { chatId, userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit("joinRoom", chatId);

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.emit("leaveRoom", chatId);
      socket.off("receiveMessage");
    };
  }, [chatId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `https://ecoswap-e24p.onrender.com/api/messages/${chatId}`
        );
        setMessages(res.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load messages. Please try again."
        );
      }
    };
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      chatId,
      senderId: userId,
      text: newMessage,
    };

    try {
      const res = await axios.post(
        "https://ecoswap-e24p.onrender.com/api/message",
        messageData
      );
      socket.emit("sendMessage", res.data);
      setNewMessage("");
      setError(null);
    } catch (error) {
      console.error("Failed to send message:", error);
      setError(
        error.response?.data?.message ||
          "Failed to send message. Please try again."
      );
    }
  };

  return (
    <div className="flex flex-col h-[90vh] p-4">
      <h2 className="text-xl font-bold mb-4">Chat</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="flex-1 overflow-y-auto border rounded p-4 bg-white shadow">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`my-2 max-w-[70%] p-3 rounded-md ${
              msg.senderId === userId
                ? "ml-auto bg-blue-100 text-right"
                : "mr-auto bg-gray-100 text-left"
            }`}
          >
            <p>{msg.text}</p>
            <small className="text-gray-500 text-xs">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </small>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="flex mt-4 gap-2">
        <input
          type="text"
          className="flex-grow border rounded p-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
