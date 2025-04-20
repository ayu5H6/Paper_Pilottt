"use client"
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BookOpen, Search, Info, ArrowRight, X } from "lucide-react";
//article-reader
const ArticleReader = () => {
  const [article, setArticle] = useState(""); // Store the article
  const [processedArticle, setProcessedArticle] = useState(""); // Store the processed article with clickable words
  const [definitions, setDefinitions] = useState({}); // Store definitions
  const [activeWord, setActiveWord] = useState(null); // Store active word for tooltip
  const tooltipRef = useRef(null); // Reference for the tooltip

  // Function to get difficult words (length > 8)
  const getDifficultWords = (text) => {
    const words = text.split(/\s+/);
    const difficultWords = words.filter((word) => word.length > 8);
    return [...new Set(difficultWords)];
  };

  
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-2 bg-sky-100 rounded-full mb-6">
            <BookOpen className="w-5 h-5 text-sky-700 mr-2" />
            <span className="text-sm font-medium text-sky-700">
              Smart Reading Assistant
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Understand Every Word You Read
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Paste any text and instantly get definitions for complex words with
            a simple click. Enhance your reading comprehension and expand your
            vocabulary effortlessly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={() => document.getElementById("article-input").focus()}
              className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition duration-200 font-medium flex items-center gap-2 w-full sm:w-auto"
            >
              <Search className="w-5 h-5" />
              Start Reading Now
            </button>

            <a
              href="#how-it-works"
              className="px-6 py-3 bg-white text-sky-700 border border-sky-200 rounded-lg hover:bg-sky-50 transition duration-200 font-medium flex items-center gap-2 w-full sm:w-auto"
            >
              <Info className="w-5 h-5" />
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4 max-w-5xl mx-auto">
        <div className="mb-12">
          <label
            htmlFor="article-input"
            className="block text-lg font-medium text-slate-700 mb-3"
          >
            Paste your article below
          </label>
          <textarea
            id="article-input"
            value={article}
            onChange={(e) => setArticle(e.target.value)}
            rows="8"
            placeholder="Paste your article here..."
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200 text-slate-800 shadow-sm"
          />

          <div className="mt-4 flex justify-end">
            <button
              onClick={processArticle}
              disabled={!article.trim()}
              className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition duration-200 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Process Article
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Processed Article */}
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

        {/* How It Works Section */}
        <div id="how-it-works" className="mt-24 mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-sky-700 font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Paste Your Text
              </h3>
              <p className="text-slate-600">
                Simply paste any article, essay, or text you're reading into the
                text area above.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-sky-700 font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Process Content
              </h3>
              <p className="text-slate-600">
                Click the "Process Article" button and our system will
                automatically identify complex words.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-sky-700 font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Click & Learn
              </h3>
              <p className="text-slate-600">
                Click on any highlighted word to instantly see its definition
                without leaving the page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>Made By Bhumi</p>
        </div>
      </footer>
    </div>
  );
};

export default ArticleReader;

