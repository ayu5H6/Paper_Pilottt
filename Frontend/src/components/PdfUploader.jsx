import React, { useState, useRef } from "react";
import axios from "axios";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const PdfUploader = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  // Handle file upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const fileUrl = URL.createObjectURL(file);
      setPdfFile(file);
      setPdfUrl(fileUrl);
      setMessages([]); // Clear previous messages
      await sendPdfToBackend(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const sendPdfToBackend = async (file) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/analyze",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.extracted_sections) {
        // Convert AI response to readable JSON
        const aiContent = JSON.stringify(
          response.data.extracted_sections,
          null,
          2
        );

        // Create AI message format
        const geminiMessage = {
          type: "ai",
          content: `Here’s the structured breakdown from ASM:\n\n${aiContent}`,
        };

        setMessages((prevMessages) => [...prevMessages, geminiMessage]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: "system",
            content: "No valid sections extracted from the PDF.",
          },
        ]);
      }
    } catch (error) {
      console.error("Error processing PDF:", error);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "system",
          content: "Failed to analyze the PDF. Try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-gray-100 border-b">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="mb-2"
        />
        <h1 className="text-xl font-bold">PDF Viewer with AI Chat</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* PDF Viewer - Left side (50%) */}
        <div className="w-1/2 border-r">
          {pdfFile ? (
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-auto">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                  <Viewer fileUrl={pdfUrl} />
                </Worker>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-500">Please upload a PDF file</p>
            </div>
          )}
        </div>

        {/* Chat Interface - Right side (50%) */}
        <div className="w-1/2 flex flex-col">
          <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.type === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block px-4 py-2 rounded-lg ${
                    message.type === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-green-500 text-white rounded-bl-none"
                  }`}
                >
                  {/* Render HTML content using dangerouslySetInnerHTML */}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: message.content, // This contains the formatted HTML
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfUploader;
