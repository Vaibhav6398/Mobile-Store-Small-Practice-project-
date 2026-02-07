import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginForm({ switchToSignup, switchToForgot }) {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handlePasswordCheck = async () => {
    if (!userId || !password) {
      setMessage("User ID and Password are required");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/multiLogin", {
        userid: parseInt(userId),
        password,
      });

      if (res.data.success) {
        setStep(2);
        setMessage("OTP sent successfully ✅");
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Invalid credentials");
    }
  };

  const handleOtpVerify = async () => {
    if (!otp) {
      setMessage("OTP is required");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/multiLoginOtp", {
        userid: parseInt(userId),
        otp,
      });

      if (res.data.success) {
        const token = res.data.data.token;

        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);

        navigate("/home");
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Invalid OTP");
    }
  };

  return (
    <>
      {/* TITLE */}
      <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
        {step === 1 ? "Welcome Back 👋" : "Verify OTP 🔐"}
      </h2>

      <p className="text-gray-500 mb-6">
        {step === 1
          ? "Login to continue to your dashboard"
          : "Enter the OTP sent to your registered contact"}
      </p>

      {/* MESSAGE */}
      {message && (
        <p
          className={`text-sm mb-4 ${
            message.includes("success")
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">
              User ID
            </label>
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full mt-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="Enter your user ID"
            />
          </div>

          <div className="mb-2">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="Enter your password"
            />
          </div>

          <p className="text-right text-sm mb-5">
            <button
              onClick={switchToForgot}
              className="text-yellow-500 hover:underline font-semibold"
            >
              Forgot password?
            </button>
          </p>

          <button
            onClick={handlePasswordCheck}
            className="w-full bg-yellow-400 hover:bg-yellow-500 transition text-black py-3 rounded-full font-bold shadow-lg"
          >
            Continue →
          </button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">
              OTP
            </label>
            <input
              type="text"
              placeholder="Enter 4-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={4}
              className="w-full mt-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          </div>

          <button
            onClick={handleOtpVerify}
            className="w-full bg-yellow-400 hover:bg-yellow-500 transition text-black py-3 rounded-full font-bold shadow-lg"
          >
            Verify & Login
          </button>

          <p className="text-center text-sm mt-5">
            <button
              onClick={() => {
                setStep(1);
                setOtp("");
                setMessage("");
              }}
              className="text-gray-600 hover:text-black font-semibold"
            >
              ← Back to Login
            </button>
          </p>
        </>
      )}

      {/* FOOTER */}
      <p className="text-center text-sm mt-8 text-gray-600">
        Don&apos;t have an account?{" "}
        <button
          onClick={switchToSignup}
          className="text-yellow-500 hover:underline font-semibold"
        >
          Sign up
        </button>
      </p>
    </>
  );
}
