import axios from "./axios";

// Fetch all types (optionally filtered by category)
export const getTypes = (categoryId) => {
  const url = categoryId ? `/types?category=${categoryId}` : "/types";
  return axios.get(url).then((res) => res.data);
};

// Fetch single type by ID
export const getTypeById = (id) => {
  return axios.get(`/types/${id}`).then((res) => res.data);
};

// Create new type
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
