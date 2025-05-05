const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdfParse = require("pdf-parse");
const { Server } = require("socket.io");
const fs = require("fs");


const app = express();
const upload = multer({ dest: "uploads/" });
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // React frontend URL
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const documents = {}; // Stores documents per room

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);

    if (documents[roomId]) {
      socket.emit("documentUpdated", documents[roomId]); // Send existing doc
    }
  });

  socket.on("updateDocument", ({ roomId, content }) => {
    documents[roomId] = content;
    socket.to(roomId).emit("documentUpdated", content); // Update others
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});



const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const analyzeWithGemini = async (text) => {
  const prompt = `
  You are ASM, an AI designed to analyze academic papers.
  Structure your response with these sections:
  - Abstract
  - Introduction
  - Methodology
  - Results
  - Discussion
  - Conclusion

  Do NOT include any extra titles or overall document titles like "Document Analysis" or "Title". Only provide the sections with headings and respective content.

  Each section should be followed by a blank line, then its content. Ensure each section heading is on a new line followed by the content in its own paragraph.

  Paper Content:
  ${text}
`;

  try {
    // Generate content from the model
    const result = await model.generateContent(prompt);

    // Ensure the result is properly extracted from the response
    const rawText = result.response?.text ? result.response.text() : result;

    // Split the content by sections, looking for section headers like "Abstract", "Introduction", etc.
    const sections = rawText
      .split(/\n(?=[A-Z][a-z]+(?: [A-Z][a-z]+)*\n)/) // Split by titles like "Abstract", "Introduction"
      .map((block) => {
        // Split each block into the title and content
        const [title, ...rest] = block.trim().split("\n");

        // Return an object with the section title and content, removing excess whitespace
        return {
          title: title.trim(),
          content: rest.join(" ").trim(),
        };
      });

    // Format it as plain text without unnecessary newlines
    const formattedContent = sections
      .map((section) => {
        // Return formatted output with the title and content, ensuring no additional newlines
        return `${section.title}: ${section.content}`; // Concatenate title and content without extra newlines
      })
      .join(" "); // Use space to join sections instead of newlines

    return formattedContent; // Return the formatted content (plain text without HTML tags)
  } catch (error) {
    console.error("Error generating content:", error);
    return { error: "Gemini API failed" };
  }

};







app.post("/analyze", upload.single("pdf"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Read the PDF file
    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(dataBuffer);

    // Extract text
    const text = data.text;

    // Get AI analysis
    const structuredResponse = await analyzeWithGemini(text);

    res.json({ extracted_sections: structuredResponse });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ error: "Failed to analyze PDF" });
  }
});

app.post("/api/gemini", async (req, res) => {
  const { message, document } = req.body;

  // Log received request for debugging
  console.log("Received request:", { message, document });

  if (!message || !document) {
    return res
      .status(400)
      .json({ error: "Message and document content are required." });
  }

  try {
    const prompt = `
      You are an AI designed to assist with document analysis.Your name is ASM. You help people only regarding things realted to research work. You will receive a message and a document for analysis. Here are the instructions:

      - **Message**: The message contains a specific request or question.
      - **Document**: The document contains content for analysis based on the message.

      Please analyze the document and respond in a clear, concise, and helpful manner. The output should be well-structured and easy to read.

      **Message**: ${message}
      **Document**: ${document}
    `;

    // Log the prompt being sent to the model for debugging
    console.log("Sending prompt to model:", prompt);

    // Assuming model.generateContent is calling the Gemini model
    const result = await model.generateContent(prompt);

    // Log the response from the model
    console.log("Model response:", result);

    // Check if `text` is a function, and invoke it if necessary
    const aiText =
      typeof result.response.text === "function"
        ? result.response.text()
        : result.response.text || "No response from Gemini model.";

    // Send back the AI response to the frontend
    res.json({
      text: aiText,
    });
  } catch (error) {
    console.error("Error generating content:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
});

server.listen(5000, () => {
  console.log("Express server running on http://localhost:5000");
});