"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, FileText, Globe, Copy, Check, ChevronDown, BookMarked, AlertCircle, Sparkles } from "lucide-react"
//img
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
  })

  const [citationStyle, setCitationStyle] = useState("apa")
  const [generatedCitation, setGeneratedCitation] = useState("")
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("form")
  const resultRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleStyleChange = (e) => {
    setCitationStyle(e.target.value)
  }

  const formatAuthors = (authors, style) => {
    if (!authors) return ""

    // Split by commas or 'and'
    const authorList = authors
      .split(/,|\sand\s/)
      .map((author) => author.trim())
      .filter((author) => author)

    if (authorList.length === 0) return ""

    if (style === "apa") {
      if (authorList.length === 1) {
        // Check if author has a comma (last, first format)
        if (authorList[0].includes(",")) {
          return authorList[0]
        }
        // Split name into parts
        const nameParts = authorList[0].split(" ")
        if (nameParts.length > 1) {
          const lastName = nameParts.pop()
          const firstNames = nameParts.join(" ")
          return `${lastName}, ${firstNames.charAt(0)}.`
        }
        return authorList[0]
      } else if (authorList.length <= 7) {
        return authorList
          .map((author) => {
            // Handle if already in last, first format
            if (author.includes(",")) return author

            const nameParts = author.split(" ")
            const lastName = nameParts.pop()
            const firstNames = nameParts.map((name) => `${name.charAt(0)}.`).join(" ")
            return `${lastName}, ${firstNames}`
          })
          .join(", ")
      } else {
        // First 6 authors, then et al.
        const firstSix = authorList
          .slice(0, 6)
          .map((author) => {
            if (author.includes(",")) return author

            const nameParts = author.split(" ")
            const lastName = nameParts.pop()
            const firstNames = nameParts.map((name) => `${name.charAt(0)}.`).join(" ")
            return `${lastName}, ${firstNames}`
          })
          .join(", ")
        return `${firstSix}, et al.`
      }
    } else if (style === "mla") {
      if (authorList.length === 1) {
        // Convert to last, first format if not already
        if (authorList[0].includes(",")) return authorList[0]

        const nameParts = authorList[0].split(" ")
        const lastName = nameParts.pop()
        const firstNames = nameParts.join(" ")
        return `${lastName}, ${firstNames}`
      } else if (authorList.length === 2) {
        const author1 = authorList[0].includes(",") ? authorList[0] : convertToLastFirstFormat(authorList[0])
        const author2 = authorList[1].includes(",") ? authorList[1] : convertToLastFirstFormat(authorList[1])
        return `${author1}, and ${author2}`
      } else {
        const firstAuthor = authorList[0].includes(",") ? authorList[0] : convertToLastFirstFormat(authorList[0])
        return `${firstAuthor}, et al.`
      }
    } else if (style === "chicago") {
      if (authorList.length === 1) {
        if (authorList[0].includes(",")) {
          // Convert from last, first to first last
          const parts = authorList[0].split(",").map((part) => part.trim())
          return `${parts[1]} ${parts[0]}`
        }
        return authorList[0]
      } else if (authorList.length <= 3) {
        const formattedAuthors = authorList.map((author) => {
          if (author.includes(",")) {
            const parts = author.split(",").map((part) => part.trim())
            return `${parts[1]} ${parts[0]}`
          }
          return author
        })

        const lastAuthor = formattedAuthors.pop()
        return formattedAuthors.length ? `${formattedAuthors.join(", ")} and ${lastAuthor}` : lastAuthor
      } else {
        const firstAuthor = authorList[0].includes(",")
          ? (() => {
              const parts = authorList[0].split(",").map((part) => part.trim())
              return `${parts[1]} ${parts[0]}`
            })()
          : authorList[0]
        return `${firstAuthor} et al.`
      }
    }

    return authors // Default fallback
  }

  const convertToLastFirstFormat = (author) => {
    const nameParts = author.split(" ")
    if (nameParts.length <= 1) return author

    const lastName = nameParts.pop()
    const firstNames = nameParts.join(" ")
    return `${lastName}, ${firstNames}`
  }

  const generateCitation = () => {
    setLoading(true)

    // Simulate API delay
    setTimeout(() => {
      let citation = ""

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
      } = formData

      const formattedAuthors = formatAuthors(authors, citationStyle)

      if (citationStyle === "apa") {
        if (sourceType === "journal") {
          citation = `${formattedAuthors} (${year}). ${title}. `

          if (journal) {
            citation += `${journal}`
            if (volume) citation += `, ${volume}`
            if (issue) citation += `(${issue})`
            if (pages) citation += `, ${pages}`
            citation += "."
          }
          //sky

          if (doi) citation += ` https://doi.org/${doi}`
          else if (url) citation += ` Retrieved from ${url}`
        } else if (sourceType === "book") {
          citation = `${formattedAuthors} (${year}). `
          citation += `${title}`
          if (edition && edition !== "1") citation += ` (${edition} ed.)`
          citation += ". "

          if (city && publisher) {
            citation += `${city}: ${publisher}.`
          } else if (publisher) {
            citation += `${publisher}.`
          }
        } else if (sourceType === "website") {
          citation = `${formattedAuthors} (${year}). ${title}. `

          if (websiteTitle) citation += `${websiteTitle}. `
          if (url) citation += `Retrieved from ${url}`
          if (accessDate) citation += ` on ${accessDate}`
        }
      } else if (citationStyle === "mla") {
        if (sourceType === "journal") {
          citation = `${formattedAuthors}. "${title}." `

          if (journal) {
            citation += `${journal}`
            if (volume) citation += `, vol. ${volume}`
            if (issue) citation += `, no. ${issue}`
            if (year) citation += `, ${year}`
            if (pages) citation += `, pp. ${pages}`
            citation += "."
          }

          if (doi) citation += ` DOI: ${doi}.`
          else if (url) citation += ` ${url}.`
          if (accessDate) citation += ` Accessed ${accessDate}.`
        } else if (sourceType === "book") {
          citation = `${formattedAuthors}. `
          citation += `${title}. `

          if (edition && edition !== "1") citation += `${edition} ed., `
          if (publisher) citation += `${publisher}, `
          if (year) citation += `${year}.`
        } else if (sourceType === "website") {
          citation = `${formattedAuthors}. "${title}." `

          if (websiteTitle) citation += `${websiteTitle}, `
          if (year) citation += `${year}, `
          if (url) citation += `${url}. `
          if (accessDate) citation += `Accessed ${accessDate}.`
        }
      } else if (citationStyle === "chicago") {
        if (sourceType === "journal") {
          citation = `${formattedAuthors}. "${title}." `

          if (journal) {
            citation += `${journal}`
            if (volume) citation += ` ${volume}`
            if (issue) citation += `, no. ${issue}`
            if (year) citation += ` (${year})`
            if (pages) citation += `: ${pages}`
            citation += "."
          }

          if (doi) citation += ` https://doi.org/${doi}.`
          else if (url) citation += ` ${url}.`
        } else if (sourceType === "book") {
          citation = `${formattedAuthors}. `
          citation += `${title}. `

          if (city) citation += `${city}: `
          if (publisher) citation += `${publisher}, `
          if (year) citation += `${year}.`
        } else if (sourceType === "website") {
          citation = `${formattedAuthors}. "${title}." `

          if (websiteTitle) citation += `${websiteTitle}. `
          if (publisher) citation += `${publisher}, `
          if (year) citation += `${year}. `
          if (url) citation += `${url}.`
          if (accessDate) citation += ` Accessed ${accessDate}.`
        }
      }

      setGeneratedCitation(citation)
      setLoading(false)
      setActiveTab("result")

      // Scroll to result
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    }, 800) // Simulate processing time
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    generateCitation()
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCitation).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const getSourceIcon = () => {
    switch (formData.sourceType) {
      case "journal":
        return <FileText className="h-5 w-5" />
      case "book":
        return <BookOpen className="h-5 w-5" />
      case "website":
        return <Globe className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    //book
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
  {/* Hero Section with Image Background */}
  <section className="relative overflow-hidden text-white py-16 md:py-24">
    {/* Background Image Layer */}
    <div 
  className="absolute inset-0 bg-cover bg-center"
  style={{backgroundImage: "linear-gradient(to right, #0f172a, #1e3a8a), url('https://www.transparenttextures.com/patterns/black-linen.png')",
    backgroundBlendMode: "overlay"}}
></div>

    
    <div className="container mx-auto px-4 relative z-10">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl mx-auto text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="inline-flex items-center justify-center p-2 bg-black-800/70 backdrop-blur-sm rounded-full mb-6 border border-black-700/50 shadow-lg shadow-black-900/20"
      >
        <BookMarked className="w-5 h-5 text-black-200 mr-2" />
        <span className="text-sm font-medium text-black-200">Academic Writing Assistant</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white glossy-text"

      >
        Perfect Citations,{" "}
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="relative inline-block"
        >
          <span className="relative z-10 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 text-transparent bg-clip-text">
            Every Time
          </span>
          <span className="absolute -inset-1 blur-xl bg-pink-400/20 z-0"></span>
        </motion.span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto mb-8 leading-relaxed text-shadow-sm"
      >
        Generate accurate citations in APA, MLA, and Chicago styles for any source type.
        <span className="block mt-2 text-indigo-200">
          Save time and ensure your academic work meets the highest standards.
        </span>
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="inline-flex"
      >
        <motion.a
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(167, 139, 250, 0.5)" }}
          whileTap={{ scale: 0.98 }}
          href="#citation-form"
          className="px-8 py-3 bg-gradient-to-r from-sky-600 to-blue-800 hover:from-white-700 hover:to-white-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg shadow-purple-900/30 border border-purple-500/20"
        >
          <Sparkles className="w-5 h-5" />
          Create Citation Now
        </motion.a>
      </motion.div>
    </motion.div>
  </div>

  {/* Animated Particles */}
  <div className="absolute inset-0 pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        initial={{
          opacity: 0.2 + Math.random() * 0.5,
          x: Math.random() * 100 - 50 + "%",
          y: Math.random() * 100 + "%",
          scale: 0.1 + Math.random() * 0.3,
        }}
        animate={{
          y: [null, "-100%"],
          opacity: [null, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 10 + Math.random() * 20,
          ease: "linear",
          delay: Math.random() * 10,
        }}
        className="absolute w-2 h-2 rounded-full bg-indigo-300/30 blur-sm"
      />
    ))}
  </div>
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-sky-900">
            Why Use Our Citation Generator?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-sky-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold text-sky-900 mb-3">Multiple Citation Styles</h3>
              <p className="text-slate-600">
                Support for APA, MLA, and Chicago citation styles with proper formatting for each.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-sky-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold text-sky-900 mb-3">All Source Types</h3>
              <p className="text-slate-600">
                Generate citations for journals, books, websites, and more with all the required fields.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-sky-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                <Copy className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold text-sky-900 mb-3">Easy to Use</h3>
              <p className="text-slate-600">
                Simple interface with one-click copying to paste directly into your document.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Citation Generator */}
      <section id="citation-form" className="py-12 px-4 mb-16">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("form")}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === "form"
                    ? "text-sky-700 border-b-2 border-sky-500"
                    : "text-slate-500 hover:text-sky-600"
                }`}
              >
                Citation Form
              </button>
              <button
                onClick={() => setActiveTab("result")}
                disabled={!generatedCitation && !loading}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === "result"
                    ? "text-sky-700 border-b-2 border-sky-500"
                    : "text-slate-500 hover:text-sky-600 disabled:text-slate-300 disabled:hover:text-slate-300"
                }`}
              >
                Generated Citation
              </button>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === "form" ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/2">
                          <label className="block text-sm font-medium text-slate-700 mb-1">Source Type</label>
                          <div className="relative">
                            <select
                              name="sourceType"
                              value={formData.sourceType}
                              onChange={handleChange}
                              className="w-full rounded-md border border-slate-300 shadow-sm py-2 pl-10 pr-3 appearance-none focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                            >
                              <option value="journal">Journal Article</option>
                              <option value="book">Book</option>
                              <option value="website">Website</option>
                            </select>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                              {getSourceIcon()}
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </div>
                        </div>

                        <div className="w-full md:w-1/2">
                          <label className="block text-sm font-medium text-slate-700 mb-1">Citation Style</label>
                          <div className="relative">
                            <select
                              value={citationStyle}
                              onChange={handleStyleChange}
                              className="w-full rounded-md border border-slate-300 shadow-sm py-2 pl-10 pr-3 appearance-none focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                            >
                              <option value="apa">APA (7th Edition)</option>
                              <option value="mla">MLA (9th Edition)</option>
                              <option value="chicago">Chicago (17th Edition)</option>
                            </select>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Common fields for all source types */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Title <span className="text-sky-600">*</span>
                          </label>
                          <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Title of the work"
                            className="w-full rounded-md border border-slate-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Authors <span className="text-sky-600">*</span>
                          </label>
                          <input
                            type="text"
                            name="authors"
                            value={formData.authors}
                            onChange={handleChange}
                            placeholder="Author names (separated by commas)"
                            className="w-full rounded-md border border-slate-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Year <span className="text-sky-600">*</span>
                          </label>
                          <input
                            type="text"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            placeholder="Publication year"
                            className="w-full rounded-md border border-slate-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                            required
                          />
                        </div>

                        {/* URL field for all types */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">URL</label>
                          <input
                            type="text"
                            name="url"
                            value={formData.url}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="w-full rounded-md border border-slate-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                          />
                        </div>
                      </div>

                      {/* Journal specific fields */}
                      <AnimatePresence>
                        {formData.sourceType === "journal" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                  Journal Name <span className="text-sky-600">*</span>
                                </label>
                                <input
                                  type="text"
                                  name="journal"
                                  value={formData.journal}
                                  onChange={handleChange}
                                  placeholder="Journal name"
                                  className="w-full rounded-md border border-slate-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">DOI</label>
                                <input
                                  type="text"
                                  name="doi"
                                  value={formData.doi}
                                  onChange={handleChange}
                                  placeholder="Digital Object Identifier"
                                  className="w-full rounded-md border border-slate-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Volume</label>
                                <input
                                  type="text"
                                  name="volume"
                                  value={formData.volume}
                                  onChange={handleChange}
                                  placeholder="Volume number"
                                  className="w-full rounded-md border border-slate-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Issue</label>
                                <input
                                  type="text"
                                  name="issue"
                                  value={formData.issue}
                                  onChange={handleChange}
                                  placeholder="Issue number"
                                  className="w-full rounded-md border border-slate-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Pages</label>
                                <input
                                  type="text"
                                  name="pages"
                                  value={formData.pages}
                                  onChange={handleChange}
                                  placeholder="Page range (e.g., 45-67)"
                                  className="w-full rounded-md border border-slate-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Book specific fields */}
                        {formData.sourceType === "book" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                  Publisher <span className="text-sky-600">*</span>
                                </label>
                                <input
                                  type="text"
                                  name="publisher"
                                  value={formData.publisher}
                                  onChange={handleChange}
                                  placeholder="Publisher name"
                                  className="w-full rounded-md border border-slate-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Edition</label>
                                <input
                                  type="text"
                                  name="edition"
                                  value={formData.edition}
                                  onChange={handleChange}
                                  placeholder="Edition (e.g., 2nd)"
                                  className="w-full rounded-md border border-slate-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                                <input
                                  type="text"
                                  name="city"
                                  value={formData.city}
                                  onChange={handleChange}
                                  placeholder="Publication city"
                                  className="w-full rounded-md border border-slate-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Website specific fields */}
                        {formData.sourceType === "website" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                  Website Title <span className="text-sky-600">*</span>
                                </label>
                                <input
                                  type="text"
                                  name="websiteTitle"
                                  value={formData.websiteTitle}
                                  onChange={handleChange}
                                  placeholder="Website name"
                                  className="w-full rounded-md border border-slate-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Access Date</label>
                                <input
                                  type="text"
                                  name="accessDate"
                                  value={formData.accessDate}
                                  onChange={handleChange}
                                  placeholder="Date accessed (e.g., Mar. 15, 2025)"
                                  className="w-full rounded-md border border-slate-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                  Publisher/Organization
                                </label>
                                <input
                                  type="text"
                                  name="publisher"
                                  value={formData.publisher}
                                  onChange={handleChange}
                                  placeholder="Publishing organization"
                                  className="w-full rounded-md border border-slate-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex justify-center pt-4">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          type="submit"
                          className="px-8 py-3 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-colors duration-200 flex items-center gap-2"
                        >
                          <Sparkles className="w-5 h-5" />
                          Generate Citation
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    ref={resultRef}
                  >
                    <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-sky-900">Your Citation</h3>
                        <div className="flex items-center text-sm text-slate-500">
                          <span className="inline-flex items-center mr-2 px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                            {citationStyle.toUpperCase()}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                            {formData.sourceType}
                          </span>
                        </div>
                      </div>

                      {loading ? (
                        <div className="flex justify-center items-center h-24">
                          <div className="relative">
                            <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-sky-500 animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Sparkles className="h-5 w-5 text-sky-500" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                            <p className="text-slate-700 font-serif leading-relaxed">{generatedCitation}</p>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={copyToClipboard}
                            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm border border-slate-200 text-slate-500 hover:text-sky-600 focus:outline-none transition-colors"
                            title="Copy to clipboard"
                          >
                            {copied ? <Check className="h-5 w-5 text-sky-600" /> : <Copy className="h-5 w-5" />}
                          </motion.button>
                        </div>
                      )}

                      {!loading && generatedCitation && (
                        <div className="mt-6 flex justify-center">
                          <div className="bg-sky-50 border border-sky-100 rounded-lg p-4 max-w-lg">
                            <div className="flex items-start">
                              <AlertCircle className="h-5 w-5 text-sky-600 mr-3 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-slate-600">
                                Always double-check your citations against the specific requirements of your institution
                                or publisher, as citation styles may have variations.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={() => setActiveTab("form")}
                        className="px-6 py-2 border border-sky-200 text-sky-700 font-medium rounded-lg hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-colors"
                      >
                        Edit Citation
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-sky-900">
            How to Use the Citation Generator
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
            >
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-sky-700 font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-sky-900 mb-3">Select Source Type & Style</h3>
              <p className="text-slate-600">
                Choose your source type (journal, book, website) and preferred citation style (APA, MLA, Chicago).
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
            >
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-sky-700 font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-sky-900 mb-3">Enter Source Details</h3>
              <p className="text-slate-600">
                Fill in the required information about your source, such as title, authors, and publication details.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
            >
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-sky-700 font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-sky-900 mb-3">Copy & Use</h3>
              <p className="text-slate-600">
                Generate your citation and copy it with one click to paste directly into your bibliography or works
                cited page.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sky-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">Citation Generator — Your Academic Writing Assistant</p>
          <p className="text-sky-300 text-sm">
            Designed to help students and researchers create accurate citations quickly and easily.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default CitationGenerator

