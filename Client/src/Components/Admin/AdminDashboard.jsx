// import React, { useState, useEffect } from "react";
// import {
//   PieChart,
//   Pie,
//   Tooltip,
//   Cell,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUsers,
//   faExchangeAlt,
//   faListAlt,
//   faObjectGroup,
//   faCogs,
//   faBullhorn,
//   faSignOutAlt,
//   faTachometerAlt,
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
//   { icon: faListAlt, label: "Reviews", path: "/admin/adminreview" },
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
//   const [completedEvents, setCompletedEvents] = useState(0);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const fetchAdminDetails = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           "https://ecoswap-e24p.onrender.com/admin/profile",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setAdmin(response.data);
//       } catch (error) {
//         console.error("Error fetching admin:", error);
//       }
//     };

//     const fetchStatistics = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const [
//           userRes,
//           categoryRes,
//           itemRes,
//           categoryCountRes,
//           completedEventsRes,
//         ] = await Promise.all([
//           axios.get("https://ecoswap-e24p.onrender.com/api/members/count", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get("https://ecoswap-e24p.onrender.com/api/categories/count", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get("https://ecoswap-e24p.onrender.com/api/items/count", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get("https://ecoswap-e24p.onrender.com/api/items/count-by-category", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get("https://ecoswap-e24p.onrender.com/events/completed", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         setTotalUsers(userRes.data.count);
//         setTotalCategories(categoryRes.data.count);
//         setTotalItems(itemRes.data.totalItems);
//         setCompletedEvents(completedEventsRes.data.completedEvents);

//         const totalItemCount = categoryCountRes.data.reduce(
//           (sum, item) => sum + item.count,
//           0
//         );
//         const formattedCategoryData = categoryCountRes.data.map((item) => ({
//           name: item.category?.name,
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

//   const COLORS = [
//     "#0088FE",
//     "#00C49F",
//     "#FFBB28",
//     "#FF8042",
//     "#A28DFF",
//     "#FF69B4",
//     "#A0D911",
//   ];

//   return (
//     <div className="flex h-screen">
//       <AdminSidebar />

//       <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
//         <AdminHeader
//           adminName={admin ? admin.name : "Admin"}
//           handleLogout={handleLogout}
//         />

//         <div className="mt-6">
//           <Outlet />
//         </div>

//         {location.pathname === "/admin" && (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
//               <DashboardCard title="Total Users" value={totalUsers} />
//               <DashboardCard title="Total Categories" value={totalCategories} />
//               <DashboardCard title="Total Listed Items" value={totalItems} />
//               <DashboardCard title="Completed Events" value={completedEvents} />
//             </div>

//             <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
//               <h3 className="text-lg font-semibold mb-4 text-center">
//                 Category-wise Item Distribution
//               </h3>
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
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip
//                     formatter={(value, name, props) => [
//                       `${value} items`,
//                       props.payload.percentage + "%",
//                     ]}
//                   />
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
//             <FontAwesomeIcon
//               icon={item.icon}
//               className="mr-3 text-indigo-500"
//             />
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

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faExchangeAlt,
  faListAlt,
  faObjectGroup,
  faCogs,
  faBullhorn,
  faSignOutAlt,
  faTachometerAlt,
  faBars,
  faSearch,
  faDownload,
  faSyncAlt,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../../assets/images/logo.png"; // Replace with your logo path
import html2canvas from "html2canvas";

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
  // { icon: faListAlt, label: "Complaints", path: "/admin/userquery" },
  { icon: faUsers, label: "Manage Admin", path: "/admin/manage-admin" },
];

