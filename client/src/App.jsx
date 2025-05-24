import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import UploadSpace from "./components/UploadSpace";
import "./App.css";
import "./components/css/HomePage.css";
import "./components/css/UploadSpace.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:userPath" element={<UploadSpace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
