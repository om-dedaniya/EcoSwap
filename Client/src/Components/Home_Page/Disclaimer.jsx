import React from "react";
import { useNavigate } from "react-router-dom";

const Disclaimer = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 px-6 py-10 md:py-16">
      <div className="max-w-3xl mt-5 mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate("/")} 
          className="flex items-center text-green-600 hover:text-green-700 font-semibold mb-6 transition"
        >
          ← Back
        </button>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
          Disclaimer
        </h1>

        {/* Disclaimer Content */}
        <div className="space-y-6">
          <p>
            EcoSwap is a peer-to-peer platform that facilitates item swapping. We do not assume responsibility for user interactions or transactions.
          </p>

          {/* Sections */}
          {[
            {
              title: "No Warranty on Items",
              content: "EcoSwap does not guarantee the condition, authenticity, or functionality of listed items."
            },
            {
              title: "User Responsibility",
              content: "Users must verify item details before finalizing exchanges. Any issues must be resolved between the swapping parties."
            },
            {
              title: "No Legal Liability",
              content: "EcoSwap is not liable for any damages, fraud, or misconduct occurring between users."
            },
            {
              title: "Reporting Issues",
              content: "Users can report fraudulent activities, but EcoSwap does not intervene in individual disputes."
            },
            {
              title: "Changes to This Disclaimer",
              content: "We reserve the right to update this disclaimer as necessary."
            },
            {
              title: "Contact Information",
              content: (
                <>
                  If you have concerns, please contact us at{" "}
                  <strong className="text-green-600">ecoswap@gmail.com</strong>.
                </>
              )
            }
          ].map((section, index) => (
            <div key={index} className="border-b border-gray-200 pb-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                {index + 1}. {section.title}
              </h3>
              <p className="text-gray-700 mt-2">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
