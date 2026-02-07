import { useState } from "react";
import LoginForm from "../Components/LoginForm";
import SignupForm from "../Components/SignupForm";
import ForgotPasswordForm from "../Components/ForgetPasswordForm";

export default function Auth() {
  const [mode, setMode] = useState("login");

  return (
    <div className="min-h-screen flex bg-gray-100">

      <div className="hidden md:flex w-1/2 bg-blue-600 items-center justify-center p-10">
        <div className="text-white max-w-md text-center">
          <img
            src="/Logo1.jpg"
            alt="Logo"
            className="mx-auto mb-6 w-64 object-contain"
          />

          <h1 className="text-4xl font-bold mb-4">
            {mode === "login" && "Welcome Back!"}
            {mode === "signup" && "Create Your Account"}
            {mode === "forgot" && "Reset Password"}
          </h1>

          <p className="text-lg opacity-90">
            {mode === "login" &&
              "Login to manage your account and access all features."}
            {mode === "signup" &&
              "Sign up to get started with our platform."}
            {mode === "forgot" &&
              "Recover your account using OTP verification."}
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
          {mode === "login" && (
            <LoginForm
              switchToSignup={() => setMode("signup")}
              switchToForgot={() => setMode("forgot")}
            />
          )}

          {mode === "signup" && (
            <SignupForm switchToLogin={() => setMode("login")} />
          )}

          {mode === "forgot" && (
            <ForgotPasswordForm switchToLogin={() => setMode("login")} />
          )}
        </div>
      </div>

    </div>
  );
}
