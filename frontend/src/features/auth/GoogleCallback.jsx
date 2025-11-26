import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchMe } from "./authSlice";
import { useNavigate } from "react-router-dom";
import { setTokenToStorage } from "../../utils/tokenHelper";
import { useAuth } from "../../context/AuthContext";

const GoogleCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");

    const loginUser = async () => {
      if (token) {
        setTokenToStorage(token);
        try {
          await authLogin(token);

          const user = await dispatch(fetchMe()).unwrap();

          if (user.isAdmin) {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        } catch (err) {
          console.error("Google login fetchMe failed", err);
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    };

    loginUser();
  }, [dispatch, navigate, authLogin]);

  return <p>Logging in with Google...</p>;
};

export default GoogleCallback;
