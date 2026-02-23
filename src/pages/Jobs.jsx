import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Jobs.css";
import Footer from "../components/Footer";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE) {
  throw new Error("VITE_API_BASE_URL is not defined. Check .env file.");
}

function Jobs() {

  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    fetchJobs(page);
  }, [page]);

  // 🔹 Fetch Jobs
  const fetchJobs = async (pageNumber) => {
    try {

      const res = await axios.get(
        `${API_BASE}/jobs`,
        {
          params: { page: pageNumber, size: 6 }
        }
      );

      const data = res.data?.content || [];

      setJobs(data);
      setFilteredJobs(data);
      setTotalPages(res.data?.totalPages || 0);

    } catch (err) {
      console.error("Fetch Jobs Error:", err);
      setJobs([]);
      setFilteredJobs([]);
    }
  };

  // 🔹 Search + Filter Effect
  useEffect(() => {

    const updated = jobs.filter(job => {

      const matchesKeyword =
        job.title?.toLowerCase().includes(keyword.toLowerCase()) ||
        job.company?.toLowerCase().includes(keyword.toLowerCase());

      const matchesLocation =
        locationFilter === "ALL" || job.location === locationFilter;

      return matchesKeyword && matchesLocation;
    });

    setFilteredJobs(updated);

  }, [keyword, locationFilter, jobs]);

  return (
    <>
      <div className="jobs-page">
        <div className="jobs-container">

          <h2 className="section-title">Explore Opportunities</h2>

          {/* 🔎 Search + Filter */}
          <div className="filter-bar">

            <input
              type="text"
              placeholder="Search job title or company..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="ALL">All Locations</option>
              {[...new Set(jobs.map(j => j.location))].map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

          </div>

          {/* Jobs Grid */}
          <div className="jobs-grid">

            {filteredJobs.length === 0 && (
              <div className="no-jobs">No jobs found</div>
            )}

            {filteredJobs.map((job) => (
              <div className="job-card" key={job.id}>

                <div className="job-header">
                  <h3>{job.title}</h3>
                  <span className="location">{job.location}</span>
                </div>

                <p className="company">{job.company}</p>

                <div className="job-actions">

                  <button
                    className="info-btn"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    View Details
                  </button>

                  {user && user.role !== "ADMIN" && (
                    <button
                      className="apply-btn"
                      onClick={() => navigate(`/apply/${job.id}`)}
                    >
                      Apply Now
                    </button>
                  )}

                </div>

              </div>
            ))}

          </div>

          {/* Pagination */}
          <div className="pagination">

            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              ← Prev
            </button>

            <span>
              Page {page + 1} of {totalPages}
            </span>

            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
            >
              Next →
            </button>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default Jobs;