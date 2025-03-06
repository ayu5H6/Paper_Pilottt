// import React, { useState } from "react";
// import axios from "axios";
// import ReactTooltip from "react-tooltip"; // This should work as default import.
//  // Corrected import

// const ArticleReader = () => {
//   const [article, setArticle] = useState("");
//   const [processedArticle, setProcessedArticle] = useState("");
//   const [definitions, setDefinitions] = useState({});
//   const [loading, setLoading] = useState(false);

//   // Function to identify difficult words (you can customize this logic)
//   const getDifficultWords = (text) => {
//     const words = text.split(/\s+/);
//     const difficultWords = words.filter((word) => word.length > 8); // Example: Words longer than 8 characters
//     return [...new Set(difficultWords)]; // Remove duplicates
//   };

//   // Function to fetch definitions using a dictionary API
// const fetchDefinitions = async (words) => {
//   const definitionsMap = {};

//   for (const word of words) {
//     // ✅ Remove punctuation from the word
//     const cleanWord = word.replace(/[^\w\s]|_/g, "").toLowerCase();

//     try {
//       const response = await axios.get(
//         `https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`
//       );

//       if (
//         !response.data ||
//         !Array.isArray(response.data) ||
//         response.data.length === 0
//       ) {
//         definitionsMap[word] = "Definition not found";
//       } else {
//         definitionsMap[word] =
//           response.data[0]?.meanings[0]?.definitions[0]?.definition ||
//           "Definition not found";
//       }
//     } catch (error) {
//       console.error(`Error fetching definition for "${word}":`, error.message);
//       definitionsMap[word] = "Definition not found";
//     }

//     // ✅ Add delay to prevent rate limiting
//     await new Promise((resolve) => setTimeout(resolve, 500));
//   }

//   return definitionsMap;
// };





//   // Function to process the article
//   const processArticle = async () => {
//     if (!article.trim()) {
//       alert("Please enter an article.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const difficultWords = getDifficultWords(article);
//       const definitionsMap = await fetchDefinitions(difficultWords);
//       setDefinitions(definitionsMap);

//       // Highlight difficult words in the article
//       let processedText = article;
//       difficultWords.forEach((word) => {
//         processedText = processedText.replace(
//           new RegExp(`\\b${word}\\b`, "g"),
//           `<span data-tip="${definitionsMap[word]}" style="border-bottom: 2px dotted #007BFF; cursor: pointer;">${word}</span>`
//         );
//       });
//       setProcessedArticle(processedText);
//     } catch (error) {
//       console.error("Error processing article:", error);
//       alert("An error occurred while processing the article.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
//       <h1>Article Reader with Word Definitions</h1>
//       <textarea
//         value={article}
//         onChange={(e) => setArticle(e.target.value)}
//         rows="10"
//         cols="50"
//         placeholder="Paste your article here..."
//         style={{ width: "100%", padding: "10px", fontSize: "16px" }}
//       />
//       <br />
//       <button
//         onClick={processArticle}
//         disabled={loading}
//         style={{ marginTop: "10px", padding: "10px 20px", fontSize: "16px" }}
//       >
//         {loading ? "Processing..." : "Process Article"}
//       </button>

//       {processedArticle && (
//         <div style={{ marginTop: "20px" }}>
//           <h2>Processed Article:</h2>
//           <div
//             dangerouslySetInnerHTML={{ __html: processedArticle }}
//             style={{ lineHeight: "1.6", fontSize: "18px" }}
//           />
//           <ReactTooltip effect="solid" place="top" />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ArticleReader;


import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
<<<<<<< HEAD
import ReactTooltip from "react-tooltip"; 
=======
>>>>>>> main

const ArticleReader = () => {
  const [article, setArticle] = useState("");
  const [processedArticle, setProcessedArticle] = useState("");
  const [definitions, setDefinitions] = useState({});
  const [activeWord, setActiveWord] = useState(null); // Track active word
  const tooltipRef = useRef(null);

  // Function to identify difficult words
  const getDifficultWords = (text) => {
    const words = text.split(/\s+/);
    const difficultWords = words.filter((word) => word.length > 8);
    return [...new Set(difficultWords)];
  };

<<<<<<< HEAD
  // Function to fetch definitions using a dictionary API
const fetchDefinitions = async (words) => {
  const definitionsMap = {};

  for (const word of words) {
    try {
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );

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

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return definitionsMap;
};


  const processArticle = async () => {
    if (!article.trim()) {
      alert("Please enter an article.");
=======
  // Fetch definitions on word click
  const fetchDefinition = async (word) => {
    const cleanWord = word.replace(/[^\w\s]|_/g, "").toLowerCase();
    if (definitions[word]) {
      setActiveWord(word); // Already fetched
>>>>>>> main
      return;
    }

    try {
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`
      );

      const definition =
        response.data[0]?.meanings[0]?.definitions[0]?.definition ||
        "Definition not found";

      setDefinitions((prev) => ({ ...prev, [word]: definition }));
      setActiveWord(word);
    } catch (error) {
      console.error(`Error fetching definition for "${word}":`, error.message);
      setDefinitions((prev) => ({ ...prev, [word]: "Definition not found" }));
      setActiveWord(word);
    }
  };

  // Handle outside click to close tooltip
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setActiveWord(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Process article and wrap difficult words
  const processArticle = () => {
    const difficultWords = getDifficultWords(article);
    let processedText = article;

    difficultWords.forEach((word) => {
      const wordRegex = new RegExp(`\\b${word}\\b`, "g");
      processedText = processedText.replace(
        wordRegex,
        `<span class="clickable-word" data-word="${word}" style="color: blue; cursor: pointer;">${word}</span>`
      );
    });

    setProcessedArticle(processedText);
  };

  // Handle word click
  const handleWordClick = (e) => {
    if (e.target.classList.contains("clickable-word")) {
      const word = e.target.getAttribute("data-word");
      fetchDefinition(word);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Article Reader with Click-to-Define</h1>
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
        style={{ marginTop: "10px", padding: "10px 20px", fontSize: "16px" }}
      >
        Process Article
      </button>

      {processedArticle && (
        <div
          style={{ marginTop: "20px", position: "relative" }}
          onClick={handleWordClick}
        >
          <h2>Processed Article:</h2>
          <div
            dangerouslySetInnerHTML={{ __html: processedArticle }}
            style={{ lineHeight: "1.6", fontSize: "18px" }}
          />

          {/* Tooltip */}
          {activeWord && (
            <div
              ref={tooltipRef}
              style={{
                position: "absolute",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "4px",
                top: "50px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
              }}
            >
              <strong>{activeWord}:</strong>{" "}
              {definitions[activeWord] || "Loading..."}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArticleReader;
