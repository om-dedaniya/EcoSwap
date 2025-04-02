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
        await axios.post("http://localhost:5000/send-otp", {
            email: formData.email,
            mobile: formData.mobile,
        });

        setTimeout(() => {
            setShowOtpPopup(true);
            setMessage("OTP sent! Check your inbox or spam folder.");
            startResendTimer();
            setLoading(false);
        }, 1500); // Simulating delay for animation effect
        } catch (error) {
        setMessage(error.response?.data?.message || "Failed to send OTP. Try again.");
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
        const response = await axios.post("http://localhost:5000/signup", formData);
        setMessage(response.data.message);
        setShowOtpPopup(false);
        setTimeout(() => {
            setShowSuccessPopup(true);
            setLoading(false);
        }, 1000);
        } catch (error) {
        setMessage(error.response?.data?.message || "OTP verification failed. Try again.");
        setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 to-green-300 p-6 pt-[80px] relative">

        {/* Signup Box */}
        <div className="bg-white p-8 w-full max-w-md text-center rounded-lg shadow-lg z-10 transition-all duration-500 hover:shadow-2xl">
            {message && <p className="text-red-500 mb-3">{message}</p>}

            <form className="space-y-4" onSubmit={sendOTP}>
            <div className="flex flex-col md:flex-row gap-2">
                <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required className="w-full p-3 border rounded-lg focus:border-green-500 transition-all" />
                <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required className="w-full p-3 border rounded-lg focus:border-green-500 transition-all" />
            </div>

            <input type="email" name="email" placeholder="Email Id" onChange={handleChange} required className="w-full p-3 border rounded-lg focus:border-green-500 transition-all" />
            <input type="tel" name="mobile" placeholder="Mobile Number" onChange={handleChange} required className="w-full p-3 border rounded-lg focus:border-green-500 transition-all" />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-3 border rounded-lg focus:border-green-500 transition-all" />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required className="w-full p-3 border rounded-lg focus:border-green-500 transition-all" />

            <button type="submit" className="w-full p-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-all flex justify-center items-center gap-2" disabled={loading}>
                {loading ? (
                <>
                    <span className="loader"></span> Sending OTP...
                </>
                ) : (
                "Send OTP"
                )}
            </button>

            <p className="text-gray-600 mt-4">Already have an account?</p>
            <button type="button" className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all" onClick={() => navigate("/login")} disabled={loading}>
                Login
            </button>
            </form>
        </div>

        {/* OTP Popup */}
        {showOtpPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn">
            <div className="bg-white p-6 w-80 rounded-lg shadow-lg text-center scale-95 animate-scaleIn">
                <h3 className="text-lg font-semibold mb-2">Enter OTP</h3>
                <p className="text-gray-500 text-sm mb-3">Check your email inbox or spam folder.</p>
                <input type="text" name="otp" placeholder="Enter OTP" onChange={handleChange} required className="w-full p-3 border rounded-lg mb-3 focus:border-green-500 transition-all" />
                <button onClick={handleSignup} className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all">
                {loading ? "Verifying..." : "Verify & Signup"}
                </button>
                <p className="mt-3 text-sm text-gray-600">
                Didn't receive OTP?{" "}
                <button onClick={resendOTP} className="text-green-600 font-semibold" disabled={resendTimer > 0}>
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                </button>
                </p>
            </div>
            </div>
        )}

        {/* Success Popup */}
        {showSuccessPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn">
            <div className="bg-white p-6 w-80 rounded-lg shadow-lg text-center scale-95 animate-scaleIn">
                <h3 className="text-lg font-semibold mb-2">Signup Successful!</h3>
                <p className="text-gray-500 text-sm mb-3">Now you can login to your account.</p>
                <button className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all" onClick={() => navigate("/login")}>
                Go to Login
                </button>
            </div>
            </div>
        )}

        {/* Loader Animation */}
        <style>
            {`
            .loader {
                border: 3px solid white;
                border-top: 3px solid transparent;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                animation: spin 0.8s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes scaleIn {
                from { transform: scale(0.9); }
                to { transform: scale(1); }
            }
            `}
        </style>
        </div>
    );
    };

    export default Signup;
