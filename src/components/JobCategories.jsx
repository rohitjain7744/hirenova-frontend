import "../styles/LandingModern.css";

function JobCategories() {
  return (
    <section className="categories-hero-match">

      {/* Glow Background */}
      <div className="category-bg category-bg1"></div>
      <div className="category-bg category-bg2"></div>

      <h2 className="section-title-light">
        Browse by Category
      </h2>

      <div className="category-grid-dark">

        <div className="category-card-dark">💻 IT & Software</div>
        <div className="category-card-dark">📊 Data Science</div>
        <div className="category-card-dark">📢 Marketing</div>
        <div className="category-card-dark">🏥 Healthcare</div>
        <div className="category-card-dark">💰 Finance</div>
        <div className="category-card-dark">🎨 Design</div>

      </div>

    </section>
  );
}

export default JobCategories;