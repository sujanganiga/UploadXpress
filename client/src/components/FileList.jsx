import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const FileList = () => {
  const [files, setFiles] = useState([]);
  const { userPath } = useParams();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/files/${userPath}`
        );
        setFiles(res.data.files);
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };

    fetchFiles();
  }, [userPath]);

  return (
    <div className="file-list-container">
      <h2 className="file-list-title">Files in /{userPath}</h2>
      {files.length === 0 ? (
        <p className="empty-message">No files uploaded yet</p>
      ) : (
        <ul className="file-list">
          {files.map((file, index) => (
            <li key={index} className="file-item">
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="file-link"
              >
                {file.name}
              </a>
              <span className="file-date">
                {new Date(file.uploadedAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileList;
