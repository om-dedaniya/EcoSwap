// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Select from "react-select";
// import Swal from "sweetalert2";

// const ItemListing = () => {
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [otherCategory, setOtherCategory] = useState("");
//   const [itemName, setItemName] = useState("");
//   const [description, setDescription] = useState("");
//   const [keywords, setKeywords] = useState("");
//   const [images, setImages] = useState(Array(5).fill(null));
//   const [user, setUser] = useState(null);
//   const [cities, setCities] = useState([]);
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [condition, setCondition] = useState("");
//   const [swapOrGiveaway, setSwapOrGiveaway] = useState("");
//   const [price, setPrice] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     axios.get("http://localhost:5000/categories").then((res) => {
//       setCategories(res.data);
//     });

//     const token = localStorage.getItem("token");
//     if (token) {
//       axios
//         .get("http://localhost:5000/user", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => setUser(res.data))
//         .catch(() => setUser(null));
//     }

//     axios
//       .post("https://countriesnow.space/api/v0.1/countries/cities", {
//         country: "India",
//       })
//       .then((res) => {
//         if (res.data?.data) {
//           const cityOptions = res.data.data
//             .map((c) => ({ value: c, label: c }))
//             .sort((a, b) => a.label.localeCompare(b.label));
//           setCities(cityOptions);
//         }
//       });
//   }, []);

//   useEffect(() => {
//     if (swapOrGiveaway === "Giveaway") setPrice("");
//   }, [swapOrGiveaway]);

//   const handleFileChange = (e, index) => {
//     const file = e.target.files[0];
//     if (file) {
//       const updatedImages = [...images];
//       updatedImages[index] = file;
//       setImages(updatedImages);
//     }
//   };

//   const removeImage = (index) => {
//     const updatedImages = [...images];
//     updatedImages[index] = null;
//     setImages(updatedImages);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!user) return Swal.fire("Error", "User not logged in.", "error");
//     if (images.every((img) => img === null))
//       return Swal.fire("Error", "Please upload at least 1 image.", "error");
//     if (swapOrGiveaway === "Swap" && !price)
//       return Swal.fire("Error", "Please enter price for swap item.", "error");

//     const formData = new FormData();
//     images.forEach((img) => {
//       if (img) formData.append("images", img);
//     });

//     formData.append(
//       "category",
//       selectedCategory === "Other" ? otherCategory : selectedCategory
//     );
//     formData.append("itemName", itemName);
//     formData.append("description", description);
//     formData.append("keywords", keywords);
//     formData.append("city", selectedCity?.value || "");
//     formData.append("userName", user.name);
//     formData.append("email", user.email);
//     formData.append("mobile", user.mobile);
//     formData.append("condition", condition);
//     formData.append("swapOrGiveaway", swapOrGiveaway);
//     formData.append("price", price);

//     try {
//       setLoading(true);
//       await axios.post("http://localhost:5000/api/list-item", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       Swal.fire("Success", "Item listed successfully!", "success");

//       setItemName("");
//       setSelectedCategory("");
//       setOtherCategory("");
//       setKeywords("");
//       setDescription("");
//       setImages(Array(5).fill(null));
//       setSelectedCity(null);
//       setCondition("");
//       setSwapOrGiveaway("");
//       setPrice("");
//     } catch (err) {
//       console.error(err);
//       Swal.fire("Error", "Failed to list item. Try again.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded-2xl shadow-md">
//       <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
//         List an Item
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Image Upload */}
//         <div>
//           <label className="block font-semibold text-gray-700 mb-2">
//             Upload Photos (1 vertical + 4 horizontal)
//           </label>

//           <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
//             {/* Vertical Image */}
//             <label className="flex flex-col items-center col-span-1 cursor-pointer relative border border-dashed rounded-md w-full h-100 bg-gray-100">
//               {images[0] ? (
//                 <img
//                   src={URL.createObjectURL(images[0])}
//                   alt="Vertical Preview"
//                   className="w-full h-full object-contain rounded-md"
//                 />
//               ) : (
//                 <span className="text-gray-500 m-auto">+ Vertical Image</span>
//               )}
//               <input
//                 type="file"
//                 accept="image/*"
//                 id="file-upload-0"
//                 className="hidden"
//                 onChange={(e) => handleFileChange(e, 0)}
//               />
//             </label>

