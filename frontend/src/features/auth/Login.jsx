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
          setEmailError("Could not check email. Try again.");
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

  useEffect(() => {
    if (redirectPending && user) {
      if (user.isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
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

  const googleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-md w-full">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
        Sign In
      </h2>
      <button
        type="button"
        onClick={googleLogin}
        className="w-full bg-red-500 text-white py-2 rounded-lg cursor-pointer my-2 mb-6"
      >
        Sign In with Google
      </button>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={form.email}
          onChange={handleChange}
          required
        />
        {/* Email existence feedback */}
        {checking && (
          <div className="text-xs text-gray-400">Checking email...</div>
        )}
        {emailError && (
          <div className="text-xs text-red-600 mb-1">{emailError}</div>
        )}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full border p-2 rounded pr-10"
            value={form.password}
            onChange={handleChange}
            required
            disabled={!emailExists}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-2.5 right-3 cursor-pointer text-gray-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg cursor-pointer"
          disabled={!emailExists}
        >
          Sign In
        </button>
      </form>

      {/* Prompt to register if email not found */}
      {!emailExists && form.email && form.email.includes("@") && !checking && (
        <div className="mt-4 text-sm text-center text-blue-800 bg-blue-50 rounded px-3 py-2">
          No account found for this email.{" "}
          <Link to="/register" className="font-semibold underline">
            Sign Up!
          </Link>
        </div>
      )}

      <div className="mt-4 flex justify-between text-sm">
        <Link to="/forgot-password" className="text-blue-600 hover:underline">
          Forgot Password?
        </Link>
      </div>
      <div className="mt-6 text-sm text-center">
        Not registered yet?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Sign Up!
        </Link>
      </div>
    </div>
  );
};

export default Login;
