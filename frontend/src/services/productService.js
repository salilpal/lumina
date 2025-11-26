// src/services/productService.js
import axios from "./axios";

export const getAllProducts = async () => {
  const res = await axios.get("/products");
  return res.data; // assuming res.data is an array of products
};

export const getProductBySlug = async (slug) => {
  const res = await axios.get(`/products/slug/${encodeURIComponent(slug)}`);
  return res.data.product || res.data;
};

export const createProduct = async (data) => {
  if (data instanceof FormData) {
    const res = await axios.post("/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } else {
    const res = await axios.post("/products", data);
    return res.data;
  }
};

export const updateProduct = async (id, data) => {
  if (data instanceof FormData) {
    const res = await axios.put(`/products/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } else {
    const res = await axios.put(`/products/${id}`, data);
    return res.data;
  }
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

export default {
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  searchProducts,
};
