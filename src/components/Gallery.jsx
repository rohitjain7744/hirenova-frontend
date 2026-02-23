import "../styles/LandingModern.css";
import Gallery1 from"../assets/gallery1.jpg";
import Gallery2 from"../assets/gallery2.jpg";
import Gallery3 from"../assets/gallery3.jpg";
import Gallery4 from"../assets/gallery4.jpg";

function Gallery() {
  return (
    <section className="gallery-hero-match">

      {/* Glow Background */}
      <div className="gallery-bg gallery-bg1"></div>
      <div className="gallery-bg gallery-bg2"></div>

      <h2 className="section-title-light">
        Work Culture
      </h2>

      <div className="gallery-grid-dark">

        <div className="gallery-item-dark"> <img src={Gallery1} alt="" /></div>
        <div className="gallery-item-dark"><img src={Gallery2} alt="" /></div>
        <div className="gallery-item-dark"><img src={Gallery3} alt="" /></div>
        <div className="gallery-item-dark"><img src={Gallery4} alt="" /></div>

      </div>

    </section>
  );
}

export default Gallery;