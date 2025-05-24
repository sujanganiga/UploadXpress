const express = require("express");
const multer = require("multer");
const { uploadFileToGCS } = require("../config/gcsConfig");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", (req, res) => {
  res.send("Upload endpoint is live 🚀");
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const userPath = req.body.userPath || "default";
    const result = await uploadFileToGCS(req.file, userPath);

    res.status(200).json({
      message: "File uploaded successfully",
      url: result.url,
      name: result.name,
      path: userPath,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message || "Upload failed" });
  }
});

module.exports = router;
