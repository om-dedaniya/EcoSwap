import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("https://ecoswap-e24p.onrender.com/send-otp", {
        email: formData.email,
        mobile: formData.mobile,
      });

      setTimeout(() => {
        setShowOtpPopup(true);
        setMessage("OTP sent! Check your inbox or spam folder.");
        startResendTimer();
        setLoading(false);
      }, 1000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to send OTP. Try again."
      );
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (resendTimer > 0) return;
    await sendOTP(new Event("click"));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setMessage("Passwords do not match");
    }
    setLoading(true);

    try {
      const response = await axios.post(
        "https://ecoswap-e24p.onrender.com/signup",
        formData
      );
      setMessage(response.data.message);
      setShowOtpPopup(false);
      setTimeout(() => {
        setShowSuccessPopup(true);
        setLoading(false);
      }, 800);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "OTP verification failed. Try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 pt-24 px-4 pb-8">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md animate-fadeIn">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-1">
          Create an Account
        </h2>
        <p className="text-sm text-center text-gray-500 mb-5">
          Join us and start your journey
        </p>

        {message && (
          <p className="text-sm text-red-500 text-center mb-3">{message}</p>
        )}

        <form className="space-y-4" onSubmit={sendOTP}>
          <div className="flex gap-2">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              onChange={handleChange}
              required
              className="w-1/2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 outline-none"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              onChange={handleChange}
              required
              className="w-1/2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 outline-none"
          />
          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 outline-none"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 outline-none"
          />

          <button
            type="submit"
            className="w-full p-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center items-center gap-2">
                <span className="loader" /> Sending OTP...
              </div>
            ) : (
              "Send OTP"
            )}
          </button>

          <p className="text-sm text-gray-600 text-center mt-2">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-orange-600 font-semibold hover:underline"
            >
              Login
            </button>
          </p>
        </form>
      </div>

      {/* OTP Modal */}
      {showOtpPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 w-80 rounded-xl shadow-xl text-center animate-fadeIn">
            <h3 className="text-lg font-bold mb-2 text-gray-800">Enter OTP</h3>
            <p className="text-sm text-gray-500 mb-3">
              Check your email inbox or spam folder.
            </p>
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md mb-3 focus:ring-2 focus:ring-green-400 outline-none"
            />
            <button
              onClick={handleSignup}
              className="w-full p-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              {loading ? "Verifying..." : "Verify & Signup"}
            </button>
            <p className="mt-3 text-sm text-gray-600">
              Didn’t get the OTP?{" "}
              <button
                onClick={resendOTP}
                className="text-green-600 font-semibold"
                disabled={resendTimer > 0}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 w-80 rounded-xl shadow-xl text-center animate-fadeIn">
            <h3 className="text-lg font-bold text-green-600 mb-2">
              Signup Successful!
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Now you can log in to your account.
            </p>
            <button
              className="w-full p-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>
        {`
          .loader {
            border: 3px solid white;
            border-top: 3px solid transparent;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default Signup;
