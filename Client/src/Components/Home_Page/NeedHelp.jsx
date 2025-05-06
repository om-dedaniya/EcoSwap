import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeadset,
  faCircleQuestion,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const NeedHelp = () => {
  const navigate = useNavigate();

  // Handle Support Click (SweetAlert)
  const handleSupportClick = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Need Assistance?",
      text: "For any help, please refer to the 'Raise Query' section after logging in.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Login",
      cancelButtonText: "OK",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");
      }
    });
  };

  // Help Options Data
  const helpOptions = [
    {
      title: "Browse FAQs",
      text: "Find answers to common questions",
      icon: faBook,
      link: "/faq",
    },
    {
      title: "Contact Support",
      text: "Get in touch with our support team",
      icon: faHeadset,
      link: "#",
      action: handleSupportClick,
    },
    {
      title: "Inquiry",
      text: "For more inquiries, please mail us at ecoswap@gmail.com",
      icon: faCircleQuestion,
      link: "mailto:eco-swap@outlook.com",
    },
  ];

  return (
    <div className=" bg-gradient-to-b from-white to-gray-100 py-16 px-6 md:px-12 lg:px-24">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800">Need Help?</h2>
        <p className="text-lg text-gray-600 mt-3">
          Our support team is here to help you with any questions or concerns
          you may have.
        </p>
      </div>

      {/* Help Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {helpOptions.map((help, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            <FontAwesomeIcon
              icon={help.icon}
              className="text-green-500 text-4xl mb-4"
            />
            <h5 className="text-xl font-semibold text-gray-800">
              {help.title}
            </h5>
            <p className="mt-2 text-gray-600">{help.text}</p>
            <a
              href={help.link}
              className="mt-4 bg-green-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-all"
              onClick={help.action ? help.action : null}
            >
              Learn More →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NeedHelp;
