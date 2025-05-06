// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";

// // Smooth Swing Animation (Applied only to the Card Container)
// const swingAnimation = {
//   animate: {
//     rotate: [0, 5, -5, 5, 0], // Gentle oscillation
//     transition: {
//       repeat: Infinity,
//       repeatType: "reverse",
//       duration: 4,
//       ease: "easeInOut",
//     },
//   },
// };

// const Categories = () => {
//   const [memberCount, setMemberCount] = useState(0);
//   const [categoryCount, setCategoryCount] = useState(0);
//   const [itemCount, setItemCount] = useState(0);
//   const [eventCount, setEventCount] = useState(0); // Dummy data

//   useEffect(() => {
//     fetchCounts();
//   }, []);

//   const fetchCounts = async () => {
//     try {
//       const memberRes = await axios.get("https://ecoswap-e24p.onrender.com/api/members/count");
//       setMemberCount(memberRes.data.count - 1);

//       const categoryRes = await axios.get("https://ecoswap-e24p.onrender.com/api/categories/count");
//       setCategoryCount(categoryRes.data.count - 1);

//       const itemRes = await axios.get("https://ecoswap-e24p.onrender.com/api/items/count");
//       setItemCount(itemRes.data.totalItems - 1);
//     } catch (err) {
//       console.error("Error fetching counts", err);
//     }
//   };

//   return (
//     <div className="max-w-screen-xl mx-auto pb-12 text-center">
//       {/* Header Section */}
//       <h2 className="text-3xl font-bold text-green-800 drop-shadow-lg mt-12">📊 EcoSwap Community Stats 📊</h2>
//       <p className="text-lg text-gray-600 mt-2">A growing community of eco-conscious members 🌱</p>

//       {/* Stats Section */}
//       <div className="flex flex-wrap justify-center gap-16 mt-8 px-4">
//         {[
//           { title: "Total Members", count: Math.max(memberCount, 0) + "+" },
//           { title: "Total Categories", count: Math.max(categoryCount, 0) + "+" },
//           { title: "Total Items Listed", count: Math.max(itemCount, 0) + "+" },
//           { title: "Total Events Done", count: eventCount - 1 + "+" },
//         ].map((stat, index) => (
//           <div key={index} className="flex flex-col items-center">
//             {/* Swing Top Circle (Connector) */}
//             <div className="w-10 h-10 bg-green-600 rounded-full flex justify-center items-center relative">
//               <div className="w-5 h-5 bg-green-300 rounded-full"></div>
//             </div>

//             {/* Swing Rope (Static) */}
//             <div className="w-0.5 h-16 bg-black mt-1"></div>

//             {/* Swinging Category Card */}
//             <motion.div
//               className="bg-gradient-to-r from-green-100 to-green-200 rounded-lg shadow-xl px-6 py-4 w-44 h-36 flex flex-col justify-center text-center transform origin-top"
//               {...swingAnimation} // Motion applied here only
//             >
//               <h3 className="text-lg font-bold text-green-900">{stat.title}</h3>
//               <p className="text-xl font-bold text-green-700 mt-2">{stat.count}</p>
//             </motion.div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Categories;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

// Smooth Swing Animation (Applied only to the Card Container)
const swingAnimation = {
  animate: {
    rotate: [0, 5, -5, 5, 0], // Gentle oscillation
    transition: {
      repeat: Infinity,
      repeatType: "reverse",
      duration: 4,
      ease: "easeInOut",
    },
  },
};

const Categories = () => {
  const [memberCount, setMemberCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const memberRes = await axios.get(
        "https://ecoswap-e24p.onrender.com/api/members/count"
      );
      setMemberCount(memberRes.data.count ? memberRes.data.count - 1 : 0);

      const categoryRes = await axios.get(
        "https://ecoswap-e24p.onrender.com/api/categories/count"
      );
      setCategoryCount(categoryRes.data.count ? categoryRes.data.count - 1 : 0);

      const itemRes = await axios.get(
        "https://ecoswap-e24p.onrender.com/api/items/count"
      );
      setItemCount(itemRes.data.totalItems ? itemRes.data.totalItems - 1 : 0);

      // Fetch Completed Events Count (Applying the same logic as items)
      const eventRes = await axios.get(
        "https://ecoswap-e24p.onrender.com/events/completed"
      );
      setEventCount(
        eventRes.data.completedEvents
          ? Math.max(eventRes.data.completedEvents - 1, 0)
          : 0
      );
    } catch (err) {
      console.error("Error fetching counts", err);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto pb-12 text-center">
      {/* Header Section */}
      <h2 className="text-3xl font-bold text-green-800 drop-shadow-lg mt-12">
        📊 EcoSwap Community Stats 📊
      </h2>
      <p className="text-lg text-gray-600 mt-2">
        A growing community of eco-conscious members 🌱
      </p>

      {/* Stats Section */}
      <div className="flex flex-wrap justify-center gap-16 mt-8 px-4">
        {[
          { title: "Total Members", count: Math.max(memberCount, 0) + "+" },
          {
            title: "Total Categories",
            count: Math.max(categoryCount, 0) + "+",
          },
          { title: "Total Items Listed", count: Math.max(itemCount, 0) + "+" },
          {
            title: "Total Events Done",
            count: `${eventCount} +`, // Updated format with -1 logic
          },
        ].map((stat, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Swing Top Circle (Connector) */}
            <div className="w-10 h-10 bg-green-600 rounded-full flex justify-center items-center relative">
              <div className="w-5 h-5 bg-green-300 rounded-full"></div>
            </div>

            {/* Swing Rope (Static) */}
            <div className="w-0.5 h-16 bg-black mt-1"></div>

            {/* Swinging Category Card */}
            <motion.div
              className="bg-gradient-to-r from-green-100 to-green-200 rounded-lg shadow-xl px-6 py-4 w-44 h-36 flex flex-col justify-center text-center transform origin-top"
              {...swingAnimation} // Motion applied here only
            >
              <h3 className="text-lg font-bold text-green-900">{stat.title}</h3>
              <p className="text-xl font-bold text-green-700 mt-2">
                {stat.count}
              </p>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
