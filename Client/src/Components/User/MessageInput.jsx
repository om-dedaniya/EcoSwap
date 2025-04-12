// components/User/MessageInput.js
import React, { useState } from "react";
import axios from "axios";
import socket from "../../socket";

const MessageInput = ({ chatId, setMessages }) => {
  const [text, setText] = useState("");
  const senderId = localStorage.getItem("userId");

  const sendMessage = async () => {
    if (!text.trim()) return;
    const res = await axios.post("/api/message", {
      chatId,
      senderId,
      text,
    });

    socket.emit("sendMessage", { chatId, senderId, text });
    setMessages((prev) => [...prev, res.data]);
    setText("");
  };

  return (
    <div className="p-2 border-t flex items-center">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border rounded-lg px-4 py-2 mr-2"
        placeholder="Type a message..."
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
