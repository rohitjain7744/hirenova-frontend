import "../styles/LandingModern.css";
import bgImage from "../assets/back1.png";
import featuredLogos from "../assets/featurecompaines.png";

function FeaturedCompanies() {
  return (
    <section
      className="companies-hero-match"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="company-overlay"></div>

      <div className="companies-content">
        <h2 className="section-title-light">
          Trusted by Leading Companies
        </h2>

        <div className="featured-logo-wrapper">
          <img
            src={featuredLogos}
            alt="Featured Company Logos"
            className="featured-logo-image"
          />
        </div>
      </div>
    </section>
  );
}

export default FeaturedCompanies;