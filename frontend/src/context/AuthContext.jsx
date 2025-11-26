// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getTokenFromStorage,
  removeTokenFromStorage,
  setTokenToStorage,
} from "../utils/tokenHelper";

import axios from "../services/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getTokenFromStorage());
  const [loading, setLoading] = useState(true);

  const fetchUser = async (tokenParam) => {
    console.log("Token sent to /auth/me:", tokenParam);
    try {
      const res = await axios.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${tokenParam}`,
        },
      });
      setUser(res.data);
    } catch (error) {
      console.error("Auth error:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // const fetchUser = async () => {
  //   console.log("Token sent to /auth/me:", token);
  //   try {
  //     const res = await axios.get("/auth/me", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setUser(res.data.user);
  //   } catch (error) {
  //     console.error("Auth error:", error);
  //     logout();
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    if (token) fetchUser();
    else setLoading(false);
  }, [token]);

  const login = async (newToken) => {
    setToken(newToken);
    setTokenToStorage(newToken);
    await fetchUser(newToken); // pass token explicitly
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    removeTokenFromStorage();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
