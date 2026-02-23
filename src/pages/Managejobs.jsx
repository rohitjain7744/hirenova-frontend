import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Admin.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE) {
  throw new Error("VITE_API_BASE_URL is not defined. Check your .env file.");
}

function ManageJobs() {

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  const authHeaders = token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    : {};

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE}/admin/jobs`,
        authHeaders
      );
      setJobs(res.data || []);
      setError("");
    } catch (err) {
      console.error("Fetch Jobs Error:", err);

      if (err.response?.status === 401) {
        setError("Unauthorized. Please login as admin.");
      } else if (err.response?.status === 403) {
        setError("Access denied.");
      } else {
        setError("Failed to load jobs.");
      }

    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      title: "",
      company: "",
      location: "",
      salary: "",
      description: ""
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {

      if (editingId) {
        await axios.put(
          `${API_BASE}/admin/jobs/${editingId}`,
          form,
          authHeaders
        );
        setSuccess("Job Updated Successfully!");
      } else {
        await axios.post(
          `${API_BASE}/admin/jobs`,
          form,
          authHeaders
        );
        setSuccess("Job Added Successfully!");
      }

      resetForm();
      fetchJobs();

      setTimeout(() => setSuccess(""), 3000);

    } catch (err) {
      console.error("Submit Error:", err);
      setError("Failed to save job.");
    }
  };

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API_BASE}/admin/jobs/${id}`,
        authHeaders
      );
      fetchJobs();
    } catch (err) {
      console.error("Delete Error:", err);
      setError("Failed to delete job.");
    }
  };

  const handleEdit = (job) => {
    setForm({
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      description: job.description
    });
    setEditingId(job.id);
  };

  return (
    <div className="manage-jobs">

      <h2>Manage Jobs</h2>

      {success && <div className="success-message">✅ {success}</div>}
      {error && <div className="error-text">{error}</div>}
      {loading && <p>Loading jobs...</p>}

      {/* Job Form */}
      <form onSubmit={handleSubmit} className="job-form">

        <input
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          name="company"
          placeholder="Company Name"
          value={form.company}
          onChange={handleChange}
          required
        />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />

        <input
          name="salary"
          placeholder="Salary"
          value={form.salary}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Job Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editingId ? "Update Job" : "Add Job"}
        </button>
      </form>

      {/* Job Table */}
      {!loading && (
        <table className="jobs-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Salary</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {jobs.length > 0 ? (
              jobs.map(job => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.company}</td>
                  <td>{job.location}</td>
                  <td>{job.salary}</td>
                  <td>{job.description}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(job)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(job.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No Jobs Available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

    </div>
  );
}

export default ManageJobs;