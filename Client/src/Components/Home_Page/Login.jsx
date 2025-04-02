import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ userInput: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/login", formData);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate(response.data.user.role === "admin" || response.data.user.role === "co-admin" ? "/admin" : "/dashboard/personal-info");
      } else {
        setMessage("Invalid credentials, try again.");
      }
    } catch (error) {
      setMessage("Login failed. Please check your details.");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50 relative overflow-hidden px-4">
      <div className="absolute top-10 left-5 w-20 h-20 bg-[url('/images/leaf1.png')] bg-contain bg-no-repeat opacity-50 rotate-[-20deg]"></div>
      <div className="absolute bottom-10 right-5 w-20 h-20 bg-[url('/images/leaf2.png')] bg-contain bg-no-repeat opacity-50 rotate-[20deg]"></div>
      
      <div className="bg-white p-8 w-full max-w-md text-center rounded-lg shadow-lg z-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Log In</h2>
        {message && <p className="text-red-500 mb-3">{message}</p>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            name="userInput"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
          
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <span onClick={togglePasswordVisibility} className="absolute right-4 top-3 text-xl cursor-pointer text-gray-600 hover:text-green-500">
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          
          <button type="submit" className="w-full p-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition disabled:bg-gray-400" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-4 text-gray-600">
          No account yet? <a href="/signup" className="text-green-600 font-bold hover:underline">Sign Up</a>
        </p>

        <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition duration-300">
  <a href="/forget-password" className="underline decoration-blue-500 hover:decoration-blue-700">
    Forget Password
  </a>
</h2>
    
      </div>
    </div>
  );
};

export default Login;