import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const ArticleReader = () => {
  const [article, setArticle] = useState("");
  const [processedArticle, setProcessedArticle] = useState("");
  const [definitions, setDefinitions] = useState({});
  const [activeWord, setActiveWord] = useState(null);
  const tooltipRef = useRef(null);

  // Function to identify difficult words
  const getDifficultWords = (text) => {
    const words = text.split(/\s+/);
    const difficultWords = words.filter((word) => word.length > 8);
    return [...new Set(difficultWords)];
  };

  // Fetch definitions on word click
  const fetchDefinition = async (word) => {
    const cleanWord = word.replace(/[^\w\s]|_/g, "").toLowerCase();
    if (definitions[word]) {
      setActiveWord(word); // Already fetched
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
     // Escape special characters for the regular expression
     const escapedWord = word.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
     const wordRegex = new RegExp(`\\b${escapedWord}\\b`, "g");

     processedText = processedText.replace(
       wordRegex,
       `<span class="clickable-word text-blue-600 font-medium hover:text-blue-800 cursor-pointer transition-colors duration-200 underline underline-offset-2" data-word="${word}">${word}</span>`
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-3xl font-bold">
            Article Reader with Click-to-Define
          </h1>
          <p className="mt-2 text-blue-100">
            Paste your article below, and click on highlighted words to see
            their definitions.
          </p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <textarea
              value={article}
              onChange={(e) => setArticle(e.target.value)}
              rows="8"
              placeholder="Paste your article here..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-800"
            />
          </div>

          <button
            onClick={processArticle}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium flex items-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Process Article</span>
          </button>

          {processedArticle && (
            <div className="mt-10 relative" onClick={handleWordClick}>
              <div className="flex items-center space-x-2 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Processed Article
                </h2>
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  Click highlighted words for definitions
                </span>
              </div>

              <div
                dangerouslySetInnerHTML={{ __html: processedArticle }}
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              />

              {/* Tooltip */}
              {activeWord && (
                <div
                  ref={tooltipRef}
                  className="absolute z-10 bg-white p-4 rounded-lg shadow-xl border border-gray-200 max-w-md"
                  style={{
                    top: "50px",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-blue-800">
                      {activeWord}
                    </h3>
                    <button
                      onClick={() => setActiveWord(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="text-gray-700">
                    {definitions[activeWord] || (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin h-4 w-4 mr-2 text-blue-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Loading definition...
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>Click on blue highlighted words to see their definitions.</p>
      </div>
    </div>
  );
};

export default ArticleReader;