// src/services/userService.js
import axios from "./axios";

export const getAllUsers = async () => {
  const res = await axios.get("/admin/users");
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await axios.delete(`/admin/users/${id}`);
  return res.data;
};

export const makeAdmin = async (id) => {
  const res = await axios.put(`/admin/users/${id}/admin`);
  return res.data;
};

export const getUserById = async (id) => {
  const res = await axios.get(`/admin/users/${id}`);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await axios.put(`/admin/users/${id}`, data);
  return res.data;
};
