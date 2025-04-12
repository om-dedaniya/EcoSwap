// components/User/ChatList.js
import React, { useEffect } from "react";
import axios from "axios";
import { useChat } from "../../context/ChatContext";

const ChatList = () => {
  const { chats, setChats, setSelectedChat } = useChat();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`/api/chats/${userId}`);
        setChats(res.data);
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };
    fetchChats();
  }, [userId, setChats]);

  return (
    <div className="w-full h-full overflow-y-auto bg-white border-r">
      <h2 className="text-xl font-bold p-4">Messages</h2>
      {chats.length > 0 ? (
        chats.map((chat) => {
          const other =
            chat.buyerId._id === userId ? chat.sellerId : chat.buyerId;
          return (
            <div
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              className="p-4 hover:bg-gray-100 cursor-pointer border-b"
            >
              <p className="font-semibold">
                {other.firstName} {other.lastName}
              </p>
              <p className="text-gray-500 text-sm truncate">
                {chat.lastMessage || "No messages yet"}
              </p>
            </div>
          );
        })
      ) : (
        <p className="p-4 text-gray-500">No chats available.</p>
      )}
    </div>
  );
};

export default ChatList;