// Custom CountUp component
const CustomCountUp = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const step = () => {
      start += increment;
      if (start >= end) {
        setCount(end);
        return;
      }
      setCount(Math.floor(start));
      requestAnimationFrame(step);
    };
    const timer = setTimeout(() => requestAnimationFrame(step), 100);
    return () => clearTimeout(timer);
  }, [end, duration]);

  return <span>{count}</span>;
};

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [completedEvents, setCompletedEvents] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [chartType, setChartType] = useState("pie");
  const [searchTerm, setSearchTerm] = useState("");
  const chartRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem("token");
      const [
        userRes,
        categoryRes,
        itemRes,
        categoryCountRes,
        completedEventsRes,
      ] = await Promise.all([
        axios.get("https://ecoswap-e24p.onrender.com/api/members/count", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("https://ecoswap-e24p.onrender.com/api/categories/count", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("https://ecoswap-e24p.onrender.com/api/items/count", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(
          "https://ecoswap-e24p.onrender.com/api/items/count-by-category",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        axios.get("https://ecoswap-e24p.onrender.com/events/completed", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setTotalUsers(userRes.data.count);
      setTotalCategories(categoryRes.data.count);
      setTotalItems(itemRes.data.totalItems);
      setCompletedEvents(completedEventsRes.data.completedEvents);

      const totalItemCount = categoryCountRes.data.reduce(
        (sum, item) => sum + item.count,
        0
      );
      const formattedCategoryData = categoryCountRes.data.map((item) => ({
        name: item.category?.name,
        value: item.count,
        percentage: ((item.count / totalItemCount) * 100).toFixed(2),
      }));

      setCategoryData(formattedCategoryData);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch statistics. Please try again.",
      });
    }
  };

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://ecoswap-e24p.onrender.com/admin/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAdmin(response.data);
      } catch (error) {
        console.error("Error fetching admin:", error);
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
      customClass: {
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded",
        cancelButton:
          "bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    });
  };

  const handleChartClick = (data) => {
    if (data && data.name) {
      setSelectedCategory(data.name);
    }
  };

  const handleResetFilter = () => {
    setSelectedCategory(null);
  };

  const handleExportChart = async () => {
    const chartElement = chartRef.current;
    if (chartElement) {
      const canvas = await html2canvas(chartElement);
      const link = document.createElement("a");
      link.download = "category-distribution.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } else {
      Swal.fire({
        icon: "error",
        title: "Export Failed",
        text: "Unable to export chart. Please try again.",
      });
    }
  };

  const filteredCategoryData = useMemo(() => {
    return categoryData.filter((item) =>
      selectedCategory ? item.name === selectedCategory : true
    );
  }, [categoryData, selectedCategory]);

  const filteredTableData = categoryData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#84CC16",
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <AdminHeader
          adminName={admin ? admin.name : "Admin"}
          handleLogout={handleLogout}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />

            {location.pathname === "/admin" && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <DashboardCard
                    title="Total Users"
                    value={
                      selectedCategory
                        ? filteredCategoryData.length
                        : totalUsers
                    }
                    icon={faUsers}
                  />
                  <DashboardCard
                    title="Total Categories"
                    value={selectedCategory ? 1 : totalCategories}
                    icon={faObjectGroup}
                  />
                  <DashboardCard
                    title="Total Listed Items"
                    value={
                      selectedCategory
                        ? filteredCategoryData.reduce(
                            (sum, item) => sum + item.value,
                            0
                          )
                        : totalItems
                    }
                    icon={faListAlt}
                  />
                  <DashboardCard
                    title="Completed Events"
                    value={selectedCategory ? 0 : completedEvents}
                    icon={faBullhorn}
                  />
                </div>

                {/* Chart Controls */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setChartType("pie")}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        chartType === "pie"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Pie Chart
                    </button>
                    <button
                      onClick={() => setChartType("bar")}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        chartType === "bar"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Bar Chart
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={fetchStatistics}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center font-medium"
                    >
                      <FontAwesomeIcon icon={faSyncAlt} className="mr-2" />
                      Refresh
                    </button>
                    <button
                      onClick={handleExportChart}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center font-medium"
                    >
                      <FontAwesomeIcon icon={faDownload} className="mr-2" />
                      Export
                    </button>
                    {selectedCategory && (
                      <button
                        onClick={handleResetFilter}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                      >
                        Reset Filter
                      </button>
                    )}
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    Category-wise Item Distribution
                    {selectedCategory && (
                      <span className="text-indigo-600">
                        {" "}
                        ({selectedCategory})
                      </span>
                    )}
                  </h3>
                  <div className="h-[400px]" ref={chartRef}>
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "pie" ? (
                        <PieChart>
                          <Pie
                            data={filteredCategoryData}
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                            onClick={handleChartClick}
                            animationBegin={0}
                            animationDuration={800}
                          >
                            {filteredCategoryData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            }}
                            formatter={(value, name, props) => [
                              `${value} items`,
                              `${props.payload.percentage}%`,
                            ]}
                          />
                          <Legend
                            wrapperStyle={{
                              paddingTop: "20px",
                              fontSize: "14px",
                            }}
                          />
                        </PieChart>
                      ) : (
                        <BarChart data={filteredCategoryData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            }}
                            formatter={(value, name, props) => [
                              `${value} items`,
                              `${props.payload.percentage}%`,
                            ]}
                          />
                          <Legend />
                          <Bar
                            dataKey="value"
                            fill="#3B82F6"
                            onClick={handleChartClick}
                          >
                            {filteredCategoryData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Category Details
                    </h3>
                    <div className="relative">
                      <FontAwesomeIcon
                        icon={faSearch}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-4 text-gray-600 font-semibold">
                            Category
                          </th>
                          <th className="p-4 text-gray-600 font-semibold">
                            Items
                          </th>
                          <th className="p-4 text-gray-600 font-semibold">
                            Percentage
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTableData.map((item, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="p-4">{item.name}</td>
                            <td className="p-4">{item.value}</td>
                            <td className="p-4">{item.percentage}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const AdminSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 lg:static lg:shadow-none`}
      >
        <div className="flex items-center h-16 px-4 border-b">
          <img src={logo} alt="EcoSwap Logo" className="h-8 w-auto" />
        </div>
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                location.pathname === item.path
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <FontAwesomeIcon
                icon={item.icon}
                className={`w-5 h-5 ${
                  location.pathname === item.path
                    ? "text-indigo-600"
                    : "text-gray-500"
                } mr-3`}
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

const AdminHeader = ({ adminName, handleLogout, setIsSidebarOpen }) => (
  <header className="bg-white h-16 shadow-sm flex items-center justify-between px-6">
    <div className="flex items-center">
      <button
        className="lg:hidden text-gray-600 hover:text-gray-800 mr-4"
        onClick={() => setIsSidebarOpen(true)}
      >
        <FontAwesomeIcon icon={faBars} size="lg" />
      </button>
      <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>
    </div>
    <div className="flex items-center space-x-4">
      <span className="text-gray-700 font-medium hidden sm:block">
        {adminName}
      </span>
      <button
        onClick={handleLogout}
        className="flex items-center text-red-600 hover:text-red-700 transition-colors"
      >
        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
        <span>Logout</span>
      </button>
    </div>
  </header>
);

const DashboardCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow">
    <div className="text-indigo-600 text-3xl">
      <FontAwesomeIcon icon={icon} />
    </div>
    <div>
      <h4 className="text-gray-600 text-sm font-semibold uppercase">{title}</h4>
      <div className="text-2xl font-bold text-gray-800">
        <CustomCountUp end={value} />
      </div>
    </div>
  </div>
);

export default AdminDashboard;
