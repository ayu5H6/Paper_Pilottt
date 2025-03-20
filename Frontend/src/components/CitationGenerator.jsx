import React, { useState } from "react";

const CitationGenerator = () => {
  const [formData, setFormData] = useState({
    sourceType: "journal",
    title: "",
    authors: "",
    year: "",
    journal: "",
    volume: "",
    issue: "",
    pages: "",
    doi: "",
    url: "",
    accessDate: "",
    publisher: "",
    bookTitle: "",
    edition: "",
    city: "",
    websiteTitle: "",
  });

  const [citationStyle, setCitationStyle] = useState("apa");
  const [generatedCitation, setGeneratedCitation] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleStyleChange = (e) => {
    setCitationStyle(e.target.value);
  };

  const formatAuthors = (authors, style) => {
    if (!authors) return "";

    // Split by commas or 'and'
    const authorList = authors
      .split(/,|\sand\s/)
      .map((author) => author.trim())
      .filter((author) => author);

    if (authorList.length === 0) return "";

    if (style === "apa") {
      if (authorList.length === 1) {
        // Check if author has a comma (last, first format)
        if (authorList[0].includes(",")) {
          return authorList[0];
        }
        // Split name into parts
        const nameParts = authorList[0].split(" ");
        if (nameParts.length > 1) {
          const lastName = nameParts.pop();
          const firstNames = nameParts.join(" ");
          return `${lastName}, ${firstNames.charAt(0)}.`;
        }
        return authorList[0];
      } else if (authorList.length <= 7) {
        return authorList
          .map((author) => {
            // Handle if already in last, first format
            if (author.includes(",")) return author;

            const nameParts = author.split(" ");
            const lastName = nameParts.pop();
            const firstNames = nameParts
              .map((name) => `${name.charAt(0)}.`)
              .join(" ");
            return `${lastName}, ${firstNames}`;
          })
          .join(", ");
      } else {
        // First 6 authors, then et al.
        const firstSix = authorList
          .slice(0, 6)
          .map((author) => {
            if (author.includes(",")) return author;

            const nameParts = author.split(" ");
            const lastName = nameParts.pop();
            const firstNames = nameParts
              .map((name) => `${name.charAt(0)}.`)
              .join(" ");
            return `${lastName}, ${firstNames}`;
          })
          .join(", ");
        return `${firstSix}, et al.`;
      }
    } else if (style === "mla") {
      if (authorList.length === 1) {
        // Convert to last, first format if not already
        if (authorList[0].includes(",")) return authorList[0];

        const nameParts = authorList[0].split(" ");
        const lastName = nameParts.pop();
        const firstNames = nameParts.join(" ");
        return `${lastName}, ${firstNames}`;
      } else if (authorList.length === 2) {
        const author1 = authorList[0].includes(",")
          ? authorList[0]
          : convertToLastFirstFormat(authorList[0]);
        const author2 = authorList[1].includes(",")
          ? authorList[1]
          : convertToLastFirstFormat(authorList[1]);
        return `${author1}, and ${author2}`;
      } else {
        const firstAuthor = authorList[0].includes(",")
          ? authorList[0]
          : convertToLastFirstFormat(authorList[0]);
        return `${firstAuthor}, et al.`;
      }
    } else if (style === "chicago") {
      if (authorList.length === 1) {
        if (authorList[0].includes(",")) {
          // Convert from last, first to first last
          const parts = authorList[0].split(",").map((part) => part.trim());
          return `${parts[1]} ${parts[0]}`;
        }
        return authorList[0];
      } else if (authorList.length <= 3) {
        const formattedAuthors = authorList.map((author) => {
          if (author.includes(",")) {
            const parts = author.split(",").map((part) => part.trim());
            return `${parts[1]} ${parts[0]}`;
          }
          return author;
        });

        const lastAuthor = formattedAuthors.pop();
        return formattedAuthors.length
          ? `${formattedAuthors.join(", ")} and ${lastAuthor}`
          : lastAuthor;
      } else {
        const firstAuthor = authorList[0].includes(",")
          ? (() => {
              const parts = authorList[0].split(",").map((part) => part.trim());
              return `${parts[1]} ${parts[0]}`;
            })()
          : authorList[0];
        return `${firstAuthor} et al.`;
      }
    }

    return authors; // Default fallback
  };

  const convertToLastFirstFormat = (author) => {
    const nameParts = author.split(" ");
    if (nameParts.length <= 1) return author;

    const lastName = nameParts.pop();
    const firstNames = nameParts.join(" ");
    return `${lastName}, ${firstNames}`;
  };

  const generateCitation = () => {
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      let citation = "";

      const {
        sourceType,
        title,
        authors,
        year,
        journal,
        volume,
        issue,
        pages,
        doi,
        url,
        accessDate,
        publisher,
        bookTitle,
        edition,
        city,
        websiteTitle,
      } = formData;

      const formattedAuthors = formatAuthors(authors, citationStyle);

      if (citationStyle === "apa") {
        if (sourceType === "journal") {
          citation = `${formattedAuthors} (${year}). ${title}. `;

          if (journal) {
            citation += `${journal}`;
            if (volume) citation += `, ${volume}`;
            if (issue) citation += `(${issue})`;
            if (pages) citation += `, ${pages}`;
            citation += ".";
          }

          if (doi) citation += ` https://doi.org/${doi}`;
          else if (url) citation += ` Retrieved from ${url}`;
        } else if (sourceType === "book") {
          citation = `${formattedAuthors} (${year}). `;
          citation += `${title}`;
          if (edition && edition !== "1") citation += ` (${edition} ed.)`;
          citation += ". ";

          if (city && publisher) {
            citation += `${city}: ${publisher}.`;
          } else if (publisher) {
            citation += `${publisher}.`;
          }
        } else if (sourceType === "website") {
          citation = `${formattedAuthors} (${year}). ${title}. `;

          if (websiteTitle) citation += `${websiteTitle}. `;
          if (url) citation += `Retrieved from ${url}`;
          if (accessDate) citation += ` on ${accessDate}`;
        }
      } else if (citationStyle === "mla") {
        if (sourceType === "journal") {
          citation = `${formattedAuthors}. "${title}." `;

          if (journal) {
            citation += `${journal}`;
            if (volume) citation += `, vol. ${volume}`;
            if (issue) citation += `, no. ${issue}`;
            if (year) citation += `, ${year}`;
            if (pages) citation += `, pp. ${pages}`;
            citation += ".";
          }

          if (doi) citation += ` DOI: ${doi}.`;
          else if (url) citation += ` ${url}.`;
          if (accessDate) citation += ` Accessed ${accessDate}.`;
        } else if (sourceType === "book") {
          citation = `${formattedAuthors}. `;
          citation += `${title}. `;

          if (edition && edition !== "1") citation += `${edition} ed., `;
          if (publisher) citation += `${publisher}, `;
          if (year) citation += `${year}.`;
        } else if (sourceType === "website") {
          citation = `${formattedAuthors}. "${title}." `;

          if (websiteTitle) citation += `${websiteTitle}, `;
          if (year) citation += `${year}, `;
          if (url) citation += `${url}. `;
          if (accessDate) citation += `Accessed ${accessDate}.`;
        }
      } else if (citationStyle === "chicago") {
        if (sourceType === "journal") {
          citation = `${formattedAuthors}. "${title}." `;

          if (journal) {
            citation += `${journal}`;
            if (volume) citation += ` ${volume}`;
            if (issue) citation += `, no. ${issue}`;
            if (year) citation += ` (${year})`;
            if (pages) citation += `: ${pages}`;
            citation += ".";
          }

          if (doi) citation += ` https://doi.org/${doi}.`;
          else if (url) citation += ` ${url}.`;
        } else if (sourceType === "book") {
          citation = `${formattedAuthors}. `;
          citation += `${title}. `;

          if (city) citation += `${city}: `;
          if (publisher) citation += `${publisher}, `;
          if (year) citation += `${year}.`;
        } else if (sourceType === "website") {
          citation = `${formattedAuthors}. "${title}." `;

          if (websiteTitle) citation += `${websiteTitle}. `;
          if (publisher) citation += `${publisher}, `;
          if (year) citation += `${year}. `;
          if (url) citation += `${url}.`;
          if (accessDate) citation += ` Accessed ${accessDate}.`;
        }
      }

      setGeneratedCitation(citation);
      setLoading(false);
    }, 800); // Simulate processing time
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateCitation();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCitation).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Citation Generator
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source Type
            </label>
            <select
              name="sourceType"
              value={formData.sourceType}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="journal">Journal Article</option>
              <option value="book">Book</option>
              <option value="website">Website</option>
            </select>
          </div>

          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Citation Style
            </label>
            <select
              value={citationStyle}
              onChange={handleStyleChange}
              className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="apa">APA</option>
              <option value="mla">MLA</option>
              <option value="chicago">Chicago</option>
            </select>
          </div>
        </div>

        {/* Common fields for all source types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title of the work"
              className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Authors
            </label>
            <input
              type="text"
              name="authors"
              value={formData.authors}
              onChange={handleChange}
              placeholder="Author names (separated by commas)"
              className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="Publication year"
              className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* URL field for all types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Journal specific fields */}
        {formData.sourceType === "journal" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Journal Name
              </label>
              <input
                type="text"
                name="journal"
                value={formData.journal}
                onChange={handleChange}
                placeholder="Journal name"
                className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DOI
              </label>
              <input
                type="text"
                name="doi"
                value={formData.doi}
                onChange={handleChange}
                placeholder="Digital Object Identifier"
                className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Volume
              </label>
              <input
                type="text"
                name="volume"
                value={formData.volume}
                onChange={handleChange}
                placeholder="Volume number"
                className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue
              </label>
              <input
                type="text"
                name="issue"
                value={formData.issue}
                onChange={handleChange}
                placeholder="Issue number"
                className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pages
              </label>
              <input
                type="text"
                name="pages"
                value={formData.pages}
                onChange={handleChange}
                placeholder="Page range (e.g., 45-67)"
                className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Book specific fields */}
        {formData.sourceType === "book" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publisher
              </label>
              <input
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                placeholder="Publisher name"
                className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Edition
              </label>
              <input
                type="text"
                name="edition"
                value={formData.edition}
                onChange={handleChange}
                placeholder="Edition (e.g., 2nd)"
                className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Publication city"
                className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Website specific fields */}
        {formData.sourceType === "website" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website Title
              </label>
              <input
                type="text"
                name="websiteTitle"
                value={formData.websiteTitle}
                onChange={handleChange}
                placeholder="Website name"
                className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Access Date
              </label>
              <input
                type="text"
                name="accessDate"
                value={formData.accessDate}
                onChange={handleChange}
                placeholder="Date accessed (e.g., Mar. 15, 2025)"
                className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publisher/Organization
              </label>
              <input
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                placeholder="Publishing organization"
                className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Generate Citation
          </button>
        </div>
      </form>

      {/* Result section */}
      {(loading || generatedCitation) && (
        <div className="mt-8 p-4 border border-gray-200 rounded-md bg-gray-50">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Generated Citation
          </h3>

          {loading ? (
            <div className="flex justify-center items-center h-16">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="relative">
              <p className="text-gray-700 italic bg-white p-4 rounded border border-gray-200">
                {generatedCitation}
              </p>

              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 p-2 text-gray-500 hover:text-blue-600 focus:outline-none"
                title="Copy to clipboard"
              >
                {copied ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CitationGenerator;
