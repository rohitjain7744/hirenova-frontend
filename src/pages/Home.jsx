import Hero from "../components/Hero";
import FeaturedCompanies from "../components/FeaturedCompanies";
import JobCategories from "../components/JobCategories";
import Testimonials from "../components/Testimonials";
import Gallery from "../components/Gallery";
import Footer from "../components/Footer";   // ✅ fixed (lowercase)
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import sectionBg from "../assets/back1.png";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">

      <Hero />
      <FeaturedCompanies />
      <JobCategories />

      <section
        className="why-section"
        style={{ backgroundImage: `url(${sectionBg})` }}
      >
        <div className="section-overlay"></div>

        <div className="section-content">
          <h2>Why Choose HireNova?</h2>

          <div className="why-grid">
            <div className="why-card">
              <h3>⚡ Fast Applications</h3>
              <p>
                Apply to jobs in just one click with resume upload support.
              </p>
            </div>

            <div className="why-card">
              <h3>🔒 Secure Platform</h3>
              <p>
                Your data is protected with secure authentication and storage.
              </p>
            </div>

            <div className="why-card">
              <h3>📈 Career Growth</h3>
              <p>
                Find opportunities that match your skills and career goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />
      <Gallery />

      <section
        className="cta-section"
        style={{ backgroundImage: `url(${sectionBg})` }}
      >
        <div className="section-overlay-light"></div>

        <div className="section-content">
          <h2>Ready to Take the Next Step?</h2>
          <p>
            Join thousands of professionals finding jobs every day.
          </p>

          <div className="cta-buttons">
            <button onClick={() => navigate("/register")}>
              Get Started
            </button>

            <button
              className="outline-btn"
              onClick={() => navigate("/jobs")}
            >
              Browse Jobs
            </button>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}

export default Home;