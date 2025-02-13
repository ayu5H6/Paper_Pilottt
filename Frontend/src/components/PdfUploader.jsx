import { useState } from "react";

const PDFUploader = () => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      setError("No file selected.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size exceeds 5MB limit. Please upload a smaller file.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setAnalysis(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text(); // Read error message
        throw new Error(`Server error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to process PDF. " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Upload a Research Paper (PDF) for Analysis</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />

      {file && (
        <p style={{ fontSize: "14px", color: "#007BFF" }}>
          Selected File: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </p>
      )}

      <div style={{ marginTop: "10px" }}>
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Paper"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {analysis && (
        <div style={{ marginTop: "20px", textAlign: "left" }}>
          <h3>Extracted Sections:</h3>
          {Object.entries(analysis.sections || {}).map(([key, value]) => (
            <div key={key}>
              <h4>{key}</h4>
              <p>{value.substring(0, 500)}...</p>
            </div>
          ))}

          <h3>Topics:</h3>
          <p>
            {analysis.topics
              ? analysis.topics.join(" | ")
              : "No topics extracted"}
          </p>
        </div>
      )}
    </div>
  );
};

export default PDFUploader;
