import { useState } from "react";
import axios from "axios";

export default function SignupForm({ switchToLogin }) {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [passwordError, setPasswordError] = useState("");

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

  const handleSignup = async () => {
    if (!userName || !userId || !password) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
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

      alert("Account created successfully 🎉");
      switchToLogin();
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed ❌");
    }
  };

  return (
    <>
      {/* TITLE */}
      <h2 className="text-3xl font-extrabold text-gray-800 mb-1">
        Create Account
      </h2>
      <p className="text-gray-500 mb-6">
        Join us and get started in minutes
      </p>

      {/* NAME */}
      <input
        placeholder="Full Name"
        className="w-full mb-4 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
        onChange={(e) => setUserName(e.target.value)}
      />

      {/* USER ID */}
      <input
        placeholder="User ID"
        type="number"
        className="w-full mb-4 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
        onChange={(e) => setUserId(e.target.value)}
      />

      {/* AGE + GENDER */}
      <div className="flex gap-3 mb-4">
        <input
          type="number"
          placeholder="Age"
          className="w-1/2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
          onChange={(e) => setAge(e.target.value)}
        />

        <select
          className="w-1/2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
          defaultValue=""
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="" disabled>
            Gender
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* PASSWORD */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) => {
            const value = e.target.value;
            setPassword(value);
            validatePassword(value);
          }}
          className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 ${
            passwordError
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-yellow-400"
          }`}
          placeholder="Create strong password"
        />

        {passwordError && (
          <p className="mt-1 text-xs text-red-500">{passwordError}</p>
        )}
      </div>

      {/* CONFIRM PASSWORD */}
      <input
        placeholder="Confirm Password"
        type="password"
        className="w-full mb-6 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      {/* ACTION */}
      <button
        onClick={handleSignup}
        disabled={!!passwordError || !password}
        className={`w-full py-3 rounded-full font-bold transition ${
          passwordError || !password
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-yellow-400 hover:bg-yellow-500 text-black shadow-lg"
        }`}
      >
        Create Account
      </button>

      {/* SWITCH */}
      <p className="text-center text-sm mt-6">
        Already have an account?{" "}
        <button
          onClick={switchToLogin}
          className="text-yellow-600 font-semibold hover:underline"
        >
          Login
        </button>
      </p>
    </>
  );
}
