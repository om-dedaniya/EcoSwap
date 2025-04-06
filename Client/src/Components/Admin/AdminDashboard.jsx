// import React, { useState, useEffect } from "react";
// import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from "recharts";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUsers, faExchangeAlt, faListAlt, faObjectGroup, faCogs, faBullhorn, faSignOutAlt, faTachometerAlt,
// } from "@fortawesome/free-solid-svg-icons";
// import axios from "axios";
// import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
// import Swal from "sweetalert2";

// const sidebarItems = [
//   { icon: faTachometerAlt, label: "Dashboard", path: "/admin" },
//   { icon: faUsers, label: "Users", path: "/admin/user" },
//   { icon: faExchangeAlt, label: "Swaps", path: "/admin/itemshow" },
//   { icon: faListAlt, label: "Events", path: "/admin/eventpost" },
//   { icon: faListAlt, label: "Manage Event", path: "/admin/eventmanage" },
//   { icon: faListAlt, label: "Community", path: "/admin/admincommunity" },
//   { icon: faObjectGroup, label: "Categories", path: "/admin/category" },
//   { icon: faCogs, label: "Blog", path: "/admin/blogpost" },
//   { icon: faBullhorn, label: "Announcement", path: "/admin/adminannouncement" },
//   { icon: faListAlt, label: "Complaints", path: "/admin/userquery" },
//   { icon: faUsers, label: "Manage Admin", path: "/admin/manage-admin" },
// ];

// const AdminDashboard = () => {
//   const [admin, setAdmin] = useState(null);
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [totalCategories, setTotalCategories] = useState(0);
//   const [totalItems, setTotalItems] = useState(0);
//   const [categoryData, setCategoryData] = useState([]);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const fetchAdminDetails = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get("http://localhost:5000/admin/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setAdmin(response.data);
//       } catch (error) {
//         console.error("Error fetching admin:", error);
//       }
//     };

//     const fetchStatistics = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const [userRes, categoryRes, itemRes, categoryCountRes] = await Promise.all([
//           axios.get("http://localhost:5000/api/members/count", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get("http://localhost:5000/api/categories/count", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get("http://localhost:5000/api/items/count", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get("http://localhost:5000/api/items/count-by-category", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         setTotalUsers(userRes.data.count);
//         setTotalCategories(categoryRes.data.count);
//         setTotalItems(itemRes.data.totalItems);
        
//         const totalItemCount = categoryCountRes.data.reduce((sum, item) => sum + item.count, 0);
//         const formattedCategoryData = categoryCountRes.data.map(item => ({
//           name: item._id,
//           value: item.count,
//           percentage: ((item.count / totalItemCount) * 100).toFixed(2),
//         }));

//         setCategoryData(formattedCategoryData);
//       } catch (error) {
//         console.error("Error fetching statistics:", error);
//       }
//     };

//     fetchAdminDetails();
//     fetchStatistics();
//   }, []);

//   const handleLogout = () => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You will be logged out of the admin panel.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, log me out",
//       cancelButtonText: "Cancel",
//       reverseButtons: true,
//     }).then((result) => {
//       if (result.isConfirmed) {
//         localStorage.removeItem("token");
//         navigate("/login");
//       }
//     });
//   };

//   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF69B4", "#A0D911"];

//   return (
//     <div className="flex h-screen">
//       <AdminSidebar />

//       <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
//         <AdminHeader adminName={admin ? admin.name : "Admin"} handleLogout={handleLogout} />

//         <div className="mt-6">
//           <Outlet />
//         </div>

//         {location.pathname === "/admin" && (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//               <DashboardCard title="Total Users" value={totalUsers} />
//               <DashboardCard title="Total Categories" value={totalCategories} />
//               <DashboardCard title="Total Listed Items" value={totalItems} />
//             </div>

//             <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
//               <h3 className="text-lg font-semibold mb-4 text-center">Category-wise Item Distribution</h3>
//               <ResponsiveContainer width="100%" height={350}>
//                 <PieChart>
//                   <Pie
//                     data={categoryData}
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={130}
//                     fill="#8884d8"
//                     dataKey="value"
//                   >
//                     {categoryData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip formatter={(value, name, props) => [`${value} items`, props.payload.percentage + "%"]} />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// const AdminSidebar = () => (
//   <aside className="w-64 bg-white shadow-lg h-screen p-6 overflow-y-auto">
//     <h2 className="text-xl font-bold mb-6 text-indigo-600">EcoSwap Admin</h2>
//     <ul>
//       {sidebarItems.map((item, index) => (
//         <li key={index} className="mb-2">
//           <Link
//             to={item.path}
//             className="flex items-center p-3 rounded-lg hover:bg-gray-200"
//           >
//             <FontAwesomeIcon icon={item.icon} className="mr-3 text-indigo-500" />
//             {item.label}
//           </Link>
//         </li>
//       ))}
//     </ul>
//   </aside>
// );

