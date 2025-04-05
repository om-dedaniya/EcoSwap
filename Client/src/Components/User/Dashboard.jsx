import React, { useEffect, useState } from "react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaBars, FaTimes, FaUser, FaClipboardList, FaSearch, FaBullhorn, FaUsers,
  FaCalendarAlt, FaProjectDiagram, FaEnvelope, FaQuestionCircle, FaSignOutAlt
} from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Logout!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    });
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-white w-72 p-5 border-r shadow-md fixed h-full transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-72"} md:relative md:translate-x-0`}>
        {/* Sidebar Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-700">Dashboard</h1>
          <button className="md:hidden text-gray-600" onClick={() => setSidebarOpen(false)}>
            <FaTimes size={20} />
          </button>
        </div>

        {/* User Profile */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 text-white text-2xl font-bold">
            {getInitials(user?.name)}
          </div>
          <h3 className="text-lg font-semibold mt-2">{user?.name || "Loading..."}</h3>
          <p className="text-sm text-gray-600">{user?.email || "Loading..."}</p>
          <span className="bg-green-500 text-white text-xs rounded-full px-3 py-1 inline-block mt-2">
            {user?.role || "Loading..."}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-3">
          {[
            { to: "/dashboard/personal-info", label: "Personal Info", icon: FaUser },
            { to: "/dashboard/itemlist", label: "List Item", icon: FaClipboardList },
            { to: "/dashboard/user-listed-item", label: "Your Listed Item", icon: FaClipboardList },
            { to: "/dashboard/itemsearch", label: "Find Item", icon: FaSearch },
            { to: "/dashboard/announcement", label: "Announcements", icon: FaBullhorn },
            { to: "/dashboard/communitylist", label: "Community", icon: FaUsers },
            { to: "/dashboard/eventjoin", label: "Events", icon: FaCalendarAlt },
            { to: "/dashboard/projects", label: "Projects", icon: FaProjectDiagram },
            { to: "/dashboard/chat", label: "Messages", icon: FaEnvelope },
            { to: "/dashboard/query", label: "Raise Query", icon: FaQuestionCircle },
          ].map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center px-4 py-3 rounded-md transition ${
                location.pathname === to
                  ? "bg-green-500 text-white"
                  : "text-gray-700 hover:bg-green-100"
              }`}
            >
              <Icon className="mr-3" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center mt-6 bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-white ml-72 md:ml-0">
        {/* Mobile Sidebar Toggle */}
        <button className="md:hidden mb-4 text-gray-600" onClick={() => setSidebarOpen(true)}>
          <FaBars size={24} />
        </button>

        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
