import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminUsers.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE) {
  throw new Error("VITE_API_BASE_URL is not defined. Check your .env file.");
}

function AdminUsers() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // 🔐 Safe header builder
  const authHeaders = token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    : {};

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_BASE}/admin/users`,
        authHeaders
      );

      setUsers(res.data || []);
      setError("");

    } catch (err) {
      console.error("Fetch Users Error:", err);

      if (err.response?.status === 401) {
        setError("Unauthorized. Please login as admin.");
      } else if (err.response?.status === 403) {
        setError("Access denied. Admin only.");
      } else {
        setError("Failed to load users.");
      }

    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {

      await axios.delete(
        `${API_BASE}/admin/users/${id}`,
        authHeaders
      );

      // Update locally
      setUsers(prev => prev.filter(user => user.id !== id));

    } catch (err) {
      console.error("Delete Error:", err);

      if (err.response?.status === 401) {
        alert("Unauthorized. Please login again.");
      } else if (err.response?.status === 403) {
        alert("Admin access required.");
      } else {
        alert("Failed to delete user.");
      }
    }
  };

  return (
    <div className="admin-users-container">

      <div className="admin-users-header">
        <h2>Manage Users</h2>
        <span>Total Users: {users.length}</span>
      </div>

      {loading && <p className="loading-text">Loading users...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <div className="admin-users-table-wrapper">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name || "N/A"}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role?.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => deleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No Users Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

export default AdminUsers;