import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:5000/send-forgot-password-otp", { email });
      Swal.fire("Success", response.data.message, "success");
      setStep(2);
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Error sending OTP", "error");
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post("http://localhost:5000/verify-otp", { email, otp });
      Swal.fire("Success", response.data.message, "success");
      setStep(3);
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Invalid OTP", "error");
    }
  };

  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      return Swal.fire("Error", "Passwords do not match", "error");
    }
    try {
      const response = await axios.post("http://localhost:5000/reset-password", { email, newPassword });
      Swal.fire({
        title: "Success",
        text: response.data.message,
        icon: "success",
        confirmButtonText: "Go to Login",
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Error updating password", "error");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Forgot Password</h2>
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              onClick={sendOtp}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >Send OTP</button>
          </>
        )}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              onClick={verifyOtp}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            >Verify OTP</button>
          </>
        )}
        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              onClick={resetPassword}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
            >Reset Password</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
