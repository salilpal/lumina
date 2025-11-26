// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import AllCategories from "../pages/AllCategories";
import CategoryTypes from "../pages/CategoryTypes";
import TypeProducts from "../pages/TypeProducts";
import ProductDetails from "../pages/ProductDetails";

import SearchResults from "../pages/SearchResults";
import CartPage from "../pages/CartPage";

import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import Profile from "../features/auth/Profile";
import GoogleCallback from "../features/auth/googleCallback";

import ProductCreate from "../features/admin/products/ProductCreate";
import Dashboard from "../features/admin/Dashboard";
import UserList from "../features/admin/UserList";
import CategoryManager from "../features/admin/CategoryManager";
import TypesByCategory from "../features/admin/TypesByCategory";
import ProductsByType from "../features/admin/ProductsByType";
import ProductList from "../features/admin/ProductList";

import PrivateRoute from "./PrivateRoute";
import AdminRoutes from "./AdminRoutes";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

import GoogleSuccess from "../features/auth/GoogleSuccess";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public User Routes */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/categories" element={<AllCategories />} />
        <Route path="/categories/:slug/types" element={<CategoryTypes />} />
        <Route path="/types/:typeSlug/products" element={<TypeProducts />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/cart" element={<CartPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/login-success" element={<GoogleSuccess />} />

        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoutes />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<UserList />} />
          <Route path="/admin/categories" element={<CategoryManager />} />
          <Route
            path="/admin/categories/:categoryId/types"
            element={<TypesByCategory />}
          />
          <Route
            path="/admin/types/:typeId/products"
            element={<ProductsByType />}
          />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/products/create" element={<ProductCreate />} />
        </Route>
      </Route>

      {/* Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
