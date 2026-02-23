import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Profile.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE) {
  throw new Error("VITE_API_BASE_URL is not defined. Check your .env file.");
}

function Profile() {

  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const userId = storedUser?.userId || storedUser?.id;

  const authHeaders = token
    ? {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    : {};

  const [user, setUser] = useState(storedUser);
  const [editMode, setEditMode] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const [form, setForm] = useState({
    name: storedUser?.name || "",
    email: storedUser?.email || ""
  });

  /* ================= PROFILE COMPLETION ================= */

  const calculateCompletion = () => {
    if (!user) return 0;

    let count = 0;
    if (user.name) count++;
    if (user.email) count++;
    if (user.profileImage) count++;

    return Math.round((count / 3) * 100);
  };

  /* ================= INPUT CHANGE ================= */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /* ================= UPDATE PROFILE ================= */

  const handleUpdate = async () => {

    if (!userId) {
      alert("User not found. Please login again.");
      return;
    }

    try {
      const res = await axios.put(
        `${API_BASE}/users/update/${userId}`,
        form,
        authHeaders
      );

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setEditMode(false);

      alert("Profile Updated Successfully");

    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        alert("Unauthorized. Please login again.");
      } else {
        alert(error.response?.data || "Update failed");
      }
    }
  };

  /* ================= UPLOAD PHOTO ================= */

  const uploadPhoto = async () => {

    if (!userId) {
      alert("User not found. Please login again.");
      return;
    }

    if (!photo) {
      alert("Select photo first");
      return;
    }

    const formData = new FormData();
    formData.append("image", photo);

    try {
      const res = await axios.post(
        `${API_BASE}/users/upload-photo/${userId}`,
        formData,
        token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {}
      );

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));

      alert("Photo Uploaded Successfully");

    } catch (error) {
      console.error(error);
      alert(error.response?.data || "Upload failed");
    }
  };

  /* ================= CHANGE PASSWORD ================= */

  const changePassword = async () => {

    if (!userId) {
      alert("User not found. Please login again.");
      return;
    }

    if (!newPassword.trim()) {
      alert("Enter new password");
      return;
    }

    try {
      await axios.put(
        `${API_BASE}/users/change-password/${userId}`,
        { newPassword: newPassword.trim() },
        authHeaders
      );

      alert("Password changed successfully");
      setNewPassword("");

    } catch (error) {
      console.error(error);
      alert(error.response?.data || "Password change failed");
    }
  };

  /* ================= DELETE ACCOUNT ================= */

  const deleteAccount = async () => {

    if (!userId) {
      alert("User not found. Please login again.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete your account?")) {
      return;
    }

    try {
      await axios.delete(
        `${API_BASE}/users/delete/${userId}`,
        authHeaders
      );

      localStorage.clear();
      navigate("/register");

    } catch (error) {
      console.error(error);
      alert(error.response?.data || "Delete failed");
    }
  };

  if (!user) {
    return <div>Please login again.</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">

        <div className="profile-header">
          <img
            src={
              user.profileImage
                ? `${API_BASE}/users/profile-image/${user.profileImage}`
                : "/default-avatar.png"
            }
            alt="Profile"
            className="profile-avatar"
          />
          <h2>{user.name}</h2>
          <p className="profile-role">{user.role}</p>
        </div>

        <div className="progress-container">
          <p>Profile Completion {calculateCompletion()}%</p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${calculateCompletion()}%` }}
            />
          </div>
        </div>

        {!editMode ? (
          <>
            <div className="profile-info">
              <div className="info-item">
                <span>Email</span>
                <strong>{user.email}</strong>
              </div>
            </div>

            <div className="profile-buttons">
              <button className="edit-btn" onClick={() => setEditMode(true)}>
                Edit Profile
              </button>

              <button className="delete-btn" onClick={deleteAccount}>
                Delete Account
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="profile-form">

              <label>Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
              />

              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />

              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <button className="secondary-btn" onClick={changePassword}>
                Change Password
              </button>

              <label>Profile Photo</label>
              <input
                type="file"
                onChange={(e) => setPhoto(e.target.files[0])}
              />

              <button className="secondary-btn" onClick={uploadPhoto}>
                Upload Photo
              </button>

            </div>

            <div className="profile-actions">
              <button className="save-btn" onClick={handleUpdate}>
                Save Changes
              </button>

              <button
                className="cancel-btn"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Profile;