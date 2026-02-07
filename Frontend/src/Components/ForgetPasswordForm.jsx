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
      setMessage("User ID is required");
      return;
    }

    try {
      await axios.post("http://localhost:8080/forgotPassword", {
        userid: parseInt(userId),
      });

      setStep(2);
      setMessage("OTP sent successfully ✅");
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

      alert("Password reset successful 🎉");
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
      {/* TITLE */}
      <h2 className="text-3xl font-extrabold text-gray-800 mb-1">
        Reset Password
      </h2>

      <p className="text-gray-500 mb-6">
        {step === 1
          ? "Enter your User ID to receive OTP"
          : "Enter OTP and create a new password"}
      </p>

      {/* MESSAGE */}
      {message && (
        <p className="text-red-500 text-sm mb-4">{message}</p>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <input
            type="number"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full mb-4 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
          />

          <button
            onClick={sendOtp}
            className="w-full py-3 rounded-full font-bold bg-yellow-400 hover:bg-yellow-500 text-black shadow-lg transition"
          >
            Send OTP
          </button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="4-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={4}
            className="w-full mb-4 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
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
            className={`w-full mb-2 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
              passwordError
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-yellow-400"
            }`}
          />

          {passwordError && (
            <p className="mb-4 text-xs text-red-500">
              {passwordError}
            </p>
          )}

          <button
            onClick={resetPassword}
            disabled={!!passwordError || !newPassword}
            className={`w-full py-3 rounded-full font-bold transition ${
              passwordError || !newPassword
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white shadow-lg"
            }`}
          >
            Reset Password
          </button>
        </>
      )}

      {/* BACK */}
      <p className="text-center text-sm mt-6">
        <button
          onClick={switchToLogin}
          className="text-yellow-600 font-semibold hover:underline"
        >
          ← Back to Login
        </button>
      </p>
    </>
  );
}