//             {/* Horizontal Images */}
//             <div className="col-span-1 md:col-span-4 grid grid-cols-2 gap-2">
//               {[1, 2, 3, 4].map((index) => (
//                 <label
//                   key={index}
//                   className="cursor-pointer relative border border-dashed rounded-md w-full h-40 bg-gray-100 flex items-center justify-center"
//                 >
//                   {images[index] ? (
//                     <img
//                       src={URL.createObjectURL(images[index])}
//                       alt={`Preview ${index}`}
//                       className="w-full h-full object-contain rounded-md"
//                     />
//                   ) : (
//                     <span className="text-gray-500">+ Horizontal</span>
//                   )}
//                   <input
//                     type="file"
//                     accept="image/*"
//                     id={`file-upload-${index}`}
//                     className="hidden"
//                     onChange={(e) => handleFileChange(e, index)}
//                   />
//                 </label>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Title & City */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="font-semibold text-gray-700 block">Title</label>
//             <input
//               type="text"
//               className="w-full p-3 border border-gray-300 rounded-lg"
//               value={itemName}
//               onChange={(e) => setItemName(e.target.value)}
//               placeholder="e.g., Old Bicycle"
//               required
//             />
//           </div>
//           <div>
//             <label className="font-semibold text-gray-700 block">City</label>
//             <Select
//               options={cities}
//               value={selectedCity}
//               onChange={setSelectedCity}
//               placeholder="Select city"
//               className="text-sm"
//             />
//           </div>
//         </div>

//         {/* Category & Keywords */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="font-semibold text-gray-700 block">Category</label>
//             <select
//               className="w-full p-3 border border-gray-300 rounded-lg"
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//               required
//             >
//               <option value="">Select Category</option>
//               {categories.map((cat) => (
//                 <option key={cat.id} value={cat.name}>
//                   {cat.name}
//                 </option>
//               ))}
//               <option value="Other">Other</option>
//             </select>
//             {selectedCategory === "Other" && (
//               <input
//                 type="text"
//                 className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
//                 value={otherCategory}
//                 onChange={(e) => setOtherCategory(e.target.value)}
//                 placeholder="Enter category name"
//               />
//             )}
//           </div>
//           <div>
//             <label className="font-semibold text-gray-700 block">Keywords</label>
//             <input
//               type="text"
//               className="w-full p-3 border border-gray-300 rounded-lg"
//               value={keywords}
//               onChange={(e) => setKeywords(e.target.value)}
//               required
//               placeholder="e.g., books, kids, sports"
//             />
//           </div>
//         </div>

//         {/* Condition & Swap/Giveaway */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="font-semibold text-gray-700 block">Condition</label>
//             <select
//               className="w-full p-3 border border-gray-300 rounded-lg"
//               value={condition}
//               onChange={(e) => setCondition(e.target.value)}
//               required
//             >
//               <option value="">Select Condition</option>
//               <option value="New">New</option>
//               <option value="Gently Used">Gently Used</option>
//               <option value="Heavily Used">Heavily Used</option>
//             </select>
//           </div>
//           <div>
//             <label className="font-semibold text-gray-700 block">
//               Swap or Giveaway
//             </label>
//             <select
//               className="w-full p-3 border border-gray-300 rounded-lg"
//               value={swapOrGiveaway}
//               onChange={(e) => setSwapOrGiveaway(e.target.value)}
//               required
//             >
//               <option value="">Select Option</option>
//               <option value="Swap">Swap</option>
//               <option value="Giveaway">Giveaway</option>
//             </select>
//             {swapOrGiveaway === "Swap" && (
//               <input
//                 type="number"
//                 className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//                 placeholder="Enter price (₹)"
//               />
//             )}
//           </div>
//         </div>

