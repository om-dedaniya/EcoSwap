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
  const [images, setImages] = useState(Array(5).fill(null)); // Initialize with 5 nulls
  const [user, setUser ] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [condition, setCondition] = useState("");
  const [swapOrGiveaway, setSwapOrGiveaway] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch categories
    axios.get("http://localhost:5000/categories").then((response) => {
      setCategories(response.data);
    });

    // Fetch user data
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setUser (response.data))
        .catch(() => setUser (null));
    }

    // Fetch Indian cities
    axios
      .post("https://countriesnow.space/api/v0.1/countries/cities", {
        country: "India",
      })
      .then((response) => {
        if (response.data && response.data.data) {
          const indianCities = response.data.data
            .map((city) => ({ value: city, label: city }))
            .sort((a, b) => a.label.localeCompare(b.label));

          setCities(indianCities);
        }
      })
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...images];
      updatedImages[index] = file;
      setImages(updatedImages);
    }
  };

  const handleImageClick = (index) => {
    if (!images[index]) {
      return;
    }

    Swal.fire({
      title: "Image Options",
      text: "What would you like to do?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Replace",
      cancelButtonText: "Remove",
    }).then((result) => {
      if (result.isConfirmed) {
        document.getElementById(`file-upload-${index}`).click();
      } else if (result.isDismissed) {
        removeImage(index);
      }
    });
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages[index] = null;
    setImages(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return Swal.fire("Error", "User  not logged in.", "error");
    if (images.every((img) => img === null))
      return Swal.fire("Error", "Please upload at least 1 image!", "error");

    const formData = new FormData();
    images.forEach((img) => {
      if (img) {
        formData.append("images", img);
      }
    });

    formData.append("category", selectedCategory === "Other" ? otherCategory : selectedCategory);
    formData.append("itemName", itemName);
    formData.append("description", description);
    formData.append("keywords", keywords);
    formData.append("city", selectedCity?.value || "");
    formData.append("userName", user.name);
    formData.append("email", user.email);
    formData.append("mobile", user.mobile);
    formData.append("condition", condition);
    formData.append("swapOrGiveaway", swapOrGiveaway);
    formData.append("price", price);

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/list-item", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`

        },
      });

      Swal.fire("Success", "Item listed successfully!", "success");
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
    } catch (error) {
      console.error("Error submitting item:", error);
      Swal.fire("Error", "Failed to list item. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-green-50 border border-green-800 rounded-lg shadow-md">
      <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
        List an Item
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block font-semibold text-gray-700">
          Upload Photos (Min 1, Max 5):
        </label>
        <div className="flex gap-4 mb-4">
          <div className="flex-1 h-64 bg-gray-200 flex items-center justify-center cursor-pointer relative">
            {images[0] ? (
              <img
                src={URL.createObjectURL(images[0])}
                alt="preview"
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <label htmlFor="file-upload-0" className="text-gray-500">
                + Add Photo
              </label>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 0)}
              id="file-upload-0"
              className="hidden"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 flex-1 h-64">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="h-full bg-gray-200 flex items-center justify-center cursor-pointer relative"
              >
                {images[index] ? (
                  <img
                    src={URL.createObjectURL(images[index])}
                    alt="preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <label htmlFor={`file-upload-${index}`} className="text-gray-500">
                    + Add Photo
                  </label>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, index)}
                  id={`file-upload-${index}`}
                  className="hidden"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-700">Title:</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700">City:</label>
            <Select
              options={cities}
              value={selectedCity}
              onChange={setSelectedCity}
              placeholder="Select a city"
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-700">
              Category:
            </label>
            <select
  className="w-full p-2 border border-gray-300 rounded-md"
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)} // ✅ Fixed
  required
>
  <option value="">Select Category</option>
  {categories.map((cat) => (
    <option key={cat.id} value={cat.name}>
      {cat.name} :- {cat.description}
    </option>
  ))}
  <option value="Other">Other</option>
</select>


            {selectedCategory === "Other" && (
              <input
                type="text"
                placeholder="Enter category"
                value={otherCategory}
                onChange={(e) => setOtherCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded -md mt-2"
              />
            )}
          </div>
          <div>
            <label className="block font-semibold text-gray-700">
              Keywords:
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-700">
              Condition:
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
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
            <label className="block font-semibold text-gray-700">
              Swap or Giveaway:
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
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
                placeholder="Enter Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mt-2"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block font-semibold text-gray-700">
            Description:
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="3"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ItemListing;