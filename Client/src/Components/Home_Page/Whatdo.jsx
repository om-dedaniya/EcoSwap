import React, { useState } from "react";
import swap from "../../assets/images/swap.png";
import ecology from "../../assets/images/ecology.png";
import sustainability from "../../assets/images/sustainability.png";
import marketplace from "../../assets/images/online-shopping.png";
import events from "../../assets/images/cost-and-revenue.png";
import footprint from "../../assets/images/animal.png";
import ecoReport from "../../assets/images/eco-report.png";
import greenLiving from "../../assets/images/sustainable-living.png";

const Whatdo = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const services = [
    {
      title: "Item Swapping",
      shortDescription: "Exchange items you no longer need...",
      fullDescription: "Exchange items you no longer need with others who can use them. Categories include electronics, furniture, books, and more.",
      image: swap,
    },
    {
      title: "Recycling Assistance",
      shortDescription: "Discover local recycling services...",
      fullDescription: "Discover local recycling services and centers. Get guidance on how to recycle different materials properly.",
      image: ecology,
    },
    {
      title: "Sustainability Insights",
      shortDescription: "Access educational content on sustainability...",
      fullDescription: "Access educational content and tips on sustainable living. Learn creative ways to repurpose and upcycle items.",
      image: sustainability,
    },
    {
      title: "Community Marketplace",
      shortDescription: "Buy and sell pre-loved items...",
      fullDescription: "Buy and sell pre-loved items to reduce waste and save money. Support eco-friendly businesses by browsing our curated marketplace.",
      image: marketplace,
    },
    {
      title: "Events and Campaigns",
      shortDescription: "Join eco-friendly events and drives...",
      fullDescription: "Participate in community swap meets, recycling drives, and educational workshops. Join global campaigns to promote environmental awareness.",
      image: events,
    },
    {
      title: "Carbon Footprint Tracker",
      shortDescription: "Track and reduce your footprint...",
      fullDescription: "Track and reduce your personal or organizational carbon footprint with our easy-to-use tools.",
      image: footprint,
    },
    {
      title: "Eco-Friendly Business Solutions",
      shortDescription: "Help businesses go green...",
      fullDescription: "Help businesses adopt sustainable practices by offering consulting and partnerships. Enable organizations to donate or recycle excess inventory responsibly.",
      image: ecoReport,
    },
    {
      title: "Green Living Resources",
      shortDescription: "Explore eco-friendly products...",
      fullDescription: "Explore eco-friendly products, DIY guides, sustainable hacks, personalized recommendations, and reviews of sustainable brands.",
      image: greenLiving,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-100 flex flex-col items-center py-12 px-6">
      <h1 className="text-4xl font-bold text-green-900 mb-10 text-center drop-shadow-md">🌱 Our Services</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white bg-opacity-60 shadow-lg rounded-xl p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-2xl border border-transparent hover:border-green-300 backdrop-blur-lg h-full"
          >
            {/* Updated Icon Styling */}
            <div className="w-24 h-24 flex items-center justify-center bg-gradient-to-r from-green-200 to-green-400 rounded-full p-4 shadow-lg border-2 border-white">
              <img src={service.image} alt={service.title} className="w-16 h-16 object-contain drop-shadow-sm" />
            </div>

            {/* Title (Added backdrop-blur-none to prevent blur) */}
            <h3 className="text-2xl font-semibold text-green-900 mt-4 drop-shadow-sm backdrop-blur-none">{service.title}</h3>

            {/* Description with flex-grow for equal height */}
            <p className="text-gray-700 text-sm mt-3 leading-relaxed px-4 backdrop-blur-none flex-grow">
              {expandedIndex === index ? service.fullDescription : service.shortDescription}
            </p>

            {/* Learn More Button (Always Aligned) */}
            <div className="mt-auto pt-4">
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-full shadow-md transition-all hover:bg-green-700 hover:shadow-lg backdrop-blur-none"
              >
                {expandedIndex === index ? "Show Less" : "Learn More"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Whatdo;
