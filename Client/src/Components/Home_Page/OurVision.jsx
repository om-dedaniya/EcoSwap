import React from "react";

const OurVision = () => {
    return (
        <div className="relative overflow-hidden bg-gradient-to-b from-green-200 to-green-100 p-10 sm:p-16 text-gray-800 shadow-lg">
            {/* Floating Light Elements */}
            <div className="absolute top-8 left-6 w-32 h-32 bg-white opacity-30 rounded-full blur-3xl animate-floaty"></div>
            <div className="absolute bottom-12 right-8 w-32 h-32 bg-white opacity-30 rounded-full blur-3xl animate-floaty"></div>

            <div className="max-w-5xl mx-auto p-8 sm:p-12 bg-white bg-opacity-35 backdrop-blur-lg rounded-2xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
                {/* Vision Header */}
                <div className="text-center mb-10">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-green-700 uppercase tracking-wider relative inline-block">
                        Our Vision
                        <span className="block w-16 h-1 bg-orange-500 mt-2 mx-auto transition-all duration-300 hover:w-24"></span>
                    </h2>
                    <h4 className="text-lg sm:text-xl mt-4 text-gray-700 font-medium">
                        To build a future where waste is no longer an issue, but an opportunity to create, innovate, and share resources responsibly.
                    </h4>
                </div>

                {/* Mission Section */}
                <div className="mt-8 p-6 sm:p-8 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-inner transform transition-transform hover:-translate-y-1">
                    <h3 className="text-2xl font-semibold text-green-700 mb-4">Our Mission</h3>
                    <ul className="space-y-4 text-lg text-gray-700">
                        <li className="relative pl-10 opacity-0 animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
                            <span className="absolute left-0 top-1 text-2xl text-green-600">🌱</span>
                            Promoting the circular economy by encouraging the reuse of items.
                        </li>
                        <li className="relative pl-10 opacity-0 animate-fadeInUp" style={{ animationDelay: "0.5s" }}>
                            <span className="absolute left-0 top-1 text-2xl text-green-600">🌱</span>
                            Building a community of like-minded individuals who prioritize sustainability.
                        </li>
                        <li className="relative pl-10 opacity-0 animate-fadeInUp" style={{ animationDelay: "0.7s" }}>
                            <span className="absolute left-0 top-1 text-2xl text-green-600">🌱</span>
                            Providing a platform that makes swapping and recycling easy, fun, and rewarding.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default OurVision;

// Tailwind animations
const styles = `
    @keyframes floaty {
        0% { transform: translate(0, 0); }
        100% { transform: translate(-15px, -15px) scale(1.1); }
    }

    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(25px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .animate-floaty { animation: floaty 6s infinite alternate ease-in-out; }
    .animate-fadeInUp { animation: fadeInUp 1s ease-in-out forwards; }
`;

document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);
