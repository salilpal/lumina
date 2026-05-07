// src/services/typeService.js
import axios from "./axios";

// Fetch all types (general)
export const getTypes = () => {
  return axios.get("/types").then((res) => res.data);
};

// Fetch types for a specific category (This fixes your Import Error)
export const getTypesByCategory = (categoryId) => {
  return axios.get(`/types?category=${categoryId}`).then((res) => res.data);
};

export const getTypeBySlug = async (slug) => {
  const res = await axios.get(`/types/slug/${encodeURIComponent(slug)}`);
  return res.data; // Ensure your backend has this route
};

// Fetch single type by ID
export const getTypeById = (id) => {
  return axios.get(`/types/${id}`).then((res) => res.data);
};

// Create new type (Expects FormData for images)
export const createType = (typeData) => {
  return axios.post("/types", typeData).then((res) => res.data);
};

// Update existing type
export const updateType = (id, typeData) => {
  return axios.put(`/types/${id}`, typeData).then((res) => res.data);
};

// Delete type
export const deleteType = (id) => {
  return axios.delete(`/types/${id}`).then((res) => res.data);
};
