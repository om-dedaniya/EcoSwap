import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa"; // Icons for hamburger menu
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { Link as ScrollLink } from "react-scroll"; // Import react-scroll for section navigation
import logo from "../../assets/images/logo.png"; // Logo image

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white px-6 py-3 shadow-md fixed w-full z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo with Link to Home Page */}
        <div className="logo cursor-pointer">
          <Link to="/">
            <img src={logo} alt="Logo" className="w-36 h-auto" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 font-bold">
          {[
            { name: "About Us", id: "aboutus-section" },
            { name: "EcoSwap-State", id: "categories-section" },
            { name: "Recycling", id: "recycle-section" },
            { name: "Benefits", id: "benefits-section" },
            { name: "Events", id: "events-section" },
            { name: "Services", id: "services-section" },
            { name: "Vision", id: "mission-section" },
            { name: "How It Works", id: "howitworks-section" },
            { name: "Why Us", id: "whychooseus-section" },
            { name: "Success Stories", id: "success-stories-section" },
            { name: "Blog", id: "blog-section" },
            { name: "Need Help", id: "need-help-section" },
          ].map((item, index) => (
            <ScrollLink
              key={index}
              to={item.id}
              smooth={true}
              duration={500}
              className="text-black text-sm transition duration-300 hover:text-green-600 transform hover:scale-105 cursor-pointer"
            >
              {item.name}
            </ScrollLink>
          ))}
        </div>

        {/* Login Button */}
        <Link
          to="/login"
          className="hidden md:block bg-green-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-green-700 transition duration-300"
        >
          Log In
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`${
          menuOpen ? "flex" : "hidden"
        } flex-col absolute top-14 right-0 bg-white w-1/2 text-center shadow-lg p-5 space-y-3 font-bold md:hidden`}
      >
        {[
          { name: "About Us", id: "aboutus-section" },
          { name: "EcoSwap-State", id: "categories-section" },
          { name: "Recycling", id: "recycle-section" },
          { name: "Benefits", id: "benefits-section" },
          { name: "Events", id: "events-section" },
          { name: "Services", id: "services-section" },
          { name: "Vision", id: "mission-section" },
          { name: "How It Works", id: "howitworks-section" },
          { name: "Why Us", id: "whychooseus-section" },
          { name: "Success Stories", id: "success-stories-section" },
          { name: "Blog", id: "blog-section" },
          { name: "Need Help", id: "need-help-section" },
        ].map((item, index) => (
          <ScrollLink
            key={index}
            to={item.id}
            smooth={true}
            duration={500}
            className="text-black text-sm transition duration-300 hover:text-green-600 transform hover:scale-105 cursor-pointer"
            onClick={() => setMenuOpen(false)}
          >
            {item.name}
          </ScrollLink>
        ))}

        {/* Login Button in Mobile Menu */}
        <Link
          to="/login"
          className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-green-700 transition duration-300"
        >
          Log In
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
