import React from "react";

const SuccessStory = () => {
  const stories = [
    {
      name: "Sarah Mitchell",
      role: "Environmental Advocate",
      image: "https://via.placeholder.com/50",
      text: "Through EcoSwap, I've managed to reduce my household waste by 75% and connected with amazing people who share my vision for a sustainable future.",
    },
    {
      name: "James Chen",
      role: "Tech Entrepreneur",
      image: "https://via.placeholder.com/50",
      text: "I've found a way to responsibly dispose of old electronics while helping others access technology. The platform is intuitive and the community is fantastic.",
    },
    {
      name: "Michael Thompson",
      role: "Education Specialist",
      image: "https://via.placeholder.com/50",
      text: "The educational resources and workshops have transformed how my students think about sustainability. It's making a real difference in our community.",
    },
  ];

  return (
    <div className="bg-white py-16 px-6 md:px-12 lg:px-24 text-center">
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-gray-800">Success Stories</h2>
        <p className="text-lg text-gray-600 mt-3">Real impact from our community members</p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {stories.map((story, index) => (
          <div
            key={index}
            className="relative bg-white shadow-lg rounded-xl p-6 transition-transform transform hover:scale-105 hover:shadow-2xl border border-gray-200"
          >
            {/* Avatar & Name */}
            <div className="flex items-center space-x-4">
              <img src={story.image} alt={story.name} className="w-14 h-14 rounded-full border-2 border-gray-300" />
              <div className="text-left">
                <h5 className="text-lg font-semibold text-gray-800">{story.name}</h5>
                <small className="text-sm text-gray-500">{story.role}</small>
              </div>
            </div>

            {/* Testimonial */}
            <p className="mt-4 text-gray-600 italic">"{story.text}"</p>

            {/* Star Ratings */}
            <div className="mt-4 text-yellow-500 text-lg">⭐⭐⭐⭐⭐</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuccessStory;
