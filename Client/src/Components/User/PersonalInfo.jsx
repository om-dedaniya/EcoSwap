// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const PersonalInfo = () => {
//   const [user, setUser] = useState(null);
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     pincode: "",
//     district: "",
//     state: "",
//     country: "",
//     dob: "",
//     mobile: "",
//     email: "",
//     bio: "",
//   });

//   // Fetch User Data
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return;

//         const response = await axios.get("http://localhost:5000/user", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setUser(response.data);
//         setFormData({
//           firstName: response.data.firstName || "",
//           lastName: response.data.lastName || "",
//           pincode: response.data.pincode || "",
//           district: response.data.district || "",
//           state: response.data.state || "",
//           country: response.data.country || "",
//           dob: response.data.dob || "",
//           mobile: response.data.mobile || "",
//           email: response.data.email || "",
//           bio: response.data.bio || "",
//         });
//       } catch (error) {
//         console.error("Error fetching user:", error);
//       }
//     };

//     fetchUser();
//   }, []);

//   // Handle Input Changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     // Fetch location details if Pincode is entered
//     if (name === "pincode" && value.length === 6 && /^\d+$/.test(value)) {
//       fetchLocationDetails(value);
//     }
//   };

//   // Fetch Location Details from Pincode API
//   const fetchLocationDetails = async (pincode) => {
//     try {
//       const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
//       if (response.data && response.data[0].Status === "Success") {
//         const locationData = response.data[0].PostOffice[0];
//         setFormData((prevData) => ({
//           ...prevData,
//           district: locationData.District || "",
//           state: locationData.State || "",
//           country: locationData.Country || "India", // Default country
//         }));
//       } else {
//         alert("Invalid Pincode. Please enter a valid one.");
//       }
//     } catch (error) {
//       console.error("Error fetching location data:", error);
//       alert("Failed to fetch location details. Try again.");
//     }
//   };

//   // Handle Edit Button Click (Update User Data)
//   const handleEdit = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       const response = await axios.put(
//         "http://localhost:5000/user/update",
//         { ...formData },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.data.message) {
//         alert("Profile updated successfully!");
//       }
//     } catch (error) {
//       console.error("Error updating profile:", error);

//       if (error.response && error.response.data.error) {
//         alert(`Failed to update profile: ${error.response.data.error}`);
//       } else {
//         alert("Failed to update profile. Please try again.");
//       }
//     }
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300 mt-8">
//       <h2 className="text-2xl font-bold text-green-800 mb-4">Personal Info</h2>

//       {user && (
//         <form className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="flex flex-col">
//               <label className="font-semibold text-gray-700">First Name*</label>
//               <input
//                 type="text"
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//             </div>
//             <div className="flex flex-col">
//               <label className="font-semibold text-gray-700">Last Name</label>
//               <input
//                 type="text"
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="flex flex-col">
//               <label className="font-semibold text-gray-700">Pincode*</label>
//               <input
//                 type="text"
//                 name="pincode"
//                 value={formData.pincode}
//                 onChange={handleChange}
//                 className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//             </div>
//             <div className="flex flex-col">
//               <label className="font-semibold text-gray-700">Country</label>
//               <input
//                 type="text"
//                 name="country"
//                 value={formData.country}
//                 readOnly
//                 className="p-2 border border-gray-300 rounded-md bg-gray-100"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="flex flex-col">
//               <label className="font-semibold text-gray-700">State</label>
//               <input
//                 type="text"
//                 name="state"
//                 value={formData.state}
//                 readOnly
//                 className="p-2 border border-gray-300 rounded-md bg-gray-100"
//               />
//             </div>
//             <div className="flex flex-col">
//               <label className="font-semibold text-gray-700">District</label>
//               <input
//                 type="text"
//                 name="district"
//                 value={formData.district}
//                 readOnly
//                 className="p-2 border border-gray-300 rounded-md bg-gray-100"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="flex flex-col">
//               <label className="font-semibold text-gray-700">Date of Birth</label>
//               <input
//                 type="date"
//                 name="dob"
//                 value={formData.dob}
//                 onChange={handleChange}
//                 className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//             </div>
//             <div className="flex flex-col">
//               <label className="font-semibold text-gray-700">Phone Number*</label>
//               <input
//                 type="tel"
//                 name="mobile"
//                 value={formData.mobile}
//                 onChange={handleChange}
//                 className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//             </div>
//           </div>

//           <div className="flex flex-col">
//             <label className="font-semibold text-gray-700">Tell about yourself</label>
//             <textarea
//               name="bio"
//               value={formData.bio}
//               onChange={handleChange}
//               className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none h-24"
//             />
//           </div>

//           <button
//             type="button"
//             className="w-full bg-green-700 text-white py-2 rounded-md font-bold hover:bg-green-800 transition duration-300"
//             onClick={handleEdit}
//           >
//             Save Changes
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default PersonalInfo;

import React, { useEffect, useState } from "react";
import axios from "axios";

const PersonalInfo = () => {
  const [user, setUser ] = useState(null);
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
    const fetchUser  = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:5000/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser (response.data);
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

    fetchUser ();
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
    <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300 mt-8">
      <h2 className="text-2xl font-bold text-green-800 mb-4">Personal Info</h2>

      {user && (
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700">First Name*</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700">Pincode*</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                readOnly
                className="p-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                readOnly
                className="p-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700">District</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                readOnly
                className="p-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700">Phone Number*</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Tell about yourself</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none h-24"
            />
          </div>

          <button
            type="button"
            className="w-full bg-green-700 text-white py-2 rounded-md font -bold hover:bg-green-800 transition duration-300"
            onClick={handleEdit}
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
};

export default PersonalInfo;