// const AdminHeader = ({ adminName, handleLogout }) => (
//   <header className="bg-white shadow-md p-4 rounded-lg flex justify-between items-center">
//     <span className="font-semibold text-lg">{adminName}</span>
//     <button className="text-red-500 hover:text-red-600" onClick={handleLogout}>
//       <FontAwesomeIcon icon={faSignOutAlt} />
//     </button>
//   </header>
// );

// const DashboardCard = ({ title, value }) => (
//   <div className="bg-white p-6 rounded-lg shadow-md text-center">
//     <h3 className="text-lg font-semibold">{title}</h3>
//     <p className="text-2xl font-bold text-indigo-600">{value}</p>
//   </div>
// );

// export default AdminDashboard;


import React, { useState, useEffect } from "react";
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers, faExchangeAlt, faListAlt, faObjectGroup, faCogs, faBullhorn, faSignOutAlt, faTachometerAlt,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const sidebarItems = [
  { icon: faTachometerAlt, label: "Dashboard", path: "/admin" },
  { icon: faUsers, label: "Users", path: "/admin/user" },
  { icon: faExchangeAlt, label: "Swaps", path: "/admin/itemshow" },
  { icon: faListAlt, label: "Events", path: "/admin/eventpost" },
  { icon: faListAlt, label: "Manage Event", path: "/admin/eventmanage" },
  { icon: faListAlt, label: "Reviews", path: "/admin/adminreview" },
  { icon: faObjectGroup, label: "Categories", path: "/admin/category" },
  { icon: faCogs, label: "Blog", path: "/admin/blogpost" },
  { icon: faBullhorn, label: "Announcement", path: "/admin/adminannouncement" },
  { icon: faListAlt, label: "Complaints", path: "/admin/userquery" },
  { icon: faUsers, label: "Manage Admin", path: "/admin/manage-admin" },
];

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [completedEvents, setCompletedEvents] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/admin/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(response.data);
      } catch (error) {
        console.error("Error fetching admin:", error);
      }
    };

    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem("token");
        const [userRes, categoryRes, itemRes, categoryCountRes, completedEventsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/members/count", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/categories/count", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/items/count", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/items/count-by-category", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/events/completed", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setTotalUsers(userRes.data.count);
        setTotalCategories(categoryRes.data.count);
        setTotalItems(itemRes.data.totalItems);
        setCompletedEvents(completedEventsRes.data.completedEvents);
        
        const totalItemCount = categoryCountRes.data.reduce((sum, item) => sum + item.count, 0);
        const formattedCategoryData = categoryCountRes.data.map(item => ({
          name: item._id,
          value: item.count,
          percentage: ((item.count / totalItemCount) * 100).toFixed(2),
        }));

        setCategoryData(formattedCategoryData);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchAdminDetails();
    fetchStatistics();
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of the admin panel.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log me out",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    });
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF69B4", "#A0D911"];

  return (
    <div className="flex h-screen">
      <AdminSidebar />

      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <AdminHeader adminName={admin ? admin.name : "Admin"} handleLogout={handleLogout} />

        <div className="mt-6">
          <Outlet />
        </div>

        {location.pathname === "/admin" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              <DashboardCard title="Total Users" value={totalUsers} />
              <DashboardCard title="Total Categories" value={totalCategories} />
              <DashboardCard title="Total Listed Items" value={totalItems} />
              <DashboardCard title="Completed Events" value={completedEvents} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
              <h3 className="text-lg font-semibold mb-4 text-center">Category-wise Item Distribution</h3>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value} items`, props.payload.percentage + "%"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const AdminSidebar = () => (
  <aside className="w-64 bg-white shadow-lg h-screen p-6 overflow-y-auto">
    <h2 className="text-xl font-bold mb-6 text-indigo-600">EcoSwap Admin</h2>
    <ul>
      {sidebarItems.map((item, index) => (
        <li key={index} className="mb-2">
          <Link
            to={item.path}
            className="flex items-center p-3 rounded-lg hover:bg-gray-200"
          >
            <FontAwesomeIcon icon={item.icon} className="mr-3 text-indigo-500" />
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </aside>
);

const AdminHeader = ({ adminName, handleLogout }) => (
  <header className="bg-white shadow-md p-4 rounded-lg flex justify-between items-center">
    <span className="font-semibold text-lg">{adminName}</span>
    <button className="text-red-500 hover:text-red-600" onClick={handleLogout}>
      <FontAwesomeIcon icon={faSignOutAlt} />
    </button>
  </header>
);

const DashboardCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center">
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-2xl font-bold text-indigo-600">{value}</p>
  </div>
);

export default AdminDashboard;
