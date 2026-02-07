import { useState } from "react";
import axios from "axios";

export default function ForgotPasswordForm({ switchToLogin }) {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");



  const sendOtp = async () => {
    if (!userId) {
      setMessage("UserID is required");
      return;
    }

    try {
      await axios.post("http://localhost:8080/forgotPassword", {
        userid: parseInt(userId),
      });

      setStep(2);
      setMessage("OTP sent successfully");
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to send OTP");
    }
  };

  const resetPassword = async () => {
  if (!otp || !newPassword) {
    setMessage("All fields are required");
    return;
  }

  if (passwordError) {
    setMessage("Please fix password errors");
    return;
  }

  try {
    await axios.post("http://localhost:8080/resetPassword", {
      userid: parseInt(userId),
      otp,
      new_password: newPassword,
    });

    alert("Password reset successful");
    switchToLogin();
  } catch (err) {
    setMessage(err.response?.data?.error || "Invalid OTP");
  }
};

  const validatePassword = (value) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!value) {
      setPasswordError("Password is required");
      return false;
    }

    if (!regex.test(value)) {
      setPasswordError(
        "Min 8 chars, 1 uppercase, 1 lowercase, 1 number & 1 special character"
      );
      return false;
    }

    setPasswordError("");
    return true;
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        Forgot Password
      </h2>

      <p className="text-gray-500 mb-6">
        {step === 1
          ? "Enter your UserID to receive OTP"
          : "Enter OTP and new password"}
      </p>

      {message && (
        <p className="text-red-500 text-sm mb-4">{message}</p>
      )}

      {step === 1 && (
        <>
          <input
            type="number"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg mb-4"
          />

          <button
            onClick={sendOtp}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            Send OTP
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

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => {
              const value = e.target.value;
              setNewPassword(value);
              validatePassword(value);
            }}
            className={`w-full px-4 py-3 border rounded-lg mb-4 ${
            passwordError ? "border-red-500 ": "border-gray-300 focus:ring-green-500"}`}
          />
          {passwordError && (
            <p className="mt-1 text-xs text-red-500">{passwordError}</p>
          )}
          <button
            onClick={resetPassword}
            disabled ={!!passwordError || !newPassword}
            className={`w-full bg-blue-600 text-white py-3 rounded-lg ${passwordError || !newPassword 
              ?"bg-gray-400 cursor-not-allowed"
              :"bg-green-600 hover:bg-green-700"}`}
          >
            Reset Password
          </button>
        </>
      )}

      <p className="text-center text-sm mt-6">
        <button
          onClick={switchToLogin}
          className="text-blue-600 font-semibold"
        >
          Back to Login
        </button>
      </p>
    </>
  );
}
