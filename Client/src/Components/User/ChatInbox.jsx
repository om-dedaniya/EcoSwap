// import { useEffect, useState, useMemo, useRef } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import debounce from "lodash.debounce";
// import { io } from "socket.io-client";
// import ErrorBoundary from "../ErrorBoundary"; // Import ErrorBoundary

// const socket = io("https://ecoswap-e24p.onrender.com");

// const ChatInbox = () => {
//   const [chats, setChats] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [userId, setUserId] = useState(null);
//   const messagesEndRef = useRef(null);

//   const navigate = useNavigate();

//   // Authenticate user and set userId
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return navigate("/login");

//     try {
//       const decoded = jwtDecode(token);
//       setUserId(decoded.id);
//     } catch (error) {
//       console.error("Invalid token", error);
//       navigate("/login");
//     }
//   }, [navigate]);

//   // Debounced search for items
//   const debouncedSearch = useMemo(
//     () =>
//       debounce(async (term, token) => {
//         try {
//           const res = await axios.get(
//             `https://ecoswap-e24p.onrender.com/api/search/items?itemName=${term}`,
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );
//           setSearchResults(res.data);
//           setErrorMessage(null);
//         } catch (err) {
//           console.error("Search failed", err);
//           if (err.response?.status === 401) {
//             setErrorMessage("Please log in to search items.");
//             navigate("/login");
//           } else {
//             setErrorMessage(
//               err.response?.data?.message ||
//                 "Failed to search items. Please try again."
//             );
//           }
//         }
//       }, 300),
//     [navigate]
//   );

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token || !searchTerm) {
//       setSearchResults([]);
//       return;
//     }

//     debouncedSearch(searchTerm, token);

//     return () => {
//       debouncedSearch.cancel();
//     };
//   }, [searchTerm, debouncedSearch]);

//   // Fetch user chats
//   const fetchChats = async () => {
//     setIsLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token || !userId) return;

//       const res = await axios.get(
//         `https://ecoswap-e24p.onrender.com/api/chats/user/${userId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setChats(res.data);
//     } catch (error) {
//       console.error("Error fetching chats:", error);
//       setErrorMessage("Failed to load chats. Please try again later.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (userId) fetchChats();
//   }, [userId]);

//   // Fetch messages for the selected chat
//   useEffect(() => {
//     if (!selectedChat) {
//       setMessages([]);
//       return;
//     }

//     const fetchMessages = async () => {
//       try {
//         const res = await axios.get(
//           `https://ecoswap-e24p.onrender.com/api/messages/${selectedChat._id}`
//         );
//         setMessages(res.data);
//         setErrorMessage(null);
//       } catch (err) {
//         console.error("Failed to fetch messages:", err);
//         setErrorMessage(
//           err.response?.data?.message ||
//             "Failed to load messages. Please try again."
//         );
//       }
//     };

//     fetchMessages();

//     // Join Socket.IO room for real-time messages
//     socket.emit("joinRoom", selectedChat._id);

//     socket.on("receiveMessage", (message) => {
//       setMessages((prev) => [...prev, message]);
//     });

//     return () => {
//       socket.emit("leaveRoom", selectedChat._id);
//       socket.off("receiveMessage");
//     };
//   }, [selectedChat]);

//   // Scroll to the latest message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Start a new chat
//   const handleStartChat = async (item) => {
//     if (!userId) return;

//     const sellerId = item.memberID._id; // Use _id from populated memberID
//     const existingChat = chats.find(
//       (chat) =>
//         (chat.buyerId?._id === userId && chat.sellerId?._id === sellerId) ||
//         (chat.sellerId?._id === userId && chat.buyerId?._id === sellerId)
//     );

//     if (existingChat) {
//       setSelectedChat(existingChat);
//       return;
//     }

//     try {
//       const res = await axios.post(
//         "https://ecoswap-e24p.onrender.com/api/chats",
//         { buyerId: userId, sellerId, itemId: item._id },
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       );

//       setChats((prev) => [...prev, res.data]);
//       setSelectedChat(res.data);
//     } catch (error) {
//       console.error("Error starting chat:", error);
//       setErrorMessage("Failed to start chat. Please try again.");
//     }
//   };

//   // Send a message
//   const sendMessage = async () => {
//     if (!newMessage.trim() || !selectedChat) return;

//     const messageData = {
//       chatId: selectedChat._id,
//       senderId: userId,
//       text: newMessage,
//     };

//     try {
//       const res = await axios.post(
//         "https://ecoswap-e24p.onrender.com/api/message",
//         messageData
//       );
//       socket.emit("sendMessage", res.data);
//       setNewMessage("");
//       setErrorMessage(null);
//     } catch (error) {
//       console.error("Failed to send message:", error);
//       setErrorMessage(
//         error.response?.data?.message ||
//           "Failed to send message. Please try again."
//       );
//     }
//   };

//   return (
//     <ErrorBoundary>
//       <div className="flex h-[90vh] bg-gray-100 overflow-hidden">
//         {/* Sidebar (Chat List) */}
//         <aside className="w-96 bg-white border-r flex flex-col">
//           {/* Search Bar */}
//           <div className="p-4 border-b">
//             <input
//               type="text"
//               className="w-full border rounded p-2 text-sm"
//               placeholder="Search items to chat with seller..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             {searchTerm && searchResults.length > 0 && (
//               <div className="mt-2 bg-white shadow-inner border rounded-md max-h-60 overflow-y-auto">
//                 {searchResults.map((item) => (
//                   <div
//                     key={item._id}
//                     className="p-2 border-b cursor-pointer hover:bg-gray-100"
//                     onClick={() => handleStartChat(item)}
//                   >
//                     <p className="font-medium text-sm">{item.itemName}</p>
//                     <p className="text-xs text-gray-500">
//                       Seller: {item.memberID?.firstName || "Unknown"}{" "}
//                       {item.memberID?.lastName || ""}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Chat List */}
//           <div className="flex-1 overflow-y-auto">
//             <h2 className="text-lg font-bold p-4">Your Chats</h2>
//             {errorMessage && (
//               <p className="text-red-500 p-2 text-sm">{errorMessage}</p>
//             )}
//             {isLoading ? (
//               <p className="text-gray-500 p-4">Loading chats...</p>
//             ) : chats.length === 0 ? (
//               <p className="text-gray-500 p-4">No chats yet.</p>
//             ) : (
//               chats.map((chat) => {
//                 const otherUser =
//                   chat.buyerId?._id === userId ? chat.sellerId : chat.buyerId;
//                 const firstInitial = otherUser?.firstName?.[0] || "?";
//                 const fullName = `${otherUser?.firstName || "Unknown"} ${
//                   otherUser?.lastName || ""
//                 }`;

//                 return (
//                   <div
//                     key={chat._id}
//                     onClick={() => setSelectedChat(chat)}
//                     className={`p-4 cursor-pointer border-b hover:bg-gray-100 ${
//                       selectedChat?._id === chat._id ? "bg-gray-200" : ""
//                     }`}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-full bg-green-500 text-white font-bold flex items-center justify-center">
//                         {firstInitial}
//                       </div>
//                       <div className="flex-1">
//                         <h4 className="font-semibold text-sm">{fullName}</h4>
//                         <p className="text-xs text-gray-500 truncate">
//                           {chat.lastMessage || "No messages yet"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </aside>

//         {/* Chat Area */}
//         <section className="flex-1 flex flex-col bg-white">
//           {selectedChat ? (
//             <>
//               {/* Chat Header */}
//               <div className="p-4 border-b bg-gray-50 flex items-center">
//                 <div className="w-10 h-10 rounded-full bg-green-500 text-white font-bold flex items-center justify-center">
//                   {(selectedChat.buyerId?._id === userId
//                     ? selectedChat.sellerId?.firstName
//                     : selectedChat.buyerId?.firstName)?.[0] || "?"}
//                 </div>
//                 <h2 className="ml-3 text-lg font-semibold">
//                   {selectedChat.buyerId?._id === userId
//                     ? selectedChat.sellerId?.firstName
//                     : selectedChat.buyerId?.firstName}{" "}
//                   {selectedChat.buyerId?._id === userId
//                     ? selectedChat.sellerId?.lastName
//                     : selectedChat.buyerId?.lastName}
//                 </h2>
//               </div>

//               {/* Messages */}
//               <div className="flex-1 overflow-y-auto p-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
//                 {messages.map((msg, idx) => (
//                   <div
//                     key={idx}
//                     className={`my-2 max-w-[70%] p-3 rounded-lg ${
//                       msg.senderId === userId
//                         ? "ml-auto bg-green-100 text-right"
//                         : "mr-auto bg-white text-left shadow"
//                     }`}
//                   >
//                     <p className="text-sm">{msg.text}</p>
//                     <small className="text-gray-500 text-xs">
//                       {new Date(msg.timestamp).toLocaleTimeString()}
//                     </small>
//                   </div>
//                 ))}
//                 <div ref={messagesEndRef}></div>
//               </div>

//               {/* Message Input */}
//               <div className="p-4 border-t flex gap-2">
//                 <input
//                   type="text"
//                   className="flex-grow border rounded p-2 text-sm"
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   placeholder="Type a message..."
//                   onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//                 />
//                 <button
//                   onClick={sendMessage}
//                   className="bg-green-500 text-white px-4 py-2 rounded"
//                 >
//                   Send
//                 </button>
//               </div>
//             </>
//           ) : (
//             <div className="flex flex-col justify-center items-center h-full text-center text-gray-400">
//               <img
//                 src="https://cdn-icons-png.flaticon.com/512/4076/4076501.png"
//                 alt="Chat Illustration"
//                 className="w-32 mb-4"
//               />
//               <h3 className="text-xl font-bold">
//                 Select a chat to start messaging
//               </h3>
//               <p className="text-sm mt-2">
//                 Your conversations will appear here.
//               </p>
//             </div>
//           )}
//         </section>
//       </div>
//     </ErrorBoundary>
//   );
// };

// export default ChatInbox;

import { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import debounce from "lodash.debounce";
import { io } from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import ErrorBoundary from "../ErrorBoundary";
import { motion, AnimatePresence } from "framer-motion";

const socket = io("https://ecoswap-e24p.onrender.com");

const ChatInbox = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesContainerRef = useRef(null);
  const navigate = useNavigate();

  // Authenticate user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    } catch (error) {
      console.error("Invalid token", error);
      navigate("/login");
    }
  }, [navigate]);

  // Debounced search
  const debouncedSearch = useMemo(
    () =>
      debounce(async (term, token) => {
        try {
          const res = await axios.get(
            `https://ecoswap-e24p.onrender.com/api/search/items?itemName=${term}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setSearchResults(res.data);
          setErrorMessage(null);
        } catch (err) {
          console.error("Search failed", err);
          if (err.response?.status === 401) {
            setErrorMessage("Please log in to search items.");
            navigate("/login");
          } else {
            setErrorMessage(
              err.response?.data?.message ||
                "Failed to search items. Please try again."
            );
          }
        }
      }, 300),
    [navigate]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !searchTerm) {
      setSearchResults([]);
      return;
    }

    debouncedSearch(searchTerm, token);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  // Fetch chats
  const fetchChats = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token || !userId) return;

      const res = await axios.get(
        `https://ecoswap-e24p.onrender.com/api/chats/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setChats(res.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
      setErrorMessage("Failed to load chats. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchChats();
  }, [userId]);

  // Fetch messages
  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `https://ecoswap-e24p.onrender.com/api/messages/${selectedChat._id}`
        );
        setMessages(res.data);
        setErrorMessage(null);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setErrorMessage(
          err.response?.data?.message ||
            "Failed to load messages. Please try again."
        );
      }
    };

    fetchMessages();
    socket.emit("joinRoom", selectedChat._id);
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.emit("leaveRoom", selectedChat._id);
      socket.off("receiveMessage");
    };
  }, [selectedChat]);

  // Smooth scroll to latest message
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Start new chat
  const handleStartChat = async (item) => {
    if (!userId) return;

    const sellerId = item.memberID._id;
    const existingChat = chats.find(
      (chat) =>
        (chat.buyerId?._id === userId && chat.sellerId?._id === sellerId) ||
        (chat.sellerId?._id === userId && chat.buyerId?._id === sellerId)
    );

    if (existingChat) {
      setSelectedChat(existingChat);
      return;
    }

    try {
      const res = await axios.post(
        "https://ecoswap-e24p.onrender.com/api/chats",
        { buyerId: userId, sellerId, itemId: item._id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setChats((prev) => [...prev, res.data]);
      setSelectedChat(res.data);
    } catch (error) {
      console.error("Error starting chat:", error);
      setErrorMessage("Failed to start chat. Please try again.");
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!selectedChat || !newMessage.trim()) return;

    const messageData = {
      chatId: selectedChat._id,
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
      setShowEmojiPicker(false);
      setErrorMessage(null);
    } catch (error) {
      console.error("Failed to send message:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to send message. Please try again."
      );
    }
  };

  // Handle emoji selection
  const onEmojiClick = (emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
  };

  // Emoji and text rendering with animation
  const MessageContent = ({ text }) => {
    // Split text into emoji and non-emoji segments
    const segments = [];
    let currentSegment = "";
    let isEmojiSegment = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const isEmoji = /^[\p{Emoji}]/u.test(char);

      if (isEmoji !== isEmojiSegment && currentSegment) {
        segments.push({ text: currentSegment, isEmoji: isEmojiSegment });
        currentSegment = "";
      }

      currentSegment += char;
      isEmojiSegment = isEmoji;
    }

    if (currentSegment) {
      segments.push({ text: currentSegment, isEmoji: isEmojiSegment });
    }

    return (
      <>
        {segments.map((segment, index) => (
          <motion.span
            key={index}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 10,
              delay: index * 0.05,
            }}
            className={`inline-block ${
              segment.isEmoji
                ? "text-2xl hover:scale-125 transition-transform"
                : ""
            }`}
          >
            {segment.text}
          </motion.span>
        ))}
      </>
    );
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gradient-to-br from-[#F5F3EB] to-[#E8E2D9] text-gray-900 font-sans overflow-hidden">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-80 bg-[#2E7D32] text-white flex flex-col shadow-2xl rounded-r-2xl"
        >
          <div className="p-4 border-b border-[#4CAF50]/50">
            <input
              type="text"
              className="w-full bg-[#4CAF50]/20 border border-[#4CAF50] rounded-lg p-2 text-sm text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8BC34A] transition-all duration-300"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <AnimatePresence>
              {searchTerm && searchResults.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-2 bg-[#4CAF50]/20 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  {searchResults.map((item) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 border-b border-[#4CAF50]/50 cursor-pointer hover:bg-[#4CAF50]/30 transition-all duration-200"
                      onClick={() => handleStartChat(item)}
                    >
                      <p className="text-sm font-medium">{item.itemName}</p>
                      <p className="text-xs text-gray-200">
                        Seller: {item.memberID?.firstName || "Unknown"}{" "}
                        {item.memberID?.lastName || ""}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex-1 overflow-y-auto">
            <h2 className="text-lg font-bold p-4">Chats</h2>
            {errorMessage && (
              <p className="text-[#EF5350] p-2 text-sm">{errorMessage}</p>
            )}
            {isLoading ? (
              <p className="text-gray-200 p-4">Loading...</p>
            ) : chats.length === 0 ? (
              <p className="text-gray-200 p-4">No chats yet.</p>
            ) : (
              chats.map((chat, index) => {
                const otherUser =
                  chat.buyerId?._id === userId ? chat.sellerId : chat.buyerId;
                const firstInitial = otherUser?.firstName?.[0] || "?";
                const fullName = `${otherUser?.firstName || "Unknown"} ${
                  otherUser?.lastName || ""
                }`;

                return (
                  <motion.div
                    key={chat._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    onClick={() => setSelectedChat(chat)}
                    className={`p-4 cursor-pointer border-b border-[#4CAF50]/50 hover:bg-[#4CAF50]/30 transition-all duration-200 ${
                      selectedChat?._id === chat._id ? "bg-[#4CAF50]/30" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-full bg-[#8BC34A] text-white font-bold flex items-center justify-center shadow-md"
                      >
                        {firstInitial}
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold">{fullName}</h4>
                        <p className="text-xs text-gray-200 truncate">
                          {chat.lastMessage || "No messages yet"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.aside>

        {/* Chat Area */}
        <section className="flex-1 flex flex-col relative">
          <AnimatePresence>
            {selectedChat ? (
              <motion.div
                key="chat"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col h-full"
              >
                {/* Chat Header */}
                <div className="p-4 bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] text-white border-b border-[#388E3C]/50 flex items-center backdrop-blur-sm shadow-md">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full bg-[#8BC34A] text-white font-bold flex items-center justify-center shadow-md"
                  >
                    {(selectedChat.buyerId?._id === userId
                      ? selectedChat.sellerId?.firstName
                      : selectedChat.buyerId?.firstName)?.[0] || "?"}
                  </motion.div>
                  <h2 className="ml-3 text-lg font-semibold">
                    {selectedChat.buyerId?._id === userId
                      ? selectedChat.sellerId?.firstName
                      : selectedChat.buyerId?.firstName}{" "}
                    {selectedChat.buyerId?._id === userId
                      ? selectedChat.sellerId?.lastName
                      : selectedChat.buyerId?.lastName}
                  </h2>
                </div>

                {/* Messages */}
                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-4 bg-[#F5F3EB] bg-opacity-80 bg-[url('https://www.transparenttextures.com/patterns/light-paper-fibers.png')] bg-repeat"
                >
                  <div className="flex flex-col gap-3">
                    {messages.length === 0 && errorMessage ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-[#EF5350] font-medium"
                      >
                        {errorMessage}
                      </motion.div>
                    ) : (
                      messages.map((msg, idx) => (
                        <motion.div
                          key={idx}
                          initial={{
                            opacity: 0,
                            x: msg.senderId === userId ? 50 : -50,
                          }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.3,
                            type: "spring",
                            stiffness: 100,
                          }}
                          className={`max-w-[70%] p-3 rounded-2xl shadow-lg ${
                            msg.senderId === userId
                              ? "ml-auto bg-[#8BC34A] text-white"
                              : "mr-auto bg-white/95 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">
                            <MessageContent text={msg.text} />
                          </p>
                          <small className="text-xs opacity-70">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </small>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 bg-[#4CAF50] border-t border-[#388E3C] flex items-center gap-2 relative shadow-inner">
                  <motion.button
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="text-2xl"
                  >
                    😊
                  </motion.button>
                  <AnimatePresence>
                    {showEmojiPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.3, type: "spring" }}
                        className="absolute bottom-16 left-4 z-10 shadow-xl"
                      >
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input
                    type="text"
                    className="flex-grow bg-[#F5F3EB] border border-[#388E3C] rounded-lg p-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8BC34A] transition-all duration-300"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => sendMessage()}
                    className="bg-[#8BC34A] text-white px-4 py-2 rounded-lg hover:bg-[#689F38] transition-all duration-300 shadow-md"
                  >
                    Send
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="no-chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col justify-center items-center h-full text-gray-500 bg-[#F5F3EB]"
              >
                <motion.img
                  src="https://cdn-icons-png.flaticon.com/512/4076/4076501.png"
                  alt="Chat Illustration"
                  className="w-32 mb-4"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
                <h3 className="text-xl font-bold">Select a chat</h3>
                <p className="text-sm mt-2">
                  Your conversations will appear here.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </ErrorBoundary>
  );
};

export default ChatInbox;
