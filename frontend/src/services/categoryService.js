// src/services/categoryService.js
import axios from "./axios";

export const getCategories = async (params = {}) => {
  const res = await axios.get("/categories", { params });
  return res.data;
};

export const createCategory = async (data) => {
  const res = await axios.post("/categories", data);
  return res.data;
};

export const updateCategory = async (id, data) => {
  const res = await axios.put(`/categories/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await axios.delete(`/categories/${id}`);
  return res.data;
};

export const getTypesByCategory = async (categoryId) => {
  const res = await axios.get(`/types?category=${categoryId}`);
  return res.data;
};
