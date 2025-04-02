import React from "react";
import { useNavigate } from "react-router-dom";
import homeImage from "../../assets/images/home1.jpg";

const Header = () => {
  const navigate = useNavigate(); 

  return (
    <header 
      className="relative flex items-center justify-center text-center h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${homeImage})` }} 
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/30 backdrop-blur-sm"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-3xl w-11/12 flex flex-col items-center text-white text-center px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase leading-tight drop-shadow-lg">
          Join the <span className="text-green-400">Sustainable</span> <br /> Revolution
        </h1>
        
        <p className="text-lg md:text-xl mt-4 font-medium leading-relaxed drop-shadow-md">
          Swap, connect, and make a positive impact on the environment <br />
          with a growing community of eco-conscious individuals.
        </p>
        
        {/* Call to Action */}
        <button 
          className="mt-6 bg-green-500 hover:bg-green-600 transition-all duration-300 transform hover:scale-105 text-white font-semibold py-3 px-8 text-lg uppercase rounded-md shadow-xl tracking-wide"
          onClick={() => navigate('/login')}
        >
          Start Swapping
        </button>
      </div>
    </header>
  );
};

export default Header;
