import "../styles/LandingModern.css";

function Footer() {
  return (
    <footer className="footer-modern">

      <div className="footer-glow footer-glow1"></div>
      <div className="footer-glow footer-glow2"></div>

      <div className="footer-container">

        <div className="footer-brand">
          <h3>HireNova</h3>
          <p>Connecting talent with opportunity worldwide.</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <a href="/jobs">Jobs</a>
          <a href="#">Companies</a>
          <a href="#">Contact</a>
        </div>

        <div className="footer-social">
          <h4>Follow Us</h4>
          <a href="#">LinkedIn</a>
          <a href="#">Twitter</a>
          <a href="#">Instagram</a>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} JobPortal. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;