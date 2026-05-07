// src/services/productService.js
import axios from "./axios";

export const getAllProducts = async () => {
  const res = await axios.get("/products");
  return res.data; 
};

// Fetch products based on the Type Slug (used in TypeProducts.jsx)
export const getProductsByType = async (typeId) => {
  // We send the ID to the backend to get a precise match
  const res = await axios.get(`/products/type/${typeId}`);
  return res.data.products || res.data;
};

export const getProductBySlug = async (slug) => {
  const res = await axios.get(`/products/slug/${encodeURIComponent(slug)}`);
  return res.data.product || res.data;
};

export const createProduct = async (data) => {
  // If data is FormData, axios handles headers automatically; 
  // but explicitly setting it is safer for clarity.
  const config = data instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
  const res = await axios.post("/products", data, config);
  return res.data;
};

export const updateProduct = async (id, data) => {
  const config = data instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
  const res = await axios.put(`/products/${id}`, data, config);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await axios.delete(`/products/${id}`);
  return res.data;
};

export const getProductsByCategory = async (categorySlug) => {
  const res = await axios.get(
    `/products/category/${encodeURIComponent(categorySlug)}`
  );
  return res.data.products || res.data;
};

export const searchProducts = async (keyword) => {
  const res = await axios.get(
    `/products/search?q=${encodeURIComponent(keyword)}`
  );
  return res.data.products || res.data;
};

// Standardizing exports
const productService = {
  getAllProducts,
  getProductsByType, // Added to default export
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  searchProducts,
};

export default productService;