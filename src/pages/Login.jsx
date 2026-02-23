import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

const API_BASE = "https://hirenova-backend-production.up.railway.app";

function Login() {

  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // ✅ Proper axios call
      const response = await axios.post(
        `${API_BASE}/auth/login`,
        form,
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      // ✅ Store user in localStorage
      localStorage.setItem("user", JSON.stringify({
        userId: response.data.userId,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
        profileImage: response.data.profileImage
      }));

      // ✅ Role-based navigation
      if (response.data.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/jobs");
      }

    } catch (error) {

      if (error.response?.status === 401) {
        alert(error.response.data.message || "Invalid email or password");
      } else {
        alert("Server error. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-glow glow1"></div>
      <div className="auth-glow glow2"></div>

      <form className="auth-card" onSubmit={handleSubmit}>

        <h2>Welcome Back</h2>
        <p className="auth-subtitle">
          Login to continue your journey
        </p>

        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="switch-text">
          Don’t have an account?
          <span onClick={() => navigate("/register")}>
            Register
          </span>
        </p>

      </form>
    </div>
  );
}

export default Login;