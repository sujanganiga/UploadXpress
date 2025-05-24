const express = require("express");
const { listFilesFromGCS } = require("../config/gcsConfig");

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

module.exports = router;
