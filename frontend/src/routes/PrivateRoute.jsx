import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
