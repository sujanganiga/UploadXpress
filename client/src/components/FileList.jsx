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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Files in /{userPath}</h2>
      {files.length === 0 ? (
        <p>No files uploaded yet</p>
      ) : (
        <ul className="space-y-3">
          {files.map((file, index) => (
            <li key={index}>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {file.name}
              </a>
              <span className="text-xs text-gray-500 ml-2">
                ({new Date(file.uploadedAt).toLocaleDateString()})
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileList;
