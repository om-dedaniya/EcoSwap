import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ShieldCheck, RefreshCcw } from "lucide-react";

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
    <div className="flex justify-center items-center min-h-screen bg-[#F0FDF4] px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md relative z-10">
        <h2 className="text-3xl font-bold text-center text-[#1B4332] mb-1">Forgot Password</h2>
        <p className="text-center text-[#4E6542] mb-6">Step {step} of 3</p>

        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center bg-[#E9F7EC] p-3 rounded-lg">
              <Mail className="text-[#34A853] mr-3" size={20} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent w-full outline-none text-[#1B4332]"
                required
              />
            </div>
            <button
              onClick={sendOtp}
              className="w-full py-3 bg-[#34A853] text-white font-semibold rounded-lg hover:bg-[#2f944a] transition"
            >
              Send OTP
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center bg-[#E9F7EC] p-3 rounded-lg">
              <ShieldCheck className="text-[#34A853] mr-3" size={20} />
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="bg-transparent w-full outline-none text-[#1B4332]"
                required
              />
            </div>
            <button
              onClick={verifyOtp}
              className="w-full py-3 bg-[#34A853] text-white font-semibold rounded-lg hover:bg-[#2f944a] transition"
            >
              Verify OTP
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center bg-[#E9F7EC] p-3 rounded-lg">
              <Lock className="text-[#34A853] mr-3" size={20} />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-transparent w-full outline-none text-[#1B4332]"
                required
              />
            </div>
            <div className="flex items-center bg-[#E9F7EC] p-3 rounded-lg">
              <Lock className="text-[#34A853] mr-3" size={20} />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-transparent w-full outline-none text-[#1B4332]"
                required
              />
            </div>
            <button
              onClick={resetPassword}
              className="w-full py-3 bg-[#34A853] text-white font-semibold rounded-lg hover:bg-[#2f944a] transition"
            >
              Reset Password
            </button>
          </div>
        )}

        <div className="text-sm text-center text-[#4E6542] mt-6">
          <button
            onClick={() => navigate("/login")}
            className="text-[#34A853] hover:underline flex items-center justify-center gap-1 font-medium"
          >
            <RefreshCcw size={16} /> Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