//         {/* Description */}
//         <div>
//           <label className="font-semibold text-gray-700 block">Description</label>
//           <textarea
//             rows={4}
//             className="w-full p-3 border border-gray-300 rounded-lg"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             required
//             placeholder="Provide some details about the item..."
//           ></textarea>
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full py-3 rounded-lg text-white font-semibold transition ${
//             loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
//           }`}
//         >
//           {loading ? "Submitting..." : "Submit"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ItemListing;


import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Swal from "sweetalert2";

const ItemListing = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [images, setImages] = useState(Array(5).fill(null));
  const [user, setUser] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [condition, setCondition] = useState("");
  const [swapOrGiveaway, setSwapOrGiveaway] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/categories").then((res) => {
      setCategories(res.data);
    });

    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }

    axios
      .post("https://countriesnow.space/api/v0.1/countries/cities", {
        country: "India",
      })
      .then((res) => {
        if (res.data?.data) {
          const cityOptions = res.data.data
            .map((c) => ({ value: c, label: c }))
            .sort((a, b) => a.label.localeCompare(b.label));
          setCities(cityOptions);
        }
      });
  }, []);

  useEffect(() => {
    if (swapOrGiveaway === "Giveaway") setPrice("");
  }, [swapOrGiveaway]);

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...images];
      updatedImages[index] = file;
      setImages(updatedImages);
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages[index] = null;
    setImages(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return Swal.fire("Error", "User not logged in.", "error");
    if (images.every((img) => img === null))
      return Swal.fire("Error", "Please upload at least 1 image.", "error");
    if (swapOrGiveaway === "Swap" && !price)
      return Swal.fire("Error", "Please enter price for swap item.", "error");

    const formData = new FormData();
    images.forEach((img) => {
      if (img) formData.append("images", img);
    });

    formData.append(
      "category",
      selectedCategory === "Other" ? otherCategory : selectedCategory
    );
    formData.append("itemName", itemName);
    formData.append("description", description);
    formData.append("keywords", keywords);
    formData.append("city", selectedCity?.value || "");
    formData.append("condition", condition);
    formData.append("swapOrGiveaway", swapOrGiveaway);
    if (swapOrGiveaway === "Swap") {
      formData.append("price", price);
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/list-item", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      Swal.fire("Success", "Item listed successfully!", "success");

      // Reset fields
      setItemName("");
      setSelectedCategory("");
      setOtherCategory("");
      setKeywords("");
      setDescription("");
      setImages(Array(5).fill(null));
      setSelectedCity(null);
      setCondition("");
      setSwapOrGiveaway("");
      setPrice("");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.message || "Failed to list item.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded-2xl shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        List an Item
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Upload Photos (1 vertical + 4 horizontal)
          </label>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <label className="flex flex-col items-center col-span-1 cursor-pointer relative border border-dashed rounded-md w-full h-100 bg-gray-100">
              {images[0] ? (
                <img
                  src={URL.createObjectURL(images[0])}
                  alt="Vertical Preview"
                  className="w-full h-full object-contain rounded-md"
                />
              ) : (
                <span className="text-gray-500 m-auto">+ Vertical Image</span>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, 0)}
              />
            </label>

            <div className="col-span-1 md:col-span-4 grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((index) => (
                <label
                  key={index}
                  className="cursor-pointer relative border border-dashed rounded-md w-full h-40 bg-gray-100 flex items-center justify-center"
                >
                  {images[index] ? (
                    <img
                      src={URL.createObjectURL(images[index])}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-contain rounded-md"
                    />
                  ) : (
                    <span className="text-gray-500">+ Horizontal</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, index)}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Title & City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-gray-700 block">Title</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g., Old Bicycle"
              required
            />
          </div>
          <div>
            <label className="font-semibold text-gray-700 block">City</label>
            <Select
              options={cities}
              value={selectedCity}
              onChange={setSelectedCity}
              placeholder="Select city"
              className="text-sm"
            />
          </div>
        </div>

        {/* Category & Keywords */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-gray-700 block">Category</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
            {selectedCategory === "Other" && (
              <input
                type="text"
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
                value={otherCategory}
                onChange={(e) => setOtherCategory(e.target.value)}
                placeholder="Enter category name"
              />
            )}
          </div>
          <div>
            <label className="font-semibold text-gray-700 block">Keywords</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              required
              placeholder="e.g., books, kids, sports"
            />
          </div>
        </div>

        {/* Condition & Swap/Giveaway */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-gray-700 block">Condition</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              required
            >
              <option value="">Select Condition</option>
              <option value="New">New</option>
              <option value="Gently Used">Gently Used</option>
              <option value="Heavily Used">Heavily Used</option>
            </select>
          </div>
          <div>
            <label className="font-semibold text-gray-700 block">
              Swap or Giveaway
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={swapOrGiveaway}
              onChange={(e) => setSwapOrGiveaway(e.target.value)}
              required
            >
              <option value="">Select Option</option>
              <option value="Swap">Swap</option>
              <option value="Giveaway">Giveaway</option>
            </select>
            {swapOrGiveaway === "Swap" && (
              <input
                type="number"
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price (₹)"
              />
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="font-semibold text-gray-700 block">Description</label>
          <textarea
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Provide some details about the item..."
          ></textarea>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ItemListing;
