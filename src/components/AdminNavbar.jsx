import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/AdminNavbar.css";
import logoImg from "../assets/logo.png";

function AdminNavbar() {

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="admin-navbar">

      <div className="admin-nav-container">

        {/* Logo */}
        <div className="admin-logo" onClick={() => navigate("/admin/dashboard")}>
          <img src={logoImg} alt="Logo" />
          <span>Admin Panel</span>
        </div>

        {/* Links */}
        <nav className={`admin-links ${menuOpen ? "active" : ""}`}>
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
          <NavLink to="/admin/jobs">Manage Jobs</NavLink>
          <NavLink to="/admin/applications">Applications</NavLink>
          <NavLink to="/admin/users">Users</NavLink>
          <NavLink to="/admin/add-job">Add Job</NavLink>
        </nav>

        {/* Right Section */}
        <div className="admin-right">

          <span className="admin-name">
            👑 {user?.name}
          </span>

          <button className="admin-logout" onClick={handleLogout}>
            Logout
          </button>

          <div
            className="admin-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </div>

        </div>

      </div>

    </header>
  );
}

export default AdminNavbar;