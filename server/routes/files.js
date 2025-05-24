const express = require("express");
const { listFilesFromGCS, deleteFileFromGCS } = require("../config/gcsConfig");

const router = express.Router();

router.get("/:path", async (req, res) => {
  try {
    const prefix = `${req.params.path}/`;
    const files = await listFilesFromGCS(prefix);
    res.json({ files });
  } catch (error) {
    console.error("Error listing files:", error);
    res.status(500).json({ error: "Failed to list files" });
  }
});

router.delete("/:path", async (req, res) => {
  try {
    const { fileUrl } = req.body;

    if (!fileUrl) {
      return res.status(400).json({ error: "File URL is required" });
    }

    await deleteFileFromGCS(fileUrl);
    res.json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: error.message || "Delete failed" });
  }
});

module.exports = router;
