import { useState } from "react";
import axios from "axios";

export default function SignupForm({ switchToLogin }) {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [passwordError, setPasswordError] = useState();

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

      alert("Account created successfully");
      switchToLogin();
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
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
      <h2 className="text-3xl font-bold mb-6">Sign Up</h2>

      <input
        placeholder="User Name"
        className="w-full mb-3 px-4 py-2 border rounded-lg"
        onChange={(e) => setUserName(e.target.value)}
      />

      <input
        placeholder="User ID"
        type="number"
        className="w-full mb-3 px-4 py-2 border rounded-lg"
        onChange={(e) => setUserId(e.target.value)}
      />

      <div className="flex gap-3 mb-3">
        <input
          type="number"
          placeholder="Age"
          className="w-1/2 px-3 py-2 border rounded-md text-sm"
          onChange={(e) => setAge(e.target.value)}
        />

        <select
          className="w-1/2 px-3 py-2 border rounded-md text-sm"
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

      <div className="mb-6">
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
    className={`w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
      passwordError
        ? "border-red-500 focus:ring-red-400"
        : "border-gray-300 focus:ring-green-500"
    }`}
    placeholder="Enter password"
  />

  {passwordError && (
    <p className="mt-1 text-xs text-red-500">
      {passwordError}
    </p>
  )}
</div>



      <input
        placeholder="Confirm Password"
        type="password"
        className="w-full mb-6 px-4 py-2 border rounded-lg"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button
        onClick={handleSignup}
        disabled={!!passwordError || !password}
        className={`w-full text-white py-3 rounded-lg transition ${passwordError || !password
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
          }`}
      >
        Create Account
      </button>

      <p className="text-center text-sm mt-6">
        Already have an account?{" "}
        <button
          onClick={switchToLogin}
          className="text-blue-600 font-semibold"
        >
          Login
        </button>
      </p>
    </>
  );
}
