import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const [formData, setFormData] = useState({ userInput: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
      const response = await axios.post(
        "http://localhost:5000/login",
        formData
      );

      const { token, user } = response.data;

      if (token) {
        // ✅ Save token and role in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role); // "admin", "co-admin", "user", etc.

        // ✅ Redirect based on role
        const redirectPath =
          user.role === "admin" || user.role === "co-admin"
            ? "/admin"
            : "/dashboard/personal-info";

        navigate(redirectPath);
      } else {
        setMessage("Invalid credentials, try again.");
      }
    } catch (error) {
      setMessage("Login failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 to-green-300 px-4 relative overflow-hidden">
      {/* Decorative Leaves */}
      <div className="absolute top-10 left-5 w-24 h-24 bg-[url('/images/leaf1.png')] bg-contain bg-no-repeat opacity-40 rotate-[-20deg]" />
      <div className="absolute bottom-10 right-5 w-24 h-24 bg-[url('/images/leaf2.png')] bg-contain bg-no-repeat opacity-40 rotate-[20deg]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 w-full max-w-md text-center rounded-2xl shadow-2xl z-10"
      >
        <h2 className="text-3xl font-bold text-green-700 mb-2">
          Welcome Back 🌿
        </h2>
        <p className="text-gray-500 mb-4">Log in to access your dashboard</p>

        {message && <p className="text-red-500 font-medium mb-3">{message}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            name="userInput"
            placeholder="Email"
            value={formData.userInput}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-3.5 cursor-pointer text-gray-600 hover:text-green-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm text-gray-600">
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="hover:underline hover:text-green-600 font-medium"
          >
            New user? Sign up
          </button>
          <button
            type="button"
            onClick={() => navigate("/forget-password")}
            className="hover:underline hover:text-blue-600 font-medium"
          >
            Forgot Password?
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
