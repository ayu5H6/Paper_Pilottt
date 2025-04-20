"use client"

import React, { useState, useEffect } from "react"
import { BookOpen, Info, Search, ArrowRight, Check, AlertCircle, RefreshCw } from "lucide-react"
//yellow
const GrammarChecker = () => {
  const [text, setText] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [highlightedText, setHighlightedText] = useState("")

  // Function to highlight errors in the text
  const highlightErrors = (text, matches) => {
    if (!matches.length) return text

    let result = text
    // Sort matches by offset in descending order to avoid position shifts
    const sortedMatches = [...matches].sort((a, b) => b.offset - a.offset)

    // Replace each error with a highlighted version
    sortedMatches.forEach((match) => {
      const start = match.offset
      const length = match.length
      const errorText = text.substring(start, start + length)

      const before = result.substring(0, start)
      const after = result.substring(start + length)

      result =
        before +
        `<span class="bg-amber-100 text-red-700 px-1 rounded cursor-pointer hover:bg-amber-200 transition-colors" data-error-index="${match.offset}">${errorText}</span>` +
        after
    })

    return result
  }

  // Update highlighted text whenever results change
  useEffect(() => {
    if (results.length > 0) {
      setHighlightedText(highlightErrors(text, results))
    } else {
      setHighlightedText("")
    }
  }, [results, text])

  const checkGrammar = async () => {
    if (!text.trim()) {
      alert("Please enter some text.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("https://api.languagetool.org/v2/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `text=${encodeURIComponent(text)}&language=en-US`,
      })
      const data = await response.json()
      setResults(data.matches || [])
    } catch (error) {
      console.error("Error checking grammar:", error)
      alert("An error occurred while checking grammar.")
    } finally {
      setLoading(false)
    }
  }

  const scrollToError = (errorIndex) => {
    const errorElement = document.querySelector(`[data-error-index="${errorIndex}"]`)
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-2 bg-yellow-100 rounded-full mb-6">
            <BookOpen className="w-5 h-5 text-yellow-700 mr-2" />
            <span className="text-sm font-medium text-yellow-700">Writing Assistant</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Perfect Your Writing
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Catch grammar mistakes, spelling errors, and style issues with our powerful grammar checking tool. 
            Write with confidence and clarity every time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={() => document.getElementById("grammar-input").focus()}
              className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition duration-200 font-medium flex items-center gap-2 w-full sm:w-auto"
            >
              <Search className="w-5 h-5" />
              Start Writing Now
            </button>

            <a
              href="#how-it-works"
              className="px-6 py-3 bg-white text-yellow-700 border border-yellow-200 rounded-lg hover:bg-yellow-50 transition duration-200 font-medium flex items-center gap-2 w-full sm:w-auto"
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
          <label htmlFor="grammar-input" className="block text-lg font-medium text-slate-700 mb-3">
            Enter your text below
          </label>
          <textarea
            id="grammar-input"
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              // Clear results when text changes
              if (results.length > 0) {
                setResults([])
                setHighlightedText("")
              }
            }}
            rows="10"
            placeholder="Write or paste your text here for grammar and spelling check..."
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200 text-slate-800 shadow-sm"
          />

          <div className="mt-4 flex justify-end">
            <button
              onClick={checkGrammar}
              disabled={loading || !text.trim()}
              className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition duration-200 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  Check Grammar
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {highlightedText && (
          <div className="mt-10 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 pb-4 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">Your Text</h2>
              <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full inline-flex items-center">
                <Info className="w-4 h-4 mr-1" />
                Click highlighted errors for details
              </span>
            </div>

            <div
              className="bg-white rounded-md text-slate-700 whitespace-pre-wrap prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
          </div>
        )}

        {results.length > 0 ? (
          <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Found {results.length} {results.length === 1 ? "Issue" : "Issues"}:
            </h2>
            <ul className="space-y-4">
              {results.map((match, index) => (
                <li
                  key={index}
                  className="bg-slate-50 p-4 rounded-lg border-l-4 border-amber-500 hover:bg-slate-100 transition-colors cursor-pointer"
                  onClick={() => scrollToError(match.offset)}
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 rounded-full p-2 mt-1">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-red-600 mb-2">
                        {match.message}
                      </p>
                      <div className="mb-3 p-2 bg-white rounded border border-slate-200">
                        <p className="text-slate-800 font-medium mb-1">Context:</p>
                        <p className="text-slate-600">"{match.context.text}"</p>
                      </div>
                      {match.replacements.length > 0 && (
                        <div>
                          <p className="text-slate-800 font-medium mb-2">Suggested Fixes:</p>
                          <div className="flex flex-wrap gap-2">
                            {match.replacements.slice(0, 3).map((replacement, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
                              >
                                {replacement.value}
                              </span>
                            ))}
                            {match.replacements.length > 3 && (
                              <span className="text-sm text-slate-500">
                                +{match.replacements.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          text.trim() && !loading && highlightedText && (
            <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 rounded-full p-2">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-green-700">
                    No grammar issues found!
                  </h2>
                  <p className="text-slate-600">Your text looks great and is ready to go.</p>
                </div>
              </div>
            </div>
          )
        )}

        {/* How It Works Section */}
        <div id="how-it-works" className="mt-24 mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-yellow-700 font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Write or Paste</h3>
              <p className="text-slate-600">
                Enter your text in the editor above or paste content you want to check.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-yellow-700 font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Check Grammar</h3>
              <p className="text-slate-600">
                Click the "Check Grammar" button and our system will analyze your text for errors.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-yellow-700 font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Review & Fix</h3>
              <p className="text-slate-600">
                Review suggested fixes and click on highlighted errors to see details and recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 mb-24">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Improve Your Writing Quality
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                <span className="bg-yellow-100 p-2 rounded-full mr-3">
                  <Check className="w-5 h-5 text-yellow-700" />
                </span>
                Grammar Corrections
              </h3>
              <p className="text-slate-600">
                Identify and fix grammar mistakes including subject-verb agreement, punctuation errors,
                and sentence structure problems.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                <span className="bg-yellow-100 p-2 rounded-full mr-3">
                  <Check className="w-5 h-5 text-yellow-700" />
                </span>
                Spelling Suggestions
              </h3>
              <p className="text-slate-600">
                Catch and correct misspelled words with accurate spelling suggestions based on context.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                <span className="bg-yellow-100 p-2 rounded-full mr-3">
                  <Check className="w-5 h-5 text-yellow-700" />
                </span>
                Style Improvements
              </h3>
              <p className="text-slate-600">
                Get suggestions for improving clarity, conciseness, and readability in your writing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                <span className="bg-yellow-100 p-2 rounded-full mr-3">
                  <Check className="w-5 h-5 text-yellow-700" />
                </span>
                Vocabulary Enhancement
              </h3>
              <p className="text-slate-600">
                Discover better word choices and alternatives to overused words to make your writing more dynamic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>Powered by LanguageTool API. Designed to help you write better and with confidence.</p>
        </div>
      </footer>
    </div>
  )
}

export default GrammarChecker