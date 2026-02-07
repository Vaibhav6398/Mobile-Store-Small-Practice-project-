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
        setMessage("OTP sent successfully");
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
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        {step === 1 ? "Login" : "Verify OTP"}
      </h2>

      <p className="text-gray-500 mb-6">
        {step === 1
          ? "Please sign in to continue"
          : "Enter the OTP sent to you"}
      </p>

      {message && (
        <p className="text-red-500 text-sm mb-4">{message}</p>
      )}

      {step === 1 && (
        <>
          <div className="mb-4">
            <label className="text-sm font-medium">User ID</label>
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            />
          </div>

          <div className="mb-2">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            />
          </div>

          <p className="text-right text-sm mb-4">
            <button
              onClick={switchToForgot}
              className="text-blue-600 font-semibold"
            >
              Forgot password?
            </button>
          </p>

          <button
            onClick={handlePasswordCheck}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            Continue
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="4-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={4}
            className="w-full px-4 py-3 border rounded-lg mb-4"
          />

          <button
            onClick={handleOtpVerify}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            Verify & Login
          </button>

          <p className="text-center text-sm mt-4">
            <button
              onClick={() => {
                setStep(1);
                setOtp("");
                setMessage("");
              }}
              className="text-blue-600 font-semibold"
            >
              ← Back to Login
            </button>
          </p>
        </>
      )}

      <p className="text-center text-sm mt-6">
        Don&apos;t have an account?{" "}
        <button
          onClick={switchToSignup}
          className="text-blue-600 font-semibold"
        >
          Sign up
        </button>
      </p>
    </>
  );
}
