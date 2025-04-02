// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const ItemSearch = () => {
//   const [items, setItems] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [category, setCategory] = useState("");
//   const [city, setCity] = useState("");
//   const [swapOrGiveaway, setSwapOrGiveaway] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const itemsPerPage = 15;

//   useEffect(() => {
//     fetchItems();
//   }, [currentPage, searchTerm, category, city, swapOrGiveaway]);

//   const fetchItems = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/items?search=${searchTerm}&category=${category}&city=${city}&swapOrGiveaway=${swapOrGiveaway}&page=${currentPage}&limit=${itemsPerPage}`
//       );
//       setItems(response.data.items);
//       setTotalPages(response.data.totalPages);
//     } catch (error) {
//       console.error("Error fetching items:", error);
//     }
//   };

//   const openImageModal = (item, index) => {
//     setSelectedItem(item);
//     setCurrentImageIndex(index);
//   };

//   const closeModal = () => {
//     setSelectedItem(null);
//     setCurrentImageIndex(0);
//   };

//   const nextImage = () => {
//     setCurrentImageIndex((prev) =>
//       prev === selectedItem.images.length - 1 ? 0 : prev + 1
//     );
//   };

//   const prevImage = () => {
//     setCurrentImageIndex((prev) =>
//       prev === 0 ? selectedItem.images.length - 1 : prev - 1
//     );
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h2 className="text-2xl font-bold text-center mb-6">🔍 Find Items</h2>

//       {/* Search Filters */}
//       <div className="flex flex-wrap gap-4 justify-center mb-6">
//         <input
//           type="text"
//           placeholder="Search by Item Name"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <select
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           className="px-3 py-2 border rounded-lg"
//         >
//           <option value="">All Categories</option>
//           <option value="Electronics">Electronics</option>
//           <option value="Furniture">Furniture</option>
//           <option value="Clothing">Clothing</option>
//         </select>
//         <input
//           type="text"
//           placeholder="Search by City"
//           value={city}
//           onChange={(e) => setCity(e.target.value)}
//           className="px-3 py-2 border rounded-lg"
//         />
//         <select
//           value={swapOrGiveaway}
//           onChange={(e) => setSwapOrGiveaway(e.target.value)}
//           className="px-3 py-2 border rounded-lg"
//         >
//           <option value="">All</option>
//           <option value="Swap">Swap</option>
//           <option value="Giveaway">Giveaway</option>
//         </select>
//       </div>

//       {/* Items List */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {items.length > 0 ? (
//           items.map((item) => (
//             <div key={item._id} className="border p-4 rounded-lg shadow hover:shadow-lg transition">
//               <img
//                 src={item.images[0]}
//                 alt={item.itemName}
//                 className="w-full h-48 object-cover rounded-lg cursor-pointer"
//                 onClick={() => openImageModal(item, 0)}
//               />
//               <h3 className="text-lg font-semibold mt-2">{item.itemName}</h3>
//               <p className="text-sm text-gray-600"><strong>Description:</strong> {item.description}</p>
//               <p className="text-sm text-gray-700"><strong>Category:</strong> {item.category}</p>
//               <p className="text-sm text-gray-700"><strong>City:</strong> {item.city}</p>
//               <p className="text-sm text-gray-700"><strong>Type:</strong> {item.swapOrGiveaway}</p>
//               <button className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600 transition">📩 Message</button>
//             </div>
//           ))
//         ) : (
//           <p className="text-center col-span-3 text-gray-600">No items found.</p>
//         )}
//       </div>

//       {/* Pagination Controls */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-4 mt-6">
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:bg-gray-300"
//           >
//             ⬅ Previous
//           </button>

//           <span className="text-lg font-semibold">Page {currentPage} of {totalPages}</span>

//           <button
//             onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:bg-gray-300"
//           >
//             Next ➡
//           </button>
//         </div>
//       )}

//       {/* Fullscreen Image Modal */}
//       {selectedItem && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
//           <div className="relative max-w-xl">
//             <button className="absolute top-2 right-2 bg-white p-2 rounded-full" onClick={closeModal}>✖</button>
//             <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full" onClick={prevImage}>⬅</button>
//             <img
//               src={selectedItem.images[currentImageIndex]}
//               alt="Full View"
//               className="w-full max-h-[80vh] rounded-lg"
//             />
//             <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full" onClick={nextImage}>➡</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
// export default ItemSearch;



// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import debounce from "lodash.debounce";

// const ItemSearch = () => {
//   const [items, setItems] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [category, setCategory] = useState("");
//   const [city, setCity] = useState("");
//   const [swapOrGiveaway, setSwapOrGiveaway] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const itemsPerPage = 15;

//   // ✅ Fetch categories on mount
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const { data } = await axios.get("http://localhost:5000/categories");
//         setCategories(data);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // ✅ Debounced fetch items
//   const fetchItems = useCallback(
//     debounce(async () => {
//       try {
//         const { data } = await axios.get("http://localhost:5000/api/items", {
//           params: {
//             search: searchTerm,
//             category: category !== "All Categories" ? category : "",
//             city,
//             swapOrGiveaway,
//             page: currentPage,
//             limit: itemsPerPage,
//           },
//         });
//         setItems(data.items);
//         setTotalPages(data.totalPages);
//       } catch (error) {
//         console.error("Error fetching items:", error);
//       }
//     }, 300),
//     [searchTerm, category, city, swapOrGiveaway, currentPage]
//   );

//   useEffect(() => {
//     fetchItems();
//     return () => fetchItems.cancel();
//   }, [fetchItems]);

//   // ✅ Handle category change
//   const handleCategoryChange = (e) => {
//     setCategory(e.target.value);
//     setCurrentPage(1);
//   };

//   // ✅ Handle modal interactions
//   const openImageModal = (item, index) => {
//     setSelectedItem(item);
//     setCurrentImageIndex(index);
//   };

//   const closeModal = () => {
//     setSelectedItem(null);
//   };

//   const nextImage = () => {
//     setCurrentImageIndex((prev) =>
//       prev === selectedItem.images.length - 1 ? 0 : prev + 1
//     );
//   };

//   const prevImage = () => {
//     setCurrentImageIndex((prev) =>
//       prev === 0 ? selectedItem.images.length - 1 : prev - 1
//     );
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h2 className="text-2xl font-bold text-center mb-6">🔍 Find Items</h2>

//       {/* Search Filters */}
//       <div className="flex flex-wrap gap-4 justify-center mb-6">
//         <input
//           type="text"
//           placeholder="Search by Item Name"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//         />
//         <select value={category} onChange={handleCategoryChange} className="px-3 py-2 border rounded-lg">
//           <option value="">All Categories</option>
//           {categories.map((cat, index) => (
//             <option key={index} value={cat.name}>
//               {cat.name}
//             </option>
//           ))}
//         </select>
//         {/* <input
//           type="text"
//           placeholder="Search by City"
//           value={city}
//           onChange={(e) => setCity(e.target.value)}
//           className="px-3 py-2 border rounded-lg"
//         /> */}
//         <select value={swapOrGiveaway} onChange={(e) => setSwapOrGiveaway(e.target.value)} className="px-3 py-2 border rounded-lg">
//           <option value="">All</option>
//           <option value="Swap">Swap</option>
//           <option value="Giveaway">Giveaway</option>
//         </select>
//       </div>

//       {/* Items List */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {items.length > 0 ? (
//           items.map((item) => (
//             <div key={item._id} className="border p-4 rounded-lg shadow hover:shadow-lg transition">
//               {item.images?.length > 0 ? (
//                 <img
//                   src={
//                     item.images[0].startsWith("http")
//                       ? item.images[0]
//                       : `http://localhost:5000/uploads/${item.images[0]}`
//                   }
//                   alt={item.itemName}
//                   className="w-full h-48 object-cover rounded-lg cursor-pointer"
//                   onClick={() => openImageModal(item, 0)}
//                   onError={(e) => (e.target.src = "/placeholder.png")}
//                 />
//               ) : (
//                 <p className="text-center text-gray-500">No Image Available</p>
//               )}
//               <h3 className="text-lg font-semibold mt-2">{item.itemName}</h3>
//               <p className="text-sm text-gray-600">
//                 <strong>Description:</strong> {item.description}
//               </p>
//               <p className="text-sm text-gray-700">
//                 <strong>Category:</strong> {item.category}
//               </p>
//               <p className="text-sm text-gray-700">
//                 <strong>City:</strong> {item.city}
//               </p>
//               <p className="text-sm text-gray-700">
//                 <strong>Type:</strong> {item.swapOrGiveaway}
//               </p>
//             </div>
//           ))
//         ) : (
//           <p className="text-center col-span-3 text-gray-600">No items found.</p>
//         )}
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-4 mt-6">
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
//           >
//             ⬅ Previous
//           </button>
//           <span className="text-lg font-semibold">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
//           >
//             Next ➡
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ItemSearch;

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce";

const ItemSearch = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [swapOrGiveaway, setSwapOrGiveaway] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  const itemsPerPage = 15;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/categories");
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const fetchItems = useCallback(
    debounce(async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/items", {
          params: {
            search: searchTerm,
            category: category || "",
            city: city || "",
            swapOrGiveaway: swapOrGiveaway || "",
            page: currentPage,
            limit: itemsPerPage,
          },
        });
        setItems(data.items);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    }, 300),
    [searchTerm, category, city, swapOrGiveaway, currentPage]
  );

  useEffect(() => {
    fetchItems();
    return () => fetchItems.cancel();
  }, [fetchItems]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
    setCurrentPage(1);
  };

  const handleMessage = (item) => {
    alert(`Message sent to the owner of "${item.itemName}"!`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">🔍 Find Items</h2>

      {/* Search Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <input
          type="text"
          placeholder="Search by Item Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <select value={category} onChange={handleCategoryChange} className="px-3 py-2 border rounded-lg">
          <option value="">All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search by City"
          value={city}
          onChange={handleCityChange}
          className="px-3 py-2 border rounded-lg"
        />
        <select value={swapOrGiveaway} onChange={(e) => setSwapOrGiveaway(e.target.value)} className="px-3 py-2 border rounded-lg">
          <option value="">All</option>
          <option value="Swap">Swap</option>
          <option value="Giveaway">Giveaway</option>
        </select>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item._id} className="border p-4 rounded-lg shadow hover:shadow-lg transition">
              {item.images?.length > 0 ? (
                <img
                  src={
                    item.images[0].startsWith("http")
                      ? item.images[0]
                      : `http://localhost:5000/uploads/${item.images[0]}`
                  }
                  alt={item.itemName}
                  className="w-full h-48 object-cover rounded-lg cursor-pointer"
                  onClick={() => setSelectedImage(item.images[0])}
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
              ) : (
                <p className="text-center text-gray-500">No Image Available</p>
              )}
              <h3 className="text-lg font-semibold mt-2">{item.itemName}</h3>
              <p className="text-sm text-gray-600">
                <strong>Description:</strong> {item.description}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Category:</strong> {item.category}
              </p>
              <p className="text-sm text-gray-700">
                <strong>City:</strong> {item.city}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Type:</strong> {item.swapOrGiveaway}
              </p>
              <button
                onClick={() => handleMessage(item)}
                className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 w-full"
              >
                Message
              </button>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-600">No items found.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            ⬅ Previous
          </button>
          <span className="text-lg font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            Next ➡
          </button>
        </div>
      )}

      {/* Full-Screen Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative">
            <button
              className="absolute top-2 right-2 bg-white p-2 rounded-full text-black"
              onClick={() => setSelectedImage(null)}
            >
              ✖
            </button>
            <img
              src={`http://localhost:5000/uploads/${selectedImage}`}
              alt="Full Size"
              className="max-w-full max-h-screen rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemSearch;






