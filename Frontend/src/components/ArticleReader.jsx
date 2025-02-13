import React, { useState } from "react";
import axios from "axios";
import ReactTooltip from "react-tooltip"; // This should work as default import.
 // Corrected import

const ArticleReader = () => {
  const [article, setArticle] = useState("");
  const [processedArticle, setProcessedArticle] = useState("");
  const [definitions, setDefinitions] = useState({});
  const [loading, setLoading] = useState(false);

  // Function to identify difficult words (you can customize this logic)
  const getDifficultWords = (text) => {
    const words = text.split(/\s+/);
    const difficultWords = words.filter((word) => word.length > 8); // Example: Words longer than 8 characters
    return [...new Set(difficultWords)]; // Remove duplicates
  };

  // Function to fetch definitions using a dictionary API
const fetchDefinitions = async (words) => {
  const definitionsMap = {};

  for (const word of words) {
    try {
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );

      // ✅ Check if the API response contains valid data
      if (
        !response.data ||
        !Array.isArray(response.data) ||
        response.data.length === 0
      ) {
        definitionsMap[word] = "Definition not found";
      } else {
        definitionsMap[word] =
          response.data[0]?.meanings[0]?.definitions[0]?.definition ||
          "Definition not found";
      }
    } catch (error) {
      console.error(`Error fetching definition for "${word}":`, error.message);
      definitionsMap[word] = "Definition not found";
    }

    // ✅ Add a delay to prevent rate limiting (500ms)
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return definitionsMap;
};




  // Function to process the article
  const processArticle = async () => {
    if (!article.trim()) {
      alert("Please enter an article.");
      return;
    }

    setLoading(true);
    try {
      const difficultWords = getDifficultWords(article);
      const definitionsMap = await fetchDefinitions(difficultWords);
      setDefinitions(definitionsMap);

      // Highlight difficult words in the article
      let processedText = article;
      difficultWords.forEach((word) => {
        processedText = processedText.replace(
          new RegExp(`\\b${word}\\b`, "g"),
          `<span data-tip="${definitionsMap[word]}" style="border-bottom: 2px dotted #007BFF; cursor: pointer;">${word}</span>`
        );
      });
      setProcessedArticle(processedText);
    } catch (error) {
      console.error("Error processing article:", error);
      alert("An error occurred while processing the article.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Article Reader with Word Definitions</h1>
      <textarea
        value={article}
        onChange={(e) => setArticle(e.target.value)}
        rows="10"
        cols="50"
        placeholder="Paste your article here..."
        style={{ width: "100%", padding: "10px", fontSize: "16px" }}
      />
      <br />
      <button
        onClick={processArticle}
        disabled={loading}
        style={{ marginTop: "10px", padding: "10px 20px", fontSize: "16px" }}
      >
        {loading ? "Processing..." : "Process Article"}
      </button>

      {processedArticle && (
        <div style={{ marginTop: "20px" }}>
          <h2>Processed Article:</h2>
          <div
            dangerouslySetInnerHTML={{ __html: processedArticle }}
            style={{ lineHeight: "1.6", fontSize: "18px" }}
          />
          <ReactTooltip effect="solid" place="top" />
        </div>
      )}
    </div>
  );
};

export default ArticleReader;
