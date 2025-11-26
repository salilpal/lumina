// src/utils/tokenHelper.js

const TOKEN_KEY = "token";

// When setting token
export const setTokenToStorage = (token) => {
  console.log("Storing token:", token);
  localStorage.setItem(TOKEN_KEY, token);
};

// When getting token
export const getTokenFromStorage = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  console.log("Retrieved token from storage:", token);
  return token;
};

export const removeTokenFromStorage = () => {
  localStorage.removeItem(TOKEN_KEY);
};
