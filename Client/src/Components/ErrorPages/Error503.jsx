import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

const Error503 = () => {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      {/* Header */}
      <header className="bg-white h-16 shadow-sm flex items-center justify-between px-6">
        <div className="flex items-center">
          <img src={logo} alt="EcoSwap Logo" className="h-8 w-auto" />
        </div>
        <Link
          to="/"
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Back to Home
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl font-bold text-yellow-600 mb-4">503</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Service Unavailable
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">
          We're taking a moment to nurture our servers, like tending to a
          garden. Please check back soon as we grow stronger!
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Return to EcoSwap
        </Link>
        <div className="mt-8">
          <img
            src="https://images.unsplash.com/photo-1502085671122-3d458fd6a8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
            alt="Garden Maintenance"
            className="rounded-lg shadow-md max-w-xs"
          />
        </div>
      </main>
    </div>
  );
};

export default Error503;
