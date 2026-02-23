import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Navbar.css";
import logoImg from "../assets/logo.png";
import defaultAvatar from "../assets/deafult.png";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function Navbar() {

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // remove JWT if exists
    navigate("/login");
  };

  const profileImageUrl =
    user?.profileImage && API_BASE
      ? `${API_BASE}/users/profile-image/${user.profileImage}`
      : defaultAvatar;

  const closeMenus = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  return (
    <header className="navbar">
      <div className="nav-container">

        {/* LOGO */}
        <div
          className="logo"
          onClick={() => {
            navigate(user ? "/jobs" : "/");
            closeMenus();
          }}
        >
          <img src={logoImg} alt="HireNova Logo" />
          <span>HireNova</span>
        </div>

        {/* NAV LINKS */}
        <nav className={`nav-links ${menuOpen ? "active" : ""}`}>

          {/* ===== PUBLIC ===== */}
          {!user && (
            <>
              <NavLink to="/" end onClick={closeMenus}>Home</NavLink>
              <NavLink to="/jobs" onClick={closeMenus}>Jobs</NavLink>
              <NavLink to="/login" onClick={closeMenus}>Login</NavLink>
              <NavLink to="/register" onClick={closeMenus}>Register</NavLink>
            </>
          )}

          {/* ===== USER ===== */}
          {user?.role === "USER" && (
            <>
              <NavLink to="/" end onClick={closeMenus}>Home</NavLink>
              <NavLink to="/jobs" onClick={closeMenus}>Jobs</NavLink>
              <NavLink to="/my-applications" onClick={closeMenus}>
                My Applications
              </NavLink>
              <NavLink to="/dashboard" onClick={closeMenus}>
                Dashboard
              </NavLink>
            </>
          )}

          {/* ===== ADMIN ===== */}
          {user?.role === "ADMIN" && (
            <>
              <NavLink to="/admin/dashboard" onClick={closeMenus}>
                Dashboard
              </NavLink>
              <NavLink to="/admin/jobs" onClick={closeMenus}>
                Manage Jobs
              </NavLink>
              <NavLink to="/admin/applications" onClick={closeMenus}>
                Applications
              </NavLink>
              <NavLink to="/admin/users" onClick={closeMenus}>
                Users
              </NavLink>
            </>
          )}

        </nav>

        {/* PROFILE SECTION */}
        {user && (
          <div className="profile-section">

            <div
              className="profile-trigger"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img
                src={profileImageUrl}
                alt="Profile"
                className="nav-profile-img"
              />
              <span>{user.name}</span>
            </div>

            {dropdownOpen && (
              <div className="profile-dropdown">
                <button
                  onClick={() => {
                    navigate("/profile");
                    closeMenus();
                  }}
                >
                  My Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="logout-btn"
                >
                  Logout
                </button>
              </div>
            )}

          </div>
        )}

        {/* HAMBURGER */}
        <div
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

      </div>
    </header>
  );
}

export default Navbar;