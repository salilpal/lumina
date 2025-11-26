import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./authSlice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-xl text-center">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      {user ? (
        <>
          <p className="text-lg">Name: {user.name}</p>
          <p className="text-gray-600">Email: {user.email}</p>
          <p className="text-gray-600">
            isAdmin: {user.isAdmin ? "true" : "false"}
          </p>

          <button
            onClick={handleLogout}
            className="mt-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </>
      ) : (
        <p className="text-gray-500">No user info available.</p>
      )}
    </div>
  );
};

export default Profile;
