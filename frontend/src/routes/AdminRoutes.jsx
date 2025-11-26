// src/routes/AdminRoutes.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AdminRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return null; // Or a loader

  if (!user) return <Navigate to="/login" />;
  if (!user.isAdmin) return <Navigate to="/" />;

  return <Outlet />;
};

export default AdminRoutes;

// // src/routes/AdminRoutes.jsx
// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";

// const AdminRoutes = () => {
//   const { user } = useAuth();

//   if (!user) return <Navigate to="/login" />;
//   if (!user.isAdmin) return <Navigate to="/" />;

//   // if (user.isAdmin && !user.isActive) {
//   //   return <Navigate to="/admin/dashboard" />;
//   // }
//   // if (user.isAdmin) return <Navigate to="/admin/dashboard" />;
//   // return <Outlet />;
// };

// export default AdminRoutes;
