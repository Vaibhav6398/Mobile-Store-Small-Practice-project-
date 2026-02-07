import { useState } from "react";
import LoginForm from "../Components/LoginForm";
import SignupForm from "../Components/SignupForm";
import ForgotPasswordForm from "../Components/ForgetPasswordForm";

export default function Auth() {
  const [mode, setMode] = useState("login");

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">

      {/* LEFT SECTION */}
      <div className="hidden md:flex w-1/2 items-center justify-center p-12">
        <div className="text-white max-w-md text-center">

          <img
            src="/Logo1.jpg"
            alt="Logo"
            className="mx-auto mb-8 w-64 rounded-3xl shadow-2xl"
          />

          <h1 className="text-4xl font-extrabold mb-5">
            {mode === "login" && "Welcome Back 👋"}
            {mode === "signup" && "Join Us Today 🚀"}
            {mode === "forgot" && "Reset Your Password 🔐"}
          </h1>

          <p className="text-lg text-gray-300 leading-relaxed">
            {mode === "login" &&
              "Login to explore products, manage your profile, and access exclusive features."}

            {mode === "signup" &&
              "Create your account and enjoy a seamless shopping and management experience."}

            {mode === "forgot" &&
              "Don’t worry — we’ll help you securely recover access to your account."}
          </p>

          <div className="mt-8 flex justify-center gap-3 text-sm text-gray-400">
            <span>Secure</span> • <span>Fast</span> • <span>Reliable</span>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-md">

          {/* MOBILE TITLE */}
          <div className="md:hidden text-center mb-6">
            <h2 className="text-2xl font-extrabold text-gray-800">
              {mode === "login" && "Welcome Back"}
              {mode === "signup" && "Create Account"}
              {mode === "forgot" && "Reset Password"}
            </h2>
          </div>

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
