import React from "react";
import aboutImage from "../../assets/images/about.png"; // Ensure the correct image path

const Aboutus = () => {
  return (
    <section className="w-full px-4 md:px-12 py-12 bg-gradient-to-b from-green-200 to-green-100">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
          ABOUT <span className="text-green-600">ECOSWAP</span>
        </h2>
      </div>

      {/* Container */}
      <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12 md:gap-8 lg:gap-16">
        
        {/* Left Side - Text Content */}
        <div className="w-full md:w-1/2 text-gray-700 space-y-5">
          <p className="text-lg leading-relaxed text-justify">
            Welcome to our online platform, where we aim to promote sustainable
            consumption and reduce environmental impact through the power of
            exchanging and recycling.
          </p>
          <p className="text-lg leading-relaxed text-justify">
            At <strong className="text-green-600">EcoSwap</strong>, we believe in
            the importance of preserving natural resources and reducing waste by
            fostering exchange and recycling habits. Our platform provides a
            space for individuals to come together, share unnecessary items,
            showcase creative upcycling projects, and take part in meaningful
            conversations about recycling resources.
          </p>
          <p className="text-lg leading-relaxed text-justify">
            On <strong className="text-green-600">EcoSwap</strong>, you can easily
            list items you no longer need and discover offers from other users.
            The process is simple and safe, with verified participants ensuring
            honesty and reliability. Every small step counts - your unwanted items
            can become someone else's treasure. Join us in making the world cleaner
            and better!
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={aboutImage}
            alt="About EcoSwap"
            className="w-10/12 md:w-4/5 lg:w-3/4 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
};

export default Aboutus;
