const express = require("express");
const router = express.Router();

const {
  summarize,
  analyze,
  analyzeFile,
} = require("../controllers/fileController");
const { improveText } = require("../controllers/aiController");

router.post("/summarize", summarize);
router.post("/analyze", analyze, analyzeFile);
router.post("/improve-text", improveText);

module.exports = router;
