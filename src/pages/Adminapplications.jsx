import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Admin.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE) {
  throw new Error("VITE_API_BASE_URL is not defined. Check your .env file.");
}

function AdminApplications() {

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // 🔹 Axios headers builder
  const authHeaders = token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    : {};

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_BASE}/applications/all`,
        authHeaders
      );

      setApplications(res.data || []);
      setError("");

    } catch (err) {
      console.error("Fetch Applications Error:", err);

      if (err.response?.status === 401) {
        setError("Unauthorized. Please login as admin.");
      } else if (err.response?.status === 403) {
        setError("Access denied. Admin only.");
      } else {
        setError("Failed to load applications.");
      }

    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {

      await axios.put(
        `${API_BASE}/applications/update-status/${id}`,
        null,
        {
          ...authHeaders,
          params: { status }
        }
      );

      // Update UI instantly
      setApplications(prev =>
        prev.map(app =>
          app.id === id ? { ...app, status } : app
        )
      );

    } catch (err) {
      console.error("Update Status Error:", err);
      alert("Failed to update status.");
    }
  };

  const getStatusClass = (status) => {
    if (status === "APPROVED") return "status approved";
    if (status === "REJECTED") return "status rejected";
    return "status pending";
  };

  // 🔹 Search + Filter
  const filteredApplications = applications.filter(app => {

    const name = app.user?.name || "";

    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="applications-container">

      <h2>Manage Applications</h2>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by applicant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {loading && (
        <div className="loading-box">Loading applications...</div>
      )}

      {error && (
        <div className="error-box">{error}</div>
      )}

      {!loading && !error && (
        <div className="applications-table-wrapper">
          <table className="applications-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Email</th>
                <th>Job</th>
                <th>Status</th>
                <th>Resume</th>
                <th>Update</th>
              </tr>
            </thead>

            <tbody>
              {filteredApplications.length > 0 ? (
                filteredApplications.map(app => (
                  <tr key={app.id}>
                    <td>{app.user?.name || "N/A"}</td>
                    <td>{app.user?.email || "N/A"}</td>
                    <td>{app.job?.title || "N/A"}</td>

                    <td>
                      <span className={getStatusClass(app.status)}>
                        {app.status}
                      </span>
                    </td>

                    <td>
                      {app.resumePath ? (
                        <a
                          href={`${API_BASE}/applications/resume/${app.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="resume-btn"
                        >
                          View PDF
                        </a>
                      ) : (
                        <span className="no-resume">No Resume</span>
                      )}
                    </td>

                    <td>
                      <select
                        value={app.status}
                        onChange={(e) =>
                          updateStatus(app.id, e.target.value)
                        }
                        className="status-select"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No Applications Found</td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      )}

    </div>
  );
}

export default AdminApplications;