import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gradient-to-b from-[#C8E6C9] to-[#E8F5E9] py-10 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-gray-800">
        {/* Logo Section */}
        <div className="flex flex-col items-center sm:items-start">
          <img src={logo} alt="EcoSwap Logo" className="w-32 mb-3" />
          <p className="text-center sm:text-left text-sm">
            Empowering sustainability, one swap at a time.
          </p>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Useful Links</h3>
          <ul className="space-y-2 text-sm">
            <li
              className="cursor-pointer hover:text-green-700 transition"
              onClick={() => navigate("/faq")}
            >
              FAQ
            </li>
            <li
              className="cursor-pointer hover:text-green-700 transition"
              onClick={() => navigate("/termsandconditions")}
            >
              Terms & Conditions
            </li>
            <li
              className="cursor-pointer hover:text-green-700 transition"
              onClick={() => navigate("/privacypolicy")}
            >
              Privacy Policy
            </li>
            <li
              className="cursor-pointer hover:text-green-700 transition"
              onClick={() => navigate("/disclaimer")}
            >
              Disclaimer
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <p className="text-sm mt-2">📧 eco-swap@outlook.com</p>
          <p className="text-sm mt-2">📞 +91 7990075716</p>
          <p className="text-sm mt-2">📍 Navsari, Gujarat</p>
        </div>

        {/* Signup/Login Section */}
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-semibold mb-3">Get Started</h3>
          <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
            <button
              className="bg-green-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition"
              onClick={() => navigate("/signup")}
            >
              SIGN UP
            </button>
            <button
              className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
              onClick={() => navigate("/login")}
            >
              LOGIN
            </button>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center text-gray-600 text-sm mt-10">
        © 2025 EcoSwap. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
