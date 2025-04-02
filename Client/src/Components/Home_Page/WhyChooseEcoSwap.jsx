import React from "react";

const WhyChooseEcoSwap = () => {
    return (
        <div className="relative bg-gradient-to-b from-green-200 to-green-100 p-16 text-center rounded-2xl shadow-xl overflow-hidden">
            {/* Floating Background Elements */}
            <div className="absolute w-32 h-32 bg-white opacity-20 blur-3xl rounded-full top-10 left-5 animate-floating"></div>
            <div className="absolute w-32 h-32 bg-white opacity-20 blur-3xl rounded-full bottom-16 right-10 animate-floating"></div>

            {/* Header */}
            <div className="mb-12">
                <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wide text-green-700 relative inline-block">
                    Why Choose <span className="text-orange-500">EcoSwap?</span>
                    <span className="block w-16 h-1 bg-orange-500 mx-auto mt-2 transition-all duration-300 hover:w-24"></span>
                </h2>
                <p className="text-lg text-gray-600 mt-4">
                    EcoSwap is more than just swapping items – it's a movement toward sustainability and smart living.
                </p>
            </div>

            {/* Cards Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {[
                    { title: "🌱 Eco-Friendly", text: "Reduce waste and contribute to a cleaner environment. By swapping, recycling, and reusing, you help cut down on landfill waste and lower carbon footprints." },
                    { title: "💰 Cost-Effective", text: "Save money by swapping instead of buying new. EcoSwap allows you to find what you need while keeping your budget intact, making sustainable living affordable." },
                    { title: "🤝 Community Driven", text: "Join a like-minded community that values sustainability and conscious living. Make meaningful connections while exchanging items with trust and responsibility." },
                    { title: "⚡ Easy & Convenient", text: "Our intuitive platform makes swapping effortless. Browse, chat, and exchange items in just a few clicks—no hassle, no unnecessary waste." },
                    { title: "🔒 Trusted Platform", text: "Your safety is our priority. EcoSwap ensures verified users and secure transactions so you can swap with confidence and peace of mind." },
                    { title: "♻️ Sustainable Lifestyle", text: "Live sustainably without compromising your needs. EcoSwap encourages a circular economy where products are reused instead of discarded, helping you reduce your environmental impact effortlessly." }
                ].map((card, index) => (
                    <div key={index} className="relative p-8 bg-white/30 backdrop-blur-md rounded-2xl shadow-lg text-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden">
                        {/* Animated Background on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-0 transition-opacity duration-300 hover:opacity-10 rounded-2xl"></div>

                        <h3 className="text-2xl font-semibold text-green-700 relative">
                            {card.title}
                        </h3>
                        <p className="text-gray-700 mt-3 leading-relaxed">
                            {card.text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WhyChooseEcoSwap;
