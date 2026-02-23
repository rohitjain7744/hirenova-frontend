import { useState } from "react";
import axios from "axios";

function ApplyForm({ jobId }) {

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [form, setForm] = useState({
    name: "",
    email: "",
    dob: ""
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.userId) {
      alert("Please login again.");
      return;
    }

    if (!file) {
      alert("Please upload resume.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userId", user.userId);
      formData.append("jobId", jobId);
      formData.append("resume", file);

      await axios.post(
        "http://localhost:8080/applications/apply-with-resume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Application Submitted Successfully");

    } catch (error) {
      console.error(error);
      alert("Application failed");
    }
  };

  return (
    <div className="form-card">
      <h2>Apply Job</h2>

      <form onSubmit={handleSubmit}>

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
        />

        <input
          type="file"
          onChange={handleFileChange}
        />

        <button type="submit">
          Submit Application
        </button>

      </form>
    </div>
  );
}

export default ApplyForm;