import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/UserDashboard.css";
import Footer from "../components/Footer";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE) {
  throw new Error("VITE_API_BASE_URL is not defined. Check your .env file.");
}

function UserDashboard() {

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const authHeaders = token
    ? {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    : {};

  useEffect(() => {

    if (!storedUser?.userId) {
      setError("Please login first.");
      setLoading(false);
      return;
    }

    const fetchApplications = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${API_BASE}/applications/user/${storedUser.userId}`,
          authHeaders
        );

        const apps = res.data || [];

        setStats({
          total: apps.length,
          pending: apps.filter(a => a.status === "PENDING").length,
          approved: apps.filter(a => a.status === "APPROVED").length,
          rejected: apps.filter(a => a.status === "REJECTED").length
        });

        setError("");

      } catch (err) {
        console.error("Dashboard Fetch Error:", err);

        if (err.response?.status === 401) {
          setError("Unauthorized. Please login again.");
        } else {
          setError("Failed to load dashboard data.");
        }

      } finally {
        setLoading(false);
      }
    };

    fetchApplications();

  }, [storedUser?.userId]);

  if (loading) {
    return <div className="dashboard-container">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard-container">{error}</div>;
  }

  return (
    <>
      <div className="dashboard-container">

        <h1 className="dashboard-title">My Dashboard</h1>

        <div className="dashboard-grid">

          <div className="dashboard-card blue">
            <h2>{stats.total}</h2>
            <p>Total Applications</p>
          </div>

          <div className="dashboard-card yellow">
            <h2>{stats.pending}</h2>
            <p>Pending</p>
          </div>

          <div className="dashboard-card green">
            <h2>{stats.approved}</h2>
            <p>Approved</p>
          </div>

          <div className="dashboard-card red">
            <h2>{stats.rejected}</h2>
            <p>Rejected</p>
          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}

export default UserDashboard;