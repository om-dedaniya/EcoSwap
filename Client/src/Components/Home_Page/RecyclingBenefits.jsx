import React, { useState } from "react";
import landfillImage from "../../assets/images/landfill.png";
import naturalResourcesImage from "../../assets/images/natural.png";
import pollutionImage from "../../assets/images/low-emission.png";
import energyImage from "../../assets/images/energy-control.png";
import jobsImage from "../../assets/images/job.png";
import sustainabilityImage from "../../assets/images/sustainable-living.png";

const benefits = [
  {
    title: "Reduces Waste in Landfills",
    shortDesc: "Recycling reduces landfill waste, keeping the environment clean.",
    longDesc: "By recycling, we cut down waste in landfills, preventing harmful toxins from contaminating soil and water.",
    image: landfillImage,
  },
  {
    title: "Saves Natural Resources",
    shortDesc: "Conserves resources like trees, water, and minerals.",
    longDesc: "Recycling reduces deforestation, saves water, and minimizes mining activities, ensuring sustainability.",
    image: naturalResourcesImage,
  },
  {
    title: "Reduces Pollution",
    shortDesc: "Less waste means lower air, water, and land pollution.",
    longDesc: "Recycling helps reduce industrial pollution, resulting in cleaner air, water, and land.",
    image: pollutionImage,
  },
  {
    title: "Saves Energy",
    shortDesc: "Uses less energy than creating new materials.",
    longDesc: "Producing recycled products requires significantly less energy, reducing greenhouse gas emissions.",
    image: energyImage,
  },
  {
    title: "Creates Jobs & Boosts Economy",
    shortDesc: "Recycling industry provides thousands of jobs worldwide.",
    longDesc: "Recycling programs create employment, supporting local economies while benefiting the environment.",
    image: jobsImage,
  },
  {
    title: "Promotes a Sustainable Future",
    shortDesc: "Ensures a greener planet for future generations.",
    longDesc: "By recycling regularly, we leave a sustainable world for future generations to thrive in.",
    image: sustainabilityImage,
  },
];

const RecyclingBenefits = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleReadMore = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-100 py-12 px-6">
      {/* Title */}
      <h2 className="text-4xl font-bold text-green-900 text-center mb-12 drop-shadow-md">
        🌍 Benefits of Recycling & Reuse ♻️
      </h2>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {benefits.map((benefit, index) => (
          <div 
            key={index} 
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            {/* Image */}
            <img 
              src={benefit.image} 
              alt={benefit.title} 
              className="w-20 h-20 mb-4 transition-transform duration-300 hover:rotate-6"
            />
            
            {/* Title */}
            <h3 className="text-xl font-semibold text-green-800">{benefit.title}</h3>

            {/* Description */}
            <p className="text-gray-700 mt-2">
              {expandedIndex === index ? benefit.longDesc : benefit.shortDesc}
            </p>

            {/* Read More Button */}
            <button
              className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition duration-300"
              onClick={() => toggleReadMore(index)}
            >
              {expandedIndex === index ? "Show Less" : "Read More"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecyclingBenefits;
