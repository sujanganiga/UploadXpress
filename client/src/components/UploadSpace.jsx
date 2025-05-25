import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../components/css/UploadSpace.css";

const UploadSpace = () => {
  const { userPath } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filesList, setFilesList] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const fetchFiles = async () => {
    try {
      const res = await axios.get(
        // `http://localhost:5000/api/files/${userPath}`
        `https://uploadxpress-backend.onrender.com/api/files/${userPath}`
      );
      setFilesList(res.data.files);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [userPath]);

  const formatUploadDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userPath", userPath);

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        // "http://localhost:5000/api/upload",
        "https://uploadxpress-backend.onrender.com/api/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setUploadedUrl(res.data.url);
      await fetchFiles();
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileUrl) => {
    if (!window.confirm("Permanently delete this file?")) return;

    try {
      await axios.delete(
        // `http://localhost:5000/api/files/${userPath}`,
        `https://uploadxpress-backend.onrender.com/api/files/${userPath}`,
        {
          data: { fileUrl },
        }
      );
      await fetchFiles();
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete file");
    }
  };

  return (
    <div className="upload-space-container">
      <div className="upload-header">
        <div className="header-content">
          <h1 className="header-title">/{userPath}</h1>
          <p className="header-subtitle">Your personal file space</p>
        </div>
        <button className="back-button" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>

      <div className="main-content">
        <div
          className={`upload-box ${dragActive ? "drag-active" : ""}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <div className="upload-inner">
            <svg className="upload-icon" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>

            <h3 className="upload-title">
              {file ? file.name : "Drag & drop files here"}
            </h3>
            <p className="upload-message">
              {file ? "Ready to upload" : "or click to select files"}
            </p>

            <div className="upload-controls">
              <label className="file-input-label">
                <input
                  type="file"
                  className="hidden-input"
                  onChange={handleFileChange}
                />
                Choose File
              </label>

              {file && (
                <button
                  className={`upload-button ${
                    loading ? "disabled" : "enabled"
                  }`}
                  onClick={handleUpload}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading-indicator">
                      <svg className="spinner" viewBox="0 0 24 24">
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    "Upload Now"
                  )}
                </button>
              )}
            </div>

            {error && <div className="upload-error">{error}</div>}

            {uploadedUrl && (
              <div className="upload-success">
                <p>✓ Upload successful!</p>
                <a
                  href={uploadedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="upload-link"
                >
                  {uploadedUrl}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="file-list-container">
          <div className="file-list-header">
            <h2 className="file-list-title">Your Files</h2>
            <span className="file-count">
              {filesList.length} {filesList.length === 1 ? "file" : "files"}
            </span>
          </div>

          {filesList.length > 0 ? (
            <div className="file-list">
              {filesList.map((file, index) => (
                <div key={index} className="file-item">
                  <div className="file-info">
                    <div className="file-icon">
                      <svg viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="file-details">
                      <p className="file-name">{file.name}</p>
                      <p className="file-date">
                        {formatUploadDate(file.uploadedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="file-actions">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="download-button"
                      title="Download"
                    >
                      <svg viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </a>
                    {/* <button
                      onClick={() => handleDelete(file.url)}
                      className="delete-button"
                      title="Delete"
                    >
                      <svg viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button> */}
                    <button
                      onClick={() => handleDelete(file.url)}
                      className="delete-button"
                      title="Delete"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <svg className="empty-icon" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="empty-title">No files uploaded yet</h3>
              <p className="empty-message">
                Upload your first file to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadSpace;
