import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function UploadForm() {
  const [file, setFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filesList, setFilesList] = useState([]);
  const { userPath } = useParams();
  const navigate = useNavigate();

  const fetchFiles = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/files/${userPath}`
      );
      setFilesList(res.data.files);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [userPath]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userPath", userPath);

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadedUrl(res.data.url);
      await fetchFiles(); // Refresh files list after upload
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    const newPath = prompt(
      "Enter your new path name (letters and numbers only):"
    );
    if (newPath && /^[a-zA-Z0-9-]+$/.test(newPath)) {
      navigate(`/${newPath.toLowerCase()}`);
    } else {
      setError("Invalid path name. Use only letters, numbers and hyphens.");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Upload Space: /{userPath}</h2>
        <button
          onClick={handleCreateNew}
          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
        >
          Create New Space
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <form onSubmit={handleUpload} className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="file"
              onChange={handleFileChange}
              className="border p-2 rounded flex-grow"
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded whitespace-nowrap hover:bg-blue-700 disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-sm text-gray-500">Max file size: 10MB</p>
        </form>

        {error && (
          <div className="mt-2 p-2 bg-red-50 rounded">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {uploadedUrl && (
          <div className="mt-2 p-2 bg-green-50 rounded transition-opacity duration-500">
            <p className="text-green-600 font-medium">Uploaded successfully!</p>
            <a
              href={uploadedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline break-all text-sm"
            >
              {uploadedUrl}
            </a>
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold">Files in /{userPath}</h3>
          <span className="text-sm text-gray-500">
            {filesList.length} {filesList.length === 1 ? "file" : "files"}
          </span>
        </div>

        {filesList.length > 0 ? (
          <ul className="divide-y">
            {filesList.map((file, index) => (
              <li
                key={index}
                className="py-2 flex justify-between items-center"
              >
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline break-all"
                >
                  {file.name}
                </a>
                <span className="text-xs text-gray-500">
                  {new Date(file.uploadedAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No files uploaded yet
          </p>
        )}
      </div>
    </div>
  );
}

export default UploadForm;
