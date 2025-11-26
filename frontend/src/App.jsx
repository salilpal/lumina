// src/App.jsx
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { fetchMe } from "./features/auth/authSlice";
import { getTokenFromStorage } from "./utils/tokenHelper";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getTokenFromStorage();
    if (token) {
      dispatch(fetchMe());
    }
  }, [dispatch]);

  return (
    <>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default App;
