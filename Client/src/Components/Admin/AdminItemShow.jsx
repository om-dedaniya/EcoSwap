// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const AdminItemShow = () => {
//   const [items, setItems] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 15;

//   useEffect(() => {
//     fetchItems();
//     fetchCategories();
//   }, []);

//   const fetchItems = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get("http://localhost:5000/items");
//       setItems(response.data.items);
//     } catch (error) {
//       console.error("Error fetching items:", error);
//     }
//     setLoading(false);
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/categories");
//       // Extract category names before the ":-"
//       const extractedCategories = response.data.map(cat => {
//         const categoryName = cat.name.split(":-")[0].trim(); // Get the part before ":-"
//         return { _id: cat._id, name: categoryName }; // Return an object with id and name
//       });
//       setCategories(extractedCategories);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this item?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/items/${id}`);
//       setItems(items.filter((item) => item._id !== id));
//     } catch (error) {
//       console.error("Error deleting item:", error);
//     }
//   };

//   const handleMessage = (email) => {
//     window.location.href = `mailto:${email}?subject=Inquiry about your listed item&body=Hello, I am interested in your item listed on EcoSwap.`;
//   };

//   const filteredItems = items.filter((item) => {
//     const matchesSearchTerm = item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = selectedCategory === "" || item.category === selectedCategory;
//     return matchesSearchTerm && matchesCategory;
//   });

//   // Pagination logic
//   const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

//   const handleNextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Admin Item Management</h2>

//       {/* Search and Category Filter */}
//       <div className="flex gap-4 mb-4">
//         <input
//           type="text"
//           className="border border-gray-300 rounded-lg p-2 w-full"
//           placeholder="Search by item name..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <select
//           className="border border-gray-300 rounded-lg p-2"
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//         >
//           <option value="">All Categories</option>
//           {categories.map((cat) => (
//             <option key={cat._id} value={cat.name}>
//               {cat.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Item Table */}
//       <div className="overflow-x-auto">
//         {loading ? (
//           <p className="text-gray-500">Loading items...</p>
//         ) : (
//           <table className="min-w-full bg-white shadow-md rounded-lg">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="py-2 px-4 text-left">#</th>
//                 <th className="py-2 px-4 text-left">Item Name</th>
//                 <th className="py-2 px-4 text-left">Category</th>
//                 <th className="py-2 px-4 text-left">City</th>
//                 <th className="py-2 px-4 text-left">Condition</th>
//                 <th className="py-2 px-4 text-left">Swap/Giveaway</th>
//                 <th className="py-2 px-4 text-left">Price</th>
//                 <th className="py-2 px-4 text-left">Listed By</th>
//                 <th className="py-2 px-4 text-left">Images</th>
//                 <th className="py-2 px-4 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentItems.length === 0 ? (
//                 <tr>
//                   <td colSpan="10" className="text-center py-4 text-gray-500">
//                     No items found.
//                   </td>
//                 </tr>
//               ) : (
//                 currentItems.map((item, index) => (
//                   <tr key={item._id} className="border-b">
//                     <td className="py-2 px-4">{indexOfFirstItem + index + 1}</td>
//                     <td className="py-2 px-4">{item.itemName}</td>
//                     <td className="py-2 px-4">{item.category}</td>
//                     <td className="py-2 px-4">{item.city}</td>
//                     <td className="py-2 px-4">{item.condition}</td>
//                     <td className="py-2 px-4">{item.swapOrGiveaway}</td>
//                     <td className="py-2 px-4">{item.price || "Free"}</td>
//                     <td className="py-2 px-4">{item.userName} ({item.email})</td>
//                     <td className="py-2 px-4">
//                       {item.images.map((img, imgIndex) => (
//                         <button
//                           key={imgIndex}
//                           className="text-blue-500 underline mr-2"
//                           onClick={() => setImagePreview(img)}
//                         >
//                           View
//                         </button>
//                       ))}
//                     </td>
//                     <td className="py-2 px-4">
//                       <button
//                         className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 mr-2"
//                         onClick={() => handleDelete(item._id)}
//                       >
//                         🗑 Delete
//                       </button>
//                       <button
//                         className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
//                         onClick={() => handleMessage(item.email)}
//                       >
//                         ✉ Message
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-between mt-4">
//         <button
//           className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
//           onClick={handlePrevPage}
//           disabled={currentPage === 1}
//         >
//           ← Previous
//         </button>
//         <span>Page {currentPage} of {totalPages}</span>
//         <button
//           className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
//           onClick={handleNextPage}
//           disabled={currentPage === totalPages}
//         >
//           Next →
//         </button>
//       </div>

//       {/* Image Preview Modal */}
//       {imagePreview && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-5 rounded-lg shadow-lg relative">
//             <button className="absolute top-2 right-2" onClick={() => setImagePreview(null)}>✖</button>
//             <img src={imagePreview} alt="Preview" className="max-w-[90vw] max-h-[80vh] rounded-lg"/>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminItemShow;


import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminItemShow = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/items");
      setItems(response.data.items);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`http://localhost:5000/items/${id}`);
      setItems(items.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleMessage = (email) => {
    window.location.href = `mailto:${email}?subject=Inquiry about your listed item&body=Hello, I am interested in your item listed on EcoSwap.`;
  };

  const filteredItems = items.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "" || item.category === selectedCategory)
  );

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Admin Item Management
      </h2>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          className="border p-2 rounded w-full sm:w-1/2"
          placeholder="Search by item name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border p-2 rounded w-full sm:w-1/4"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">#</th>
              <th className="border p-2">Item Name</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">City</th>
              <th className="border p-2">Condition</th>
              <th className="border p-2">Swap/Giveaway</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Listed By</th>
              <th className="border p-2">Images</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center p-4">
                  Loading items...
                </td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center p-4">
                  No items found.
                </td>
              </tr>
            ) : (
              currentItems.map((item, index) => (
                <tr key={item._id} className="border-t">
                  <td className="border p-2">{indexOfFirstItem + index + 1}</td>
                  <td className="border p-2">{item.itemName}</td>
                  <td className="border p-2">{item.category}</td>
                  <td className="border p-2">{item.city}</td>
                  <td className="border p-2">{item.condition}</td>
                  <td className="border p-2">{item.swapOrGiveaway}</td>
                  <td className="border p-2">{item.price || "Free"}</td>
                  <td className="border p-2">
                    {item.userName} ({item.email})
                  </td>
                  <td className="border p-2">
                    {item.images.map((img, imgIndex) => (
                      <button
                        key={imgIndex}
                        className="text-blue-600 underline"
                        onClick={() => setImagePreview(img)}
                      >
                        View {imgIndex + 1}
                      </button>
                    ))}
                  </td>
                  <td className="border p-2">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded mr-2"
                      onClick={() => handleDelete(item._id)}
                    >
                      🗑 Delete
                    </button>
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                      onClick={() => handleMessage(item.email)}
                    >
                      ✉ Message
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-gray-800 text-white"}`}
          disabled={currentPage === 1}
        >
          ← Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-gray-800 text-white"}`}
          disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </div>

      {/* Image Preview Modal */}
      {imagePreview && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setImagePreview(null)}
        >
          <div className="bg-white p-4 rounded shadow-lg">
            <h5 className="text-lg font-semibold mb-2">Image Preview</h5>
            <img src={imagePreview} alt="Preview" className="max-w-full h-auto rounded" />
            <button
              className="mt-4 bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => setImagePreview(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminItemShow;

