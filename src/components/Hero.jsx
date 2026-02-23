import { useNavigate } from "react-router-dom";
import "../styles/landing.css";
import bgImage from "../assets/heroback.png";          // your background image
import heroRight from "../assets/herologo.png"; // your right side image

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      className="hero-section"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="hero-overlay"></div>

      <div className="hero-container">

        <div className="hero-left">
          <h1>
            Powering the <br />
            Future of <span>Hiring</span>
          </h1>

          <p>
            Connect with top talent or land your dream job
            with HireNova — a modern hiring platform.
          </p>

          <button
            className="btn-modern"
            onClick={() => navigate("/jobs")}
          >
            Browse Jobs
          </button>

          <div className="hero-stats">
            <div className="stat-box">
              <h3>50K+</h3>
              <p>Job Listings</p>
            </div>
            <div className="stat-box">
              <h3>10K+</h3>
              <p>Companies</p>
            </div>
            <div className="stat-box">
              <h3>100K+</h3>
              <p>Active Users</p>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <img src={heroRight} alt="Hero Illustration" />
        </div>

      </div>
    </section>
  );
}

export default HeroSection;