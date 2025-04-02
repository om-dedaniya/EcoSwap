import React from "react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
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
          Privacy Policy
        </h1>

        {/* Privacy Policy Content */}
        <div className="space-y-6">
          <p>
            EcoSwap values your privacy and is committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data.
          </p>

          {/* Sections */}
          {[
            {
              title: "Information We Collect",
              content: "We collect personal information such as name, email, phone number, and location when you register on EcoSwap."
            },
            {
              title: "How We Use Your Information",
              content: (
                <>
                  Your data is used for the following purposes:
                  <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                    <li>To create and manage your account</li>
                    <li>To enable item listing and swapping</li>
                    <li>To improve user experience</li>
                    <li>To prevent fraudulent activities</li>
                  </ul>
                </>
              )
            },
            {
              title: "Sharing of Information",
              content: "EcoSwap does not sell or share your personal information with third parties for marketing purposes."
            },
            {
              title: "Data Security",
              content: "We implement security measures to protect your personal data from unauthorized access."
            },
            {
              title: "Cookies and Tracking",
              content: "EcoSwap uses cookies to enhance user experience. You can disable cookies through your browser settings."
            },
            {
              title: "Changes to This Policy",
              content: "We may update this policy from time to time. Please check periodically for updates."
            },
            {
              title: "Contact Us",
              content: (
                <>
                  If you have any questions about our privacy policy, email us at{" "}
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

export default PrivacyPolicy;
