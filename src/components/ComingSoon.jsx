import "../styles/ComingSoon.css";

function ComingSoon({ title }) {
  return (
    <div className="coming-wrapper">

      <div className="coming-glow coming-glow1"></div>
      <div className="coming-glow coming-glow2"></div>

      <div className="coming-content">
        <div className="coming-icon">🚀</div>

        <h1>{title}</h1>
        <p>
          We're working hard to bring this feature to you.
          Stay tuned for something amazing!
        </p>

        <span className="coming-badge">Coming Soon</span>
      </div>

    </div>
  );
}

export default ComingSoon;