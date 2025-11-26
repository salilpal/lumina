// src/features/admin/UserList.jsx
import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser, makeAdmin } from "../../services/userService";

const UserList = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data.users || []); // depending on your API response
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this user?")) {
      await deleteUser(id);
      fetchUsers();
    }
  };

  const handleMakeAdmin = async (id) => {
    try {
      await makeAdmin(id);
      fetchUsers();
    } catch (error) {
      console.error("Failed to make user admin", error);
      alert("Failed to promote user to admin");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Users</h2>
      <ul>
        {users.map((u) => (
          <li
            key={u._id}
            className="flex justify-between items-center border p-2 mb-2 rounded"
          >
            <span>
              {u.name} ({u.email}) - {u.role}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => handleMakeAdmin(u._id)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Make Admin
              </button>
              <button
                onClick={() => handleDelete(u._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
