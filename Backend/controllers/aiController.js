const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const improveText = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text }] }],
    });

    if (result && result.response && result.response.candidates.length > 0) {
      const improvedText = result.response.candidates[0].content.parts[0].text;
      res.json({ improvedText });
    } else {
      throw new Error("Invalid AI response structure");
    }
  } catch (error) {
    console.error("Express Error:", error.response?.data || error.message);
    res
      .status(500)
      .json({ error: error.response?.data || "AI Assistance failed" });
  }
};

module.exports = { improveText };
