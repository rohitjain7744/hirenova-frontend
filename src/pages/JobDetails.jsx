import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/JobDetails.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE) {
  throw new Error("VITE_API_BASE_URL is not defined. Check your .env file.");
}

function JobDetails() {

  const { id } = useParams();   // ✅ FIXED
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchJob = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API_BASE}/jobs/${id}`);
        setJob(res.data);
        setError("");

      } catch (err) {
        console.error("Job Fetch Error:", err);

        if (err.response?.status === 404) {
          setError("Job not found.");
        } else {
          setError("Failed to load job details.");
        }

      } finally {
        setLoading(false);
      }
    };

    if (id) fetchJob();

  }, [id]);

  if (loading) {
    return <div className="job-loading">Loading job details...</div>;
  }

  if (error) {
    return <div className="job-loading">{error}</div>;
  }

  if (!job) {
    return <div className="job-loading">Job not found.</div>;
  }

  return (
    <div className="job-details-wrapper">

      <div className="job-details-container">

        <div className="job-details-header">
          <h1>{job.title}</h1>
          <p className="company-name">{job.company}</p>
        </div>

        <div className="job-details-meta">
          <div className="meta-box">
            <span>Location</span>
            <strong>{job.location}</strong>
          </div>

          <div className="meta-box">
            <span>Job Type</span>
            <strong>{job.jobType || "Full Time"}</strong>
          </div>
        </div>

        <div className="job-details-description">
          <h3>About This Role</h3>
          <p>{job.description}</p>
        </div>

        <div className="job-details-actions">
          <button
            className="primary-btn"
            onClick={() => navigate(`/apply/${job.id}`)}
          >
            Apply Now
          </button>
        </div>

      </div>

    </div>
  );
}

export default JobDetails;