import { useState } from "react";
import axios from "axios";

export default function SignupForm({ switchToLogin }) {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");

  const validatePassword = (value) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!regex.test(value)) {
      setPasswordError(
        "Min 8 chars, uppercase, lowercase, number & special"
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSignup = async () => {
    if (!userName || !userId || !age || !gender || !password || !confirmPassword) {
      setMessage("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:8080/signup", {
        userid: parseInt(userId),
        name: userName,
        password,
        age: parseInt(age),
        gender,
      });

      alert("Account created 🎉");
      switchToLogin();
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed ❌");
    }
  };

  return (
    <>
      {/* TITLE */}
      <h2 className="text-2xl font-extrabold text-gray-800 mb-1">
        Create Account
      </h2>
      <p className="text-gray-500 text-sm mb-4">
        Sign up to get started
      </p>

      {message && (
        <p className="text-sm text-red-500 mb-3">{message}</p>
      )}

      {/* NAME + USER ID */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <input
          type="text"
          placeholder="Full Name"
          onChange={(e) => setUserName(e.target.value)}
          className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
        />

        <input
          type="number"
          placeholder="User ID"
          onChange={(e) => setUserId(e.target.value)}
          className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
        />
      </div>

      {/* AGE + GENDER */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <input
          type="number"
          placeholder="Age"
          onChange={(e) => setAge(e.target.value)}
          className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
        />

        <select
          defaultValue=""
          onChange={(e) => setGender(e.target.value)}
          className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
        >
          <option value="" disabled>Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* PASSWORD */}
      <div className="mb-3">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            validatePassword(e.target.value);
          }}
          className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 outline-none ${
            passwordError
              ? "border-red-500 focus:ring-red-400"
              : "focus:ring-yellow-400"
          }`}
        />
        {passwordError && (
          <p className="text-xs text-red-500 mt-1">{passwordError}</p>
        )}
      </div>

      {/* CONFIRM PASSWORD */}
      <div className="mb-4">
        <input
          type="password"
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
        />
      </div>

      {/* ACTION */}
      <button
        onClick={handleSignup}
        disabled={!!passwordError}
        className={`w-full py-2.5 rounded-full font-bold transition ${
          passwordError
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-yellow-400 hover:bg-yellow-500 text-black shadow-lg"
        }`}
      >
        Create Account
      </button>

      {/* FOOTER */}
      <p className="text-center text-sm mt-5 text-gray-600">
        Already have an account?{" "}
        <button
          onClick={switchToLogin}
          className="text-yellow-500 hover:underline font-semibold"
        >
          Login
        </button>
      </p>
    </>
  );
}
