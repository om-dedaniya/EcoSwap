import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

import errorImage from "../../assets/images/404.png";

const Error404 = () => {
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
        <div className="mt-8">
          <img
            // src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
            src={errorImage}
            alt="Nature"
            className="rounded-lg shadow-md max-w-xs"
          />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">
          It looks like this page has wandered off into the forest. Let's get
          back to nurturing our planet together!
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Return to EcoSwap
        </Link>
      </main>
    </div>
  );
};

export default Error404;
