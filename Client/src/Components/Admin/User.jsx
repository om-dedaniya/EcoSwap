import { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Pagination limit

  useEffect(() => {
    fetch("https://ecoswap-e24p.onrender.com/api/admin/user")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch users");
        setLoading(false);
      });
  }, []);

  // Search by Name
  const handleSearch = (query) => {
    setSearchQuery(query);
    filterUsers(query, cityQuery);
  };

  // Filter by City (using Pincode API)
  const handleCitySearch = async () => {
    if (!cityQuery) return;

    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${cityQuery}`
      );
      const data = await response.json();

      if (data[0].Status === "Success") {
        const city = data[0].PostOffice[0].District;
        filterUsers(searchQuery, city);
      } else {
        setFilteredUsers([]);
      }
    } catch {
      setFilteredUsers([]);
    }
  };

  // Helper function to filter users
  const filterUsers = (name, city) => {
    let filtered = users;

    if (name) {
      filtered = filtered.filter((user) =>
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(name.toLowerCase())
      );
    }

    if (city) {
      filtered = filtered.filter(
        (user) => user.district.toLowerCase() === city.toLowerCase()
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset pagination
  };

  // Sorting logic
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredUsers(sortedUsers);
    setSortConfig({ key, direction });
  };

  // Get paginated users
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-7xl bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          User List
        </h2>

        {/* Search Inputs */}
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
          <div className="flex items-center bg-gray-100 border rounded-lg px-4 py-2">
            <FiSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by Name..."
              className="bg-transparent outline-none px-2 w-full"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* <div className="flex items-center bg-gray-100 border rounded-lg px-4 py-2">
            <input
              type="text"
              placeholder="Enter Pincode..."
              className="bg-transparent outline-none px-2 w-full"
              value={cityQuery}
              onChange={(e) => setCityQuery(e.target.value)}
            />
            <button
              onClick={handleCitySearch}
              className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition"
            >
              Search City
            </button>
          </div> */}
        </div>

        {loading && (
          <div className="flex justify-center items-center py-6">
            <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        )}

        {error && <p className="text-red-500 text-center">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
              <thead className="bg-blue-600 text-white">
                <tr>
                  {[
                    "firstName",
                    "email",
                    "mobile",
                    "pincode",
                    "district",
                    "state",
                    "country",
                    "dob",
                  ].map((field) => (
                    <th
                      key={field}
                      className="py-3 px-4 text-left cursor-pointer"
                      onClick={() => handleSort(field)}
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                      {sortConfig.key === field ? (
                        sortConfig.direction === "asc" ? (
                          <FiArrowUp className="inline ml-2" />
                        ) : (
                          <FiArrowDown className="inline ml-2" />
                        )
                      ) : null}
                    </th>
                  ))}
                  <th className="py-3 px-4 text-left">Verified</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b bg-gray-50 hover:bg-gray-100 transition-all"
                    >
                      <td className="py-3 px-4 text-gray-800 font-medium">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4 text-gray-600">{user.mobile}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {user.pincode}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {user.district}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{user.state}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {user.country}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{user.dob}</td>
                      <td className="py-3 px-4">
                        {user.verified ? (
                          <FiCheckCircle className="text-green-500 text-xl" />
                        ) : (
                          <FiXCircle className="text-red-500 text-xl" />
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4 text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="mx-2 bg-gray-300 px-3 py-1 rounded"
          >
            Prev
          </button>
          <button
            disabled={currentPage * itemsPerPage >= filteredUsers.length}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="mx-2 bg-gray-300 px-3 py-1 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserList;
