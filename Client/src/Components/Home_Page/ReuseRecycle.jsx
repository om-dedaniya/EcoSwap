import React from 'react';
import glassJar from '../../assets/images/glass.png';
import oldClothes from '../../assets/images/shirt.png';
import cardboardBox from '../../assets/images/box.png';
import plasticContainer from '../../assets/images/plastic.png';
import paperRecycle from '../../assets/images/paper.png';
import aluminumCan from '../../assets/images/aluminiumcan.png';
import eWaste from '../../assets/images/ewaste.png';
import plasticBottle from '../../assets/images/plastic-bottle.png';

const items = [
    { img: glassJar, title: "Glass Jars & Bottles", desc: "Reuse for storage, crafts, or vases." },
    { img: oldClothes, title: "Old Clothes & Fabrics", desc: "Repurpose into rags, tote bags, or donate." },
    { img: cardboardBox, title: "Cardboard Boxes", desc: "Use for storage, moving, or kids’ crafts." },
    { img: plasticContainer, title: "Plastic Containers", desc: "Organize small items or reuse for food storage." },
    { img: paperRecycle, title: "Paper & Newspapers", desc: "Recycle to save trees and reduce waste." },
    { img: aluminumCan, title: "Aluminum Cans", desc: "Recycling saves energy and valuable resources." },
    { img: eWaste, title: "Electronic Waste", desc: "Proper disposal helps prevent toxic pollution." },
    { img: plasticBottle, title: "Plastic Bottles", desc: "Recycling prevents ocean pollution and waste." }
];

const ReuseRecycle = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-200 to-green-100 py-12 px-4">
            {/* Title */}
            <h2 className="text-4xl font-extrabold text-green-900 mb-8 drop-shadow-md">
                ♻️Things We Can Reuse & Recycle♻️
            </h2>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl">
                {items.map((item, index) => (
                    <div 
                        key={index} 
                        className="bg-white shadow-xl rounded-lg p-6 flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                        {/* Icon */}
                        <img 
                            src={item.img} 
                            alt={item.title} 
                            className="w-20 h-20 mb-4 transition-transform duration-300 hover:rotate-6"
                        />
                        
                        {/* Title */}
                        <h3 className="text-xl font-semibold text-green-800">{item.title}</h3>

                        {/* Description */}
                        <p className="text-gray-700 mt-2">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReuseRecycle;
