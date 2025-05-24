import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import "../css/HomePage.css";
import "../components/css/HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleCreateNewSpace = () => {
    const newPath = prompt(
      "Create your space name:\n(Use letters, numbers, and hyphens)"
    );

    if (newPath) {
      if (/^[a-zA-Z0-9-]+$/.test(newPath)) {
        navigate(`/${newPath.toLowerCase()}`);
      } else {
        setError("Invalid name. Only letters, numbers, and hyphens allowed.");
        setTimeout(() => setError(""), 3000);
      }
    }
  };

  const features = [
    {
      icon: "✨",
      title: "Simple Sharing",
      desc: "Create custom URLs to share files with anyone",
    },
    {
      icon: "🛡️",
      title: "Private Spaces",
      desc: "Your files stay private unless you share the link",
    },
    {
      icon: "⚡",
      title: "Instant Uploads",
      desc: "Files are available immediately after uploading",
    },
  ];

  return (
    <div className="homepage-container">
      <div className="homepage-header">
        <h1 className="homepage-title">FileDrop</h1>
        <p className="homepage-subtitle">
          Your personal cloud storage with custom URLs
        </p>

        <div className="upload-controls">
          <button
            className="create-space-button"
            onClick={handleCreateNewSpace}
          >
            <svg
              className="icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Create New Space
          </button>

          {error && <div className="error-message">{error}</div>}

          <div className="example-spaces-container">
            <h3 className="example-spaces-title">Try these example spaces:</h3>
            <div className="space-links">
              {["images", "documents", "projects"].map((space) => (
                <a key={space} href={`/${space}`} className="space-link">
                  /{space}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="features-grid">
        {features.map((feature, i) => (
          <div key={i} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
