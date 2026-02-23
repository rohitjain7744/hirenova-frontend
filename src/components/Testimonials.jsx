import "../styles/LandingModern.css";

function Testimonials() {
  return (
    <section className="testimonials-hero-match">

      {/* Glow Background */}
      <div className="testimonial-bg testimonial-bg1"></div>
      <div className="testimonial-bg testimonial-bg2"></div>

      <h2 className="section-title-light">
        What Our Users Say
      </h2>

      <div className="testimonial-grid-dark">

        <div className="testimonial-card-dark">
          <p>"Got hired within 2 weeks! Amazing platform."</p>
          <h4>- Rahul Sharma</h4>
        </div>

        <div className="testimonial-card-dark">
          <p>"Very smooth application process."</p>
          <h4>- Priya Singh</h4>
        </div>

        <div className="testimonial-card-dark">
          <p>"Best job portal experience so far."</p>
          <h4>- Amit Verma</h4>
        </div>

      </div>

    </section>
  );
}

export default Testimonials;