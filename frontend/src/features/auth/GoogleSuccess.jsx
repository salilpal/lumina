import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchMe } from "./authSlice";
import { setTokenToStorage } from "../../utils/tokenHelper";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // import your AuthContext hook

const GoogleSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  useEffect(() => {
    const handleGoogleRedirect = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (token) {
        setTokenToStorage(token);

        try {
          // Sync context user/token state
          await authLogin(token);

          // fetchMe returns user info here
          const user = await dispatch(fetchMe()).unwrap();

          if (user.isAdmin) {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        } catch (err) {
          console.error("Failed to fetch user after Google login", err);
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    };

    handleGoogleRedirect();
  }, [dispatch, navigate, authLogin]);

  return <p>Logging you in...</p>;
};

export default GoogleSuccess;
