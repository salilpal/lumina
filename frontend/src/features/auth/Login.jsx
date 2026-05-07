// src/features/auth/Login.jsx
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "./authSlice";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { checkEmailExists } from "../../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login: authLogin, user } = useAuth();
  const [redirectPending, setRedirectPending] = useState(false);

  const [emailExists, setEmailExists] = useState(null);
  const [checking, setChecking] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Debounced email check logic
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (form.email && form.email.includes("@")) {
        setChecking(true);
        try {
          const exists = await checkEmailExists(form.email);
          setEmailExists(exists);
          setEmailError("");
          if (!exists)
            setEmailError("No account found for this email. Please sign up!");
        } catch (err) {
          setEmailExists(null);
          setEmailError("Could not verify email. Please try again.");
        } finally {
          setChecking(false);
        }
      } else {
        setEmailExists(null);
        setEmailError("");
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [form.email]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Handle post-login redirection (Removed Admin check)
  useEffect(() => {
    if (redirectPending && user) {
      navigate("/"); // Everyone goes to home/shop now
      setRedirectPending(false);
    }
  }, [user, redirectPending, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailExists) return;
    try {
      const loginData = await dispatch(login(form)).unwrap();
      await authLogin(loginData.token);
      setRedirectPending(true);
    } catch (err) {
      console.error("Login error:", err);
      alert("Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 mt-2">
            Sign in to manage your lighting projects
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={form.email}
              onChange={handleChange}
              required
            />
            {checking && (
              <div className="text-[10px] uppercase tracking-wider font-bold text-blue-500 mt-1">
                Verifying...
              </div>
            )}
            {emailError && (
              <div className="text-xs text-red-500 mt-1 font-medium">{emailError}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className={`w-full border border-gray-300 p-3 rounded-lg pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                  !emailExists ? "bg-gray-50 cursor-not-allowed" : ""
                }`}
                value={form.password}
                onChange={handleChange}
                required
                disabled={!emailExists}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition-all ${
              !emailExists
                ? "bg-gray-400 cursor-not-allowed shadow-none"
                : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
            }`}
            disabled={!emailExists}
          >
            Sign In
          </button>
        </form>

        {/* Dynamic Sign Up Prompt */}
        {!emailExists && form.email && form.email.includes("@") && !checking && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-center text-blue-700 animate-pulse">
            New to Lumina?{" "}
            <Link to="/register" className="font-bold underline">
              Create an account
            </Link>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-blue-600 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;