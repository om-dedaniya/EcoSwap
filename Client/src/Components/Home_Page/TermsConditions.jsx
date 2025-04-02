import React from "react";
import { useNavigate } from "react-router-dom";

const TermsConditions = () => {
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
          Terms & Conditions
        </h1>

        {/* Terms Content */}
        <div className="space-y-6">
          <p>
            By using EcoSwap, you agree to the following terms and conditions.
          </p>

          {/* Terms Sections */}
          {[
            {
              title: "User Responsibilities",
              content: "Users must provide accurate item descriptions and maintain respectful communication."
            },
            {
              title: "Prohibited Items",
              content: (
                <>
                  The following items are prohibited:
                  <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                    <li>Illegal or stolen goods</li>
                    <li>Weapons, drugs, and hazardous materials</li>
                    <li>Alcohol, tobacco, and perishable food</li>
                  </ul>
                </>
              )
            },
            {
              title: "Swapping Process",
              content: "All transactions are directly between users. EcoSwap does not handle payments or deliveries."
            },
            {
              title: "User Conduct",
              content: "Any misuse of the platform, such as harassment or fraud, may result in account suspension."
            },
            {
              title: "Account Termination",
              content: "EcoSwap reserves the right to terminate accounts that violate these terms."
            },
            {
              title: "Limitation of Liability",
              content: "EcoSwap is not responsible for any losses, damages, or disputes arising from item exchanges."
            },
            {
              title: "Contact Information",
              content: (
                <>
                  For any inquiries, please reach out at{" "}
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

export default TermsConditions;
