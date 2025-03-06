const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const summarize = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const response = await axios.post("http://127.0.0.1:8000/summarize", {
      text,
    });

    res.json(response.data);
  } catch (error) {
    console.error("Express Error:", error.response?.data || error.message);
    res
      .status(500)
      .json({ error: error.response?.data || "Summarization failed" });
  }
};

const analyze = upload.single("pdf");
const analyzeFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const formData = new FormData();
    formData.append("pdf", fs.createReadStream(req.file.path));

    const response = await axios.post(
      "http://127.0.0.1:8000/analyze",
      formData,
      {
        headers: { ...formData.getHeaders() },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Express Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || "Analysis failed" });
  }
};

module.exports = { summarize, analyze, analyzeFile };
