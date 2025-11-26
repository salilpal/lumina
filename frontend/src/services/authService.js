// src/services/authService.js
import axios from "./axios";

export const registerUser = async (data) => {
  const res = await axios.post("/auth/register", data);
  const { token, ...user } = res.data;
  return { user, token };
};

export const loginUser = async (data) => {
  const res = await axios.post("/auth/login", data);
  const { token, ...user } = res.data;
  return { user, token };
};

export const checkEmailExists = async (email) => {
  const res = await axios.post("/auth/check-email", { email });
  return res.data.exists;
};

export const getMe = async () => {
  const res = await axios.get("/auth/me");
  return res.data; // already just the user object, correct
};

export const googleLogin = async (token) => {
  const res = await axios.post("/auth/google", { token });
  const { token: authToken, ...user } = res.data;
  return { user, token: authToken };
};
