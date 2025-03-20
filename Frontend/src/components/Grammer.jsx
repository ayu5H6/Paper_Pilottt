import React, { useState, useEffect } from "react";

const GrammarChecker = () => {
  const [text, setText] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [highlightedText, setHighlightedText] = useState("");

  // Function to highlight errors in the text
  const highlightErrors = (text, matches) => {
    if (!matches.length) return text;

    let result = text;
    // Sort matches by offset in descending order to avoid position shifts
    const sortedMatches = [...matches].sort((a, b) => b.offset - a.offset);

    // Replace each error with a highlighted version
    sortedMatches.forEach((match) => {
      const start = match.offset;
      const length = match.length;
      const errorText = text.substring(start, start + length);

      const before = result.substring(0, start);
      const after = result.substring(start + length);

      result =
        before +
        `<span class="bg-yellow-200 text-red-800 px-1 rounded">${errorText}</span>` +
        after;
    });

    return result;
  };

  // Update highlighted text whenever results change
  useEffect(() => {
    if (results.length > 0) {
      setHighlightedText(highlightErrors(text, results));
    } else {
      setHighlightedText("");
    }
  }, [results, text]);

  const checkGrammar = async () => {
    if (!text.trim()) {
      alert("Please enter some text.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://api.languagetool.org/v2/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `text=${encodeURIComponent(text)}&language=en-US`,
      });
      const data = await response.json();
      setResults(data.matches || []);
    } catch (error) {
      console.error("Error checking grammar:", error);
      alert("An error occurred while checking grammar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Grammar and Spell Checker
      </h1>

      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          // Clear results when text changes
          if (results.length > 0) {
            setResults([]);
            setHighlightedText("");
          }
        }}
        rows="10"
        placeholder="Enter your text here..."
        className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4 text-gray-700"
      />

      <button
        onClick={checkGrammar}
        disabled={loading}
        className={`px-6 py-3 rounded-md font-medium text-white shadow-sm ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        } transition-colors duration-200`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 mr-2"
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
            Checking...
          </span>
        ) : (
          "Check Grammar"
        )}
      </button>

      {highlightedText && (
        <div className="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Highlighted Text:
          </h2>
          <div
            className="bg-white p-4 rounded-md shadow-sm text-gray-700 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: highlightedText }}
          />
        </div>
      )}

      {results.length > 0 ? (
        <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Errors and Suggestions:
          </h2>
          <ul className="space-y-4">
            {results.map((match, index) => (
              <li
                key={index}
                className="bg-white p-4 rounded-md shadow-sm border-l-4 border-yellow-500"
              >
                <p className="font-medium text-red-600 mb-1">
                  Error: {match.message}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-medium text-gray-800">
                    Suggested Fix:
                  </span>{" "}
                  {match.replacements.map((rep) => rep.value).join(", ")}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Context:</span> "
                  {match.context.text}"
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        // Display message if there are no errors
        text.trim() && (
          <div className="mt-8 bg-green-50 p-6 rounded-lg border border-green-200">
            <h2 className="text-xl font-semibold text-green-700 mb-4">
              You're doing great! No errors found.
            </h2>
          </div>
        )
      )}
    </div>
  );
};

export default GrammarChecker;
