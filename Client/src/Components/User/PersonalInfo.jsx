import React, { useEffect, useState } from "react";
import axios from "axios";

const PersonalInfo = () => {
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

        const response = await axios.get("http://localhost:5000/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

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
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
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
        "http://localhost:5000/user/update",
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
    <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border mt-10">
      <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">🧑 Personal Information</h2>

      {user && (
        <form className="space-y-6">
          {/* Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="First Name*" name="firstName" value={formData.firstName} onChange={handleChange} />
            <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
          </div>

          {/* Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Pincode*" name="pincode" value={formData.pincode} onChange={handleChange} />
            <ReadOnlyField label="Country" name="country" value={formData.country} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReadOnlyField label="State" name="state" value={formData.state} />
            <ReadOnlyField label="District" name="district" value={formData.district} />
          </div>

          {/* Contact & DOB */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
            <InputField label="Phone Number*" name="mobile" value={formData.mobile} onChange={handleChange} />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Tell about yourself</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none h-24 shadow-sm"
            />
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleEdit}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md"
          >
            💾 Save Changes
          </button>
        </form>
      )}
    </div>
  );
};

// Reusable InputField
const InputField = ({ label, name, value, onChange, type = "text" }) => (
  <div className="flex flex-col">
    <label className="text-gray-700 font-semibold mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
    />
  </div>
);

// Read-only fields
const ReadOnlyField = ({ label, name, value }) => (
  <div className="flex flex-col">
    <label className="text-gray-700 font-semibold mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      readOnly
      className="p-3 border border-gray-300 rounded-lg bg-gray-100 shadow-sm"
    />
  </div>
);

export default PersonalInfo;
