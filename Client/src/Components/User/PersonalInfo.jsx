import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";

const PersonalInfo = () => {
  const { isDarkMode, toggleDarkMode } = useOutletContext();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    pincode: "",
    district: "",
    state: "",
    country: "",
    dob: "",
    mobile: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          "https://ecoswap-e24p.onrender.com/user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(response.data);
        setFormData({
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          pincode: response.data.pincode || "",
          district: response.data.district || "",
          state: response.data.state || "",
          country: response.data.country || "",
          dob: response.data.dob || "",
          mobile: response.data.mobile || "",
          email: response.data.email || "",
          bio: response.data.bio || "",
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "pincode" && value.length === 6 && /^\d+$/.test(value)) {
      fetchLocationDetails(value);
    }
  };

  const fetchLocationDetails = async (pincode) => {
    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      if (response.data && response.data[0].Status === "Success") {
        const locationData = response.data[0].PostOffice[0];
        setFormData((prevData) => ({
          ...prevData,
          district: locationData.District || "",
          state: locationData.State || "",
          country: locationData.Country || "India",
        }));
      } else {
        alert("Invalid Pincode. Please enter a valid one.");
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
      alert("Failed to fetch location details. Try again.");
    }
  };

  const handleEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.put(
        "https://ecoswap-e24p.onrender.com/user/update",
        { ...formData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message) {
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);

      if (error.response && error.response.data.error) {
        alert(`Failed to update profile: ${error.response.data.error}`);
      } else {
        alert("Failed to update profile. Please try again.");
      }
    }
  };

  return (
    <div
      className={`w-full max-w-4xl mx-auto p-8 rounded-2xl shadow-lg border transition-colors duration-300 ${
        isDarkMode
          ? "bg-gray-800 text-white border-gray-700"
          : "bg-white text-gray-800 border-gray-200"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2
          className={`text-3xl font-bold text-center ${
            isDarkMode ? "text-green-400" : "text-green-800"
          }`}
        >
          🧑 Personal Information
        </h2>
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${
            isDarkMode
              ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          } transition-colors duration-300`}
        >
          {isDarkMode ? "Switch to Light" : "Switch to Dark"}
        </button>
      </div>

      {user && (
        <form className="space-y-6">
          {/* Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="First Name*"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              isDarkMode={isDarkMode}
            />
            <InputField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Pincode*"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              isDarkMode={isDarkMode}
            />
            <ReadOnlyField
              label="Country"
              name="country"
              value={formData.country}
              isDarkMode={isDarkMode}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReadOnlyField
              label="State"
              name="state"
              value={formData.state}
              isDarkMode={isDarkMode}
            />
            <ReadOnlyField
              label="District"
              name="district"
              value={formData.district}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Contact & DOB */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              isDarkMode={isDarkMode}
            />
            <InputField
              label="Phone Number*"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Bio */}
          <div>
            <label
              className={`block font-semibold mb-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Tell about yourself
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none h-24 shadow-sm transition-colors duration-300 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            />
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleEdit}
            className={`w-full py-3 rounded-lg font-semibold transition-all shadow-md ${
              isDarkMode
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            💾 Save Changes
          </button>
        </form>
      )}
    </div>
  );
};

// Reusable InputField
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  isDarkMode,
}) => (
  <div className="flex flex-col">
    <label
      className={`text-gray-700 font-semibold mb-1 ${
        isDarkMode ? "text-gray-300" : "text-gray-700"
      }`}
    >
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition-colors duration-300 ${
        isDarkMode
          ? "bg-gray-700 border-gray-600 text-white"
          : "bg-white border-gray-300 text-gray-800"
      }`}
    />
  </div>
);

// Read-only fields
const ReadOnlyField = ({ label, name, value, isDarkMode }) => (
  <div className="flex flex-col">
    <label
      className={`text-gray-700 font-semibold mb-1 ${
        isDarkMode ? "text-gray-300" : "text-gray-700"
      }`}
    >
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      readOnly
      className={`p-3 border rounded-lg shadow-sm transition-colors duration-300 ${
        isDarkMode
          ? "bg-gray-600 border-gray-600 text-white"
          : "bg-gray-100 border-gray-300 text-gray-800"
      }`}
    />
  </div>
);

export default PersonalInfo;
