// components/User/ChatWindow.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useChat } from "../../context/ChatContext";
import MessageInput from "./MessageInput";

const ChatWindow = () => {
  const { selectedChat } = useChat();
  const [messages, setMessages] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!selectedChat) return;
    const fetchMessages = async () => {
      const res = await axios.get(`/api/messages/${selectedChat._id}`);
      setMessages(res.data);
    };
    fetchMessages();
  }, [selectedChat]);

  if (!selectedChat) {
    return (
      <div className="w-full flex items-center justify-center text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex mb-2 ${
              msg.sender === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div className="px-4 py-2 rounded-lg bg-blue-100 max-w-xs">
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <MessageInput chatId={selectedChat._id} setMessages={setMessages} />
    </div>
  );
};

export default ChatWindow;
