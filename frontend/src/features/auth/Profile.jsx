import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./authSlice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Adjusted selector: Check if your slice structure is state.auth.user 
  // or if user data is nested inside an 'userInfo' object
  const user = useSelector((state) => state.auth.user);
  // console.log(user)

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Helper to get initials for the avatar
  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "U");

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
      <div className="flex flex-col items-center">
        {/* Profile Avatar Placeholder */}
        <div className="w-20 h-20 bg-blue-600 text-white flex items-center justify-center rounded-full text-3xl font-bold mb-4 shadow-md">
          {user ? getInitial(user.name) : "!"}
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h1>

        {user ? (
          <div className="w-full space-y-4">
            <div className="text-left bg-gray-50 p-4 rounded-lg">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Full Name
              </label>
              <p className="text-lg font-medium text-gray-800">{user.name}</p>
            </div>

            <div className="text-left bg-gray-50 p-4 rounded-lg">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Email Address
              </label>
              <p className="text-lg font-medium text-gray-800">{user.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full mt-8 px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 active:scale-[0.98] transition-all shadow-lg shadow-red-200"
            >
              Log Out
            </button>
          </div>
        ) : (
          <div className="py-10">
            <p className="text-gray-500 mb-4">No user info available.</p>
            <button 
              onClick={() => navigate('/login')}
              className="text-blue-600 font-semibold underline"
            >
              Sign in here
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;