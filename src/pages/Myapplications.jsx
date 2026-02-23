import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/MyApplication.css";
import Footer from "../components/Footer";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE) {
  throw new Error("VITE_API_BASE_URL is not defined. Check your .env file.");
}

function MyApplications() {

  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const authHeaders = token
    ? {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    : {};

  // ================= FETCH =================
  useEffect(() => {
    if (!user?.userId) return;
    fetchApplications();
  }, [user?.userId]);

  // ================= FILTER =================
  useEffect(() => {
    if (filter === "ALL") {
      setFilteredApps(applications);
    } else {
      setFilteredApps(
        applications.filter(app => app.status === filter)
      );
    }
  }, [filter, applications]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `${API_BASE}/applications/user/${user.userId}`,
        authHeaders
      );

      setApplications(res.data || []);

    } catch (err) {
      console.error("Fetch Applications Error:", err);

      if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else if (err.response?.status === 403) {
        setError("Access denied.");
      } else {
        setError("Failed to load applications.");
      }

    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "status pending";
      case "APPROVED":
        return "status approved";
      case "REJECTED":
        return "status rejected";
      default:
        return "status";
    }
  };

  if (!user) {
    return (
      <div className="applications-container">
        Please login first.
      </div>
    );
  }

  return (
    <>
      <div className="applications-container">

        <div className="applications-header">
          <h2>My Applications</h2>

          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {loading ? (
          <div className="empty-box">Loading applications...</div>
        ) : error ? (
          <div className="empty-box error">{error}</div>
        ) : filteredApps.length === 0 ? (
          <div className="empty-box">
            <p>No applications found.</p>
          </div>
        ) : (
          <div className="applications-grid">

            {filteredApps.map((app) => (
              <div className="application-card" key={app.id}>

                <div className="card-header">
                  <h3>{app.job?.title || "Job Title"}</h3>
                  <span className={getStatusClass(app.status)}>
                    {app.status}
                  </span>
                </div>

                <p><strong>Company:</strong> {app.job?.company || "N/A"}</p>
                <p><strong>Location:</strong> {app.job?.location || "N/A"}</p>

                {app.createdAt && (
                  <p>
                    <strong>Applied On:</strong>{" "}
                    {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                )}

                {app.resumePath && (
                  <a
                    href={`${API_BASE}/applications/resume/${app.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="resume-btn"
                  >
                    View Resume
                  </a>
                )}

              </div>
            ))}

          </div>
        )}

      </div>

      <Footer />
    </>
  );
}

export default MyApplications;