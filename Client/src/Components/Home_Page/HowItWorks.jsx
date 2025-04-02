import React from "react";
import { motion } from "framer-motion";
import { FaUserPlus, FaClipboardList, FaSearch, FaComments, FaExchangeAlt, FaLeaf, FaUsers, FaCalendarCheck } from "react-icons/fa";

const steps = [
  { title: "Sign Up & Get Started", description: "Create an account to explore and exchange items with others.", icon: <FaUserPlus /> },
  { title: "List an Item", description: "Upload and share items that you want to exchange or give away.", icon: <FaClipboardList /> },
  { title: "Find the Item You Want", description: "Search for items based on category, location, and availability.", icon: <FaSearch /> },
  { title: "Connect with Users", description: "Chat with item owners and discuss exchange details.", icon: <FaComments /> },
  { title: "Exchange or Processing", description: "Safely complete the exchange or process the item for reuse.", icon: <FaExchangeAlt /> },
  { title: "Impact on the Environment", description: "Reduce waste by giving items a second life.", icon: <FaLeaf /> },
  { title: "Join the Community", description: "Engage with like-minded people and contribute to sustainability.", icon: <FaUsers /> },
  { title: "Participate in Environmental Events", description: "Take part in public or private eco-friendly activities.", icon: <FaCalendarCheck /> },
];

const Step = ({ step, index }) => {
  return (
    <div className="relative flex w-full md:w-2/3 lg:w-1/2 mx-auto">
      {/* Connecting Rope (Line) */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-full bg-green-500 rounded-full"></div>

      {/* Step Container */}
      <motion.div
        className={`relative flex items-center w-full bg-white shadow-lg rounded-lg p-6 space-x-5 transition-all duration-300 hover:scale-105 ${
          index % 2 === 0 ? "ml-auto text-right" : "mr-auto text-left"
        }`}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {/* Step Number */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-green-600 text-white flex items-center justify-center rounded-full text-lg font-bold shadow-md">
          {index + 1}
        </div>

        {/* Icon */}
        <div className="text-green-600 text-4xl">{step.icon}</div>

        {/* Text Content */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{step.title}</h2>
          <p className="text-gray-600 text-sm">{step.description}</p>
        </div>
      </motion.div>
    </div>
  );
};

const HowItWorks = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-6 md:px-16">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-16">How It Works</h1>

      <div className="relative flex flex-col items-center">
        {/* Timeline Rope */}
        <div className="absolute w-2 bg-green-500 h-full left-1/2 transform -translate-x-1/2"></div>

        {/* Steps */}
        <div className="relative w-full flex flex-col space-y-16">
          {steps.map((step, index) => (
            <Step key={index} step={step} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
