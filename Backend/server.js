// const express = require("express");
// const cors = require("cors");
// const axios = require("axios");
// const fs = require("fs");
// const FormData = require("form-data");

// const app = express();
// app.use(cors());
// app.use(express.json());

// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });

// app.post("/summarize", async (req, res) => {
//   try {
//     const { text } = req.body;
//     if (!text) {
//       return res.status(400).json({ error: "No text provided" });
//     }

//     // ✅ Fixed typo in API URL
//     const response = await axios.post("http://127.0.0.1:8000/summarize", {
//       text,
//     });

//     res.json(response.data);
//   } catch (error) {
//     console.error("Express Error:", error.response?.data || error.message);
//     res
//       .status(500)
//       .json({ error: error.response?.data || "Summarization failed" });
//   }
// });


// app.post("/analyze", upload.single("pdf"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const formData = new FormData();
//     formData.append("pdf", fs.createReadStream(req.file.path));

//     const response = await axios.post(
//       "http://127.0.0.1:8000/analyze",
//       formData,
//       {
//         headers: {
//           ...formData.getHeaders(), // ✅ Correctly set headers
//         },
//       }
//     );

//     res.json(response.data);
//   } catch (error) {
//     console.error("Express Error:", error.response?.data || error.message);
//     res.status(500).json({ error: error.response?.data || "Analysis failed" });
//   }
// });

// app.listen(5000, () => {
//   console.log("Express server running on http://localhost:5000");
// });



// WITH FIREBASE:
// const express = require("express");
// const cors = require("cors");
// const http = require("http");
// const socketIo = require("socket.io");
// require("dotenv").config();

// const apiRoutes = require("./routes/apiRoutes");
// const { initializeSocket } = require("./controllers/socketController");
// const { initializeFirebase } = require("./utils/firebase");

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, { cors: { origin: "*" } });

// app.use(cors());
// app.use(express.json());

// // Initialize Firebase
// initializeFirebase();

// // Use API routes
// app.use("/api", apiRoutes);

// // Initialize Socket.io
// initializeSocket(io);

// server.listen(5000, () => {
//   console.log("Express server running on http://localhost:5000");
// });


//NO FIREBASE
// const express = require("express");
// const cors = require("cors");
// const http = require("http");
// const socketIo = require("socket.io");
// require("dotenv").config();

// const apiRoutes = require("./routes/apiRoutes");
// const { initializeSocket } = require("./controllers/socketController");

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, { cors: { origin: "*" } });

// app.use(cors());
// app.use(express.json());

// // Use API routes
// app.use("/api", apiRoutes);

// // Initialize Socket.io
// initializeSocket(io);

// server.listen(5000, () => {
//   console.log("Express server running on http://localhost:5000");
// });









const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

const apiRoutes = require("./routes/apiRoutes");
const { initializeSocket } = require("./controllers/socketController");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// Use API routes
app.use("/api", apiRoutes);

// Initialize Socket.io with io instance
initializeSocket(io);

server.listen(5000, () => {
  console.log("Express server running on http://localhost:5000");
});
