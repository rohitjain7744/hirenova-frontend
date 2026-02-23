import { useState } from "react";
import axios from "axios";
import "../styles/Admin.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE) {
  throw new Error("VITE_API_BASE_URL is not defined. Check your .env file.");
}

function AddJob() {

  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    description: ""
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // 🔹 If using JWT later
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setJob(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {

      await axios.post(
        `${API_BASE}/admin/jobs`,
        job,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` })
          }
        }
      );

      setSuccess(true);

      setJob({
        title: "",
        company: "",
        location: "",
        description: ""
      });

      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {

      console.error("Add Job Error:", err);

      if (err.response?.status === 401) {
        setError("Unauthorized. Please login as admin.");
      } else if (err.response?.status === 403) {
        setError("Access denied. Admin only.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Server error. Please try again.");
      }
    }
  };

  return (
    <div className="addjob-container">

      <h2>Add New Job</h2>

      {success && <p className="success-msg">Job Added Successfully</p>}
      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit} className="job-form">

        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={job.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="company"
          placeholder="Company"
          value={job.company}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={job.location}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Job Description"
          value={job.description}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Job</button>

      </form>

    </div>
  );
}

export default AddJob;