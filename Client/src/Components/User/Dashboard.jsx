import React, { useEffect, useState } from "react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaClipboardList,
  FaSearch,
  FaBullhorn,
  FaUsers,
  FaCalendarAlt,
  FaProjectDiagram,
  FaCommentDots,
  FaEnvelope,
  FaQuestionCircle,
  FaSignOutAlt,
  FaMoon,
  FaSun,
} from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "https://ecoswap-e24p.onrender.com/user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  useEffect(() => {
    // Apply dark mode class to the document root
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#3b82f6",
      confirmButtonText: "Yes, Logout!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("");
  };

  return (
    <div
      className={`flex max-h-screen ${
        isDarkMode ? "dark bg-gray-900" : "bg-gray-100"
      } relative font-inter transition-colors duration-300`}
    >
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-10 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 sm:w-72 p-4 sm:p-5 fixed h-full  transition-transform duration-300 z-20
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
    md:relative md:translate-x-0 backdrop-blur-lg bg-white/90 dark:bg-gray-800/30
    border-r border-gray-200/50 dark:border-gray-700/50 shadow-lg
    overflow-y-auto md:overflow-y-visible`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">
            Dashboard
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>
            <button
              className="md:hidden text-gray-600 dark:text-gray-300"
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className="text-center mb-4 sm:mb-6 relative group">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br from-teal-400 to-blue-500 text-white text-xl sm:text-2xl font-bold transform group-hover:scale-105 transition-transform duration-300">
            {getInitials(user?.name)}
          </div>
          <h3 className="text-base sm:text-lg font-semibold mt-2 truncate text-gray-800 dark:text-gray-100">
            {user?.name || "Loading..."}
          </h3>
          <p className="text-xs sm:text-sm text-white dark:text-gray-400 truncate">
            {user?.email || "Loading..."}
          </p>
          <span className="bg-green-500 text-white text-xs rounded-full px-2 sm:px-3 py-1 inline-block mt-2">
            {user?.role || "Loading..."}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2 sm:space-y-3">
          {[
            {
              to: "/dashboard/personal-info",
              label: "Personal Info",
              icon: FaUser,
            },
            {
              to: "/dashboard/itemlist",
              label: "List Item",
              icon: FaClipboardList,
            },
            { to: "/dashboard/itemsearch", label: "Find Item", icon: FaSearch },
            {
              to: "/dashboard/user-listed-item",
              label: "Your Listed Item",
              icon: FaClipboardList,
            },
            {
              to: "/dashboard/announcement",
              label: "Announcements",
              icon: FaBullhorn,
            },
            { to: "/dashboard/review", label: "Review", icon: FaCommentDots },
            {
              to: "/dashboard/eventjoin",
              label: "Events",
              icon: FaCalendarAlt,
            },

            { to: "/dashboard/chat", label: "Messages", icon: FaEnvelope },
            // {
            //   to: "/dashboard/query",
            //   label: "Raise Query",
            //   icon: FaQuestionCircle,
            // },
          ].map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-sm sm:text-base transition-all duration-200 ${
                location.pathname === to
                  ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-md"
                  : "text-gray-800 dark:text-gray-100 hover:bg-teal-100 dark:hover:bg-gray-700/50"
              } transform hover:scale-105`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="mr-2 sm:mr-3 transform group-hover:rotate-12 transition-transform" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center mt-4 sm:mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 sm:py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105 text-sm sm:text-base shadow-md"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 p-4 sm:p-6 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } transition-all duration-300 ${
          isSidebarOpen ? "ml-64 sm:ml-72" : "ml-0"
        } md:ml-0`}
      >
        {/* Mobile Sidebar Toggle */}
        <button
          className="md:hidden mb-4 text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          onClick={() => setSidebarOpen(true)}
        >
          <FaBars size={24} />
        </button>

        {/* Pass theme props to child routes */}
        <Outlet context={{ isDarkMode, toggleDarkMode }} />
      </div>

      {/* Inline Styles for Wave Background */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          .font-inter { font-family: 'Inter', sans-serif; }
          aside::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 200px;
            background: linear-gradient(180deg, rgba(255,255,255,0.1), transparent);
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='url(%23grad)' fill-opacity='1' d='M0,192L48,186.7C96,181,192,171,288,186.7C384,203,480,245,576,245.3C672,245,768,203,864,181.3C960,160,1056,160,1152,176C1248,192,1344,224,1392,240L1440,256L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z'%3E%3C/path%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%2300BCD4;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%233F51B5;stop-opacity:1'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E");
            background-size: cover;
            z-index: -1;
          }
          .dark aside::before {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='rgba(0,0,0,0.2)' fill-opacity='1' d='M0,192L48,186.7C96,181,192,171,288,186.7C384,203,480,245,576,245.3C672,245,768,203,864,181.3C960,160,1056,160,1152,176C1248,192,1344,224,1392,240L1440,256L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z'%3E%3C/path%3E%3C/svg%3E");
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;
