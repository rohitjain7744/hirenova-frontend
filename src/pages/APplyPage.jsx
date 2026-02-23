import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ApplyPage.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function ApplyPage() {

  const { jobId } = useParams();
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  const userId = storedUser?.userId || storedUser?.id;

  const [job, setJob] = useState(null);
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    dob: ""
  });

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  /* ================= REDIRECT IF NOT LOGIN ================= */
  useEffect(() => {
    if (!userId) navigate("/login");
  }, [userId, navigate]);

  /* ================= FETCH JOB ================= */
  useEffect(() => {
    axios.get(`${API_BASE}/jobs/${jobId}`)
      .then(res => setJob(res.data))
      .catch(err => console.log("Job Fetch Error:", err));
  }, [jobId]);

  /* ================= VALIDATIONS ================= */
  const validateStep1 = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name required";
    if (!form.email.trim()) newErrors.email = "Email required";
    if (!form.dob) newErrors.dob = "DOB required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    if (!file) {
      setErrors({ resume: "Resume required (PDF only)" });
      return false;
    }

    if (file.type !== "application/pdf") {
      setErrors({ resume: "Only PDF files allowed" });
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("jobId", jobId);
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("dob", form.dob);
      formData.append("resume", file);

      await axios.post(
        `${API_BASE}/applications/apply`,
        formData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setShowModal(true);

    } catch (error) {

      console.error("Apply Error:", error);

      if (error.response?.data) {
        alert(error.response.data);
      } else {
        alert("Application failed");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-container">

      <div className="apply-card">

        {job && (
          <div className="job-info">
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <p>{job.location}</p>
          </div>
        )}

        <h2>Apply for Job</h2>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <div className="input-group">
              <label>Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="input-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
              />
              {errors.dob && <span className="error">{errors.dob}</span>}
            </div>

            <button
              onClick={() => {
                if (validateStep1()) setStep(2);
              }}
            >
              Next
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <div className="input-group">
              <label>Upload Resume (PDF)</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
              />
              {errors.resume && <span className="error">{errors.resume}</span>}
            </div>

            <div className="step-buttons">
              <button onClick={() => setStep(1)}>Back</button>

              <button
                onClick={() => {
                  if (validateStep2()) handleSubmit();
                }}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </>
        )}

      </div>

      {/* SUCCESS MODAL */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Application Submitted Successfully 🎉</h3>
            <button onClick={() => navigate("/my-applications")}>
              Go to My Applications
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default ApplyPage;