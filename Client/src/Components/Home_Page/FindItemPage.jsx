import React, { useState } from "react";
import axios from "axios";

const FindItemPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `https://ecoswap-e24p.onrender.com/api/item/dashboard/search?q=${encodeURIComponent(
          searchQuery
        )}`
      );
      setItems(res.data);
    } catch (error) {
      console.error("Search failed", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded text-sm"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded text-sm"
        >
          Search
        </button>
      </form>

      {loading && (
        <p className="text-center text-sm text-gray-600">Loading...</p>
      )}

      {!loading && items.length === 0 && searchQuery && (
        <p className="text-center text-sm text-gray-500">No items found.</p>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item._id} className="border rounded p-3 flex gap-3">
            <img
              src={item.images?.[0]}
              alt={item.itemName}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex flex-col justify-between">
              <h2 className="text-sm font-medium">{item.itemName}</h2>
              <p className="text-xs text-gray-600">{item.description}</p>
              <p className="text-xs text-gray-500">
                {item.category?.name || "No category"} · {item.city}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindItemPage;
