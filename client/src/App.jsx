import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UploadForm from "./components/UploadForm";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:userPath" element={<UploadForm />} />
        </Routes>
      </div>
    </Router>
  );
}

function HomePage() {
  return (
    <div className="text-center max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome to GCS Uploader</h1>
      <p className="mb-4">Create your own upload space by visiting:</p>
      <div className="bg-white p-4 rounded shadow mb-6">
        <p className="font-mono">http://localhost:3000/your-path</p>
      </div>
      <p className="mb-4">Try these example paths:</p>
      <div className="flex gap-2 justify-center">
        <Link
          to="/docs"
          className="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200"
        >
          /docs
        </Link>
        <Link
          to="/images"
          className="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200"
        >
          /images
        </Link>
      </div>
    </div>
  );
}

export default App;
