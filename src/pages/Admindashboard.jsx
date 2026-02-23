import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Admin.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE) {
  throw new Error("VITE_API_BASE_URL is not defined. Check your .env file.");
}

function AdminDashboard() {

  const [counts, setCounts] = useState({
    users: 0,
    jobs: 0,
    applications: 0
  });

  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [activeSection, setActiveSection] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // ✅ Fetch Dashboard Counts
  useEffect(() => {

    const fetchCounts = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/dashboard/counts`,
          authHeaders
        );
        setCounts(res.data);
      } catch (err) {
        console.log("Counts Error:", err);
      }
    };

    fetchCounts();

  }, []);

  // 🔹 Generic fetch function
  const fetchData = async (endpoint, setter, section) => {

    if (activeSection === section) {
      setActiveSection(null);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `${API_BASE}${endpoint}`,
        authHeaders
      );

      setter(res.data);
      setActiveSection(section);

    } catch (err) {
      console.log(`${section} Fetch Error:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">

      <div className="dashboard-cards">

        <div
          className="card blue"
          onClick={() => fetchData("/admin/users", setUsers, "users")}
          style={{ cursor: "pointer" }}
        >
          <h2>{counts.users}</h2>
          <p>Total Users</p>
        </div>

        <div
          className="card green"
          onClick={() => fetchData("/admin/jobs", setJobs, "jobs")}
          style={{ cursor: "pointer" }}
        >
          <h2>{counts.jobs}</h2>
          <p>Total Jobs</p>
        </div>

        <div
          className="card purple"
          onClick={() => fetchData("/admin/applications", setApplications, "applications")}
          style={{ cursor: "pointer" }}
        >
          <h2>{counts.applications}</h2>
          <p>Total Applications</p>
        </div>

      </div>

      {loading && <p style={{ marginTop: "20px" }}>Loading...</p>}

      {/* USERS */}
      {activeSection === "users" && !loading && (
        <SectionTable
          title="User Details"
          headers={["ID", "Name", "Email", "Role"]}
          data={users}
          renderRow={(user) => (
            <>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </>
          )}
          colSpan={4}
        />
      )}

      {/* JOBS */}
      {activeSection === "jobs" && !loading && (
        <SectionTable
          title="Job Details"
          headers={["ID", "Title", "Location", "Salary"]}
          data={jobs}
          renderRow={(job) => (
            <>
              <td>{job.id}</td>
              <td>{job.title}</td>
              <td>{job.location}</td>
              <td>{job.salary || "N/A"}</td>
            </>
          )}
          colSpan={4}
        />
      )}

      {/* APPLICATIONS */}
      {activeSection === "applications" && !loading && (
        <SectionTable
          title="Application Details"
          headers={["ID", "Name", "Email", "Status", "Job"]}
          data={applications}
          renderRow={(app) => (
            <>
              <td>{app.id}</td>
              <td>{app.user?.name || "N/A"}</td>
              <td>{app.user?.email || "N/A"}</td>
              <td>{app.status}</td>
              <td>{app.job?.title || "N/A"}</td>
            </>
          )}
          colSpan={5}
        />
      )}

    </div>
  );
}

// 🔹 Reusable Table Component
function SectionTable({ title, headers, data, renderRow, colSpan }) {
  return (
    <div className="users-section">
      <h3>{title}</h3>
      <table width="100%">
        <thead>
          <tr>
            {headers.map((h, index) => (
              <th key={index}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map(item => (
              <tr key={item.id}>
                {renderRow(item)}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={colSpan}>No Data Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;