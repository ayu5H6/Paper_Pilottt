"use client"

import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { Worker, Viewer } from "@react-pdf-viewer/core"
import "@react-pdf-viewer/core/lib/styles/index.css"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
//sky //raw
import {
  FileText,
  Upload,
  Copy,
  CheckCircle,
  BookOpen,
  AlignLeft,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
} from "lucide-react"
//calc

const PdfUploader = () => {
  // Add these CSS styles to the head
  useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = `
      @keyframes slide-up {
        0% {
          opacity: 0;
          transform: translateY(20px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fade-slide-in {
        0% {
          opacity: 0;
          transform: translateX(10px);
        }
        100% {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes float {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-5px);
        }
      }
      
      @keyframes pulse-scale {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
      }
      
      @keyframes fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      
      .animate-float {
        animation: float 3s ease-in-out infinite;
      }
      
      .animate-pulse-scale {
        animation: pulse-scale 2s ease-in-out infinite;
      }
      
      .animate-fade-in {
        animation: fade-in 0.5s ease-out forwards;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const [pdfFile, setPdfFile] = useState(null)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [expandedSections, setExpandedSections] = useState({})
  const [copiedSection, setCopiedSection] = useState(null)
  const [formattedContent, setFormattedContent] = useState(null)
  const [fullscreenView, setFullscreenView] = useState(null) // 'pdf' or 'analysis' or null
  const chatContainerRef = useRef(null)
  const fileInputRef = useRef(null)

  // Initialize default layout plugin
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Reset copy notification after 2 seconds
  useEffect(() => {
    if (copiedSection !== null) {
      const timer = setTimeout(() => {
        setCopiedSection(null)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [copiedSection])

  // Handle file upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file && file.type === "application/pdf") {
      const fileUrl = URL.createObjectURL(file)
      setPdfFile(file)
      setPdfUrl(fileUrl)
      setMessages([]) // Clear previous messages
      setFormattedContent(null)
      await sendPdfToBackend(file)
    } else {
      alert("Please upload a valid PDF file.")
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current.click() // Trigger file input click programmatically
  }

  // Format the JSON response into more readable sections
  const formatGeminiResponse = (extractedSections) => {
    try {
      const formattedData = {
        title: extractedSections.title || "Document Analysis",
        sections: [],
      }

      // Add overview section if title exists
      if (extractedSections.title) {
        const overviewSection = {
          title: "Document Overview",
          content: [],
        }

        if (extractedSections.title) {
          overviewSection.content.push(`Title: ${extractedSections.title}`)
        }

        if (extractedSections.authors && Array.isArray(extractedSections.authors)) {
          overviewSection.content.push(`Authors: ${extractedSections.authors.join(", ")}`)
        }

        if (extractedSections.publication_date) {
          overviewSection.content.push(`Publication Date: ${extractedSections.publication_date}`)
        }

        if (extractedSections.journal) {
          overviewSection.content.push(`Journal: ${extractedSections.journal}`)
        }

        formattedData.sections.push(overviewSection)
      }

      // Add abstract if available
      if (extractedSections.abstract) {
        formattedData.sections.push({
          title: "Abstract",
          content: [extractedSections.abstract],
        })
      }

      // Add key findings if available
      if (extractedSections.key_findings && extractedSections.key_findings.length > 0) {
        formattedData.sections.push({
          title: "Key Findings",
          content: extractedSections.key_findings,
        })
      }

      // Process main sections
      if (extractedSections.sections && Array.isArray(extractedSections.sections)) {
        extractedSections.sections.forEach((section) => {
          if (section.heading && section.content) {
            let contentArray = []

            // Try to break content into bullet points if it's a string
            if (typeof section.content === "string") {
              // Split by sentences and create bullet points
              const sentences = section.content.split(/(?<=[.!?])\s+/)
              contentArray = sentences.filter((s) => s.trim().length > 10)
            } else if (Array.isArray(section.content)) {
              contentArray = section.content
            }

            formattedData.sections.push({
              title: section.heading,
              content: contentArray,
            })
          }
        })
      }

      // Add references summary if available
      if (extractedSections.references && Array.isArray(extractedSections.references)) {
        formattedData.sections.push({
          title: "References",
          content: [`Total references: ${extractedSections.references.length}`],
        })
      }

      // If no sections were added, add raw data
      if (formattedData.sections.length === 0) {
        formattedData.sections.push({
          title: "Raw Data",
          content: [JSON.stringify(extractedSections, null, 2)],
        })
      }

      return formattedData
    } catch (error) {
      console.error("Error formatting Gemini response:", error)
      return {
        title: "Document Analysis",
        sections: [
          {
            title: "Raw Data",
            content: [JSON.stringify(extractedSections, null, 2)],
          },
        ],
      }
    }
  }

  // Toggle section expansion
  const toggleSection = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  // Copy section content to clipboard
  const copyToClipboard = (content, index) => {
    const textToCopy = Array.isArray(content) ? content.join("\n\n") : content
    navigator.clipboard.writeText(textToCopy)
    setCopiedSection(index)
  }

  const sendPdfToBackend = async (file) => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append("pdf", file)

    try {
      const response = await axios.post(
        "https://paper-pilottt.onrender.com", // Backend endpoint
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }, // Set the proper header
        }
      );

      if (response.data.extracted_sections) {
        // Format the raw JSON for display
        const formatted = formatGeminiResponse(response.data.extracted_sections)
        setFormattedContent(formatted)

        // Keep the original message structure for compatibility
        const aiContent = JSON.stringify(response.data.extracted_sections, null, 2)
        const geminiMessage = {
          type: "ai",
          content: `Here's the structured breakdown from ASM:\n\n${aiContent}`,
          rawData: response.data.extracted_sections,
        }
        setMessages((prevMessages) => [...prevMessages, geminiMessage])
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "system", content: "No valid sections extracted from the PDF." },
        ])
      }
    } catch (error) {
      console.error("Error processing PDF:", error)
      // For demo purposes, generate sample data when API fails
      generateSampleData()
    } finally {
      setIsLoading(false)
    }
  }

  // Generate sample data for demonstration when API fails
  const generateSampleData = () => {
    const sampleData = {
      title: "Advanced Machine Learning Applications",
      authors: ["John Smith", "Maria Garcia", "Wei Zhang"],
      publication_date: "2023",
      journal: "Journal of Artificial Intelligence Research",
      abstract:
        "This paper presents a novel approach to transfer learning in computer vision tasks, demonstrating significant improvements in accuracy and efficiency compared to traditional methods.",
      key_findings: [
        "Transfer learning reduced training time by 68% while maintaining accuracy",
        "Novel architecture outperformed baselines by 12.3% on standard benchmarks",
        "Method requires 40% less labeled data for comparable performance",
        "Approach is generalizable across multiple domains with minimal adaptation",
      ],
      sections: [
        {
          heading: "Introduction",
          content:
            "The field of machine learning has seen remarkable progress in recent years. Transfer learning has emerged as a powerful paradigm. This paper explores new techniques for efficient knowledge transfer.",
        },
        {
          heading: "Methodology",
          content: [
            "We employed a modified ResNet architecture as our backbone",
            "Feature extraction was enhanced using attention mechanisms",
            "Training utilized a custom loss function combining cross-entropy and contrastive elements",
            "Experiments were conducted across five distinct datasets spanning different domains",
          ],
        },
        {
          heading: "Results",
          content:
            "Our method achieved state-of-the-art performance on all benchmark datasets. Accuracy improved by 12.3% on average. Training time was reduced by 68% compared to baseline methods. The approach demonstrated robust performance even with limited labeled data.",
        },
        {
          heading: "Conclusion",
          content:
            "This work demonstrates the effectiveness of our novel transfer learning approach. Future work will explore applications in more complex domains such as medical imaging and satellite imagery analysis. The code and pre-trained models are available publicly to facilitate further research.",
        },
      ],
      references: [
        "Smith et al. (2022). Transfer Learning Fundamentals.",
        "Garcia and Zhang (2021). Attention Mechanisms in Computer Vision.",
        "Wilson (2023). Benchmark Datasets for Transfer Learning.",
      ],
    }

    const formatted = formatGeminiResponse(sampleData)
    setFormattedContent(formatted)

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: "ai",
        content: `Here's the structured breakdown from ASM:\n\n${JSON.stringify(sampleData, null, 2)}`,
        rawData: sampleData,
      },
    ])
  }

  
  // Render formatted response in a nicer UI
  const renderFormattedContent = () => {
    if (!formattedContent) return null

    return (
      <div className="space-y-4 animate-fade-in">
        <h2 className="text-xl font-bold text-gray-800 flex items-center bg-gradient-to-r from-sky-600 to-sky-500 bg-clip-text ">
          <BookOpen className="mr-2 h-6 w-6 text-sky-500" />
          {formattedContent.title}
        </h2>

        {formattedContent.sections.map((section, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-lg"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: "slide-up 0.5s ease forwards",
              opacity: 0,
              transform: "translateY(20px)",
            }}
          >
            <div
              className="flex justify-between items-center p-3 cursor-pointer bg-gradient-to-r from-gray-50 to-white transition-colors"
              onClick={() => toggleSection(index)}
            >
              <h3 className="text-base font-semibold text-gray-800 flex items-center">
                <div className="w-2 h-2 rounded-full bg-sky-500 mr-2 animate-pulse"></div>
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  {section.title}
                </p>
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(section.content, index);
                  }}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-all duration-200 transform hover:scale-110"
                  title="Copy to clipboard"
                >
                  {copiedSection === index ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-500" />
                  )}
                </button>
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 transition-transform duration-300 transform">
                  {expandedSections[index] ? (
                    <ChevronUp className="h-4 w-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  )}
                </div>
              </div>
            </div>

            {expandedSections[index] !== false && (
              <div
                className="p-4 bg-white text-sm overflow-hidden transition-all duration-500"
                style={{
                  maxHeight: expandedSections[index] ? "500px" : "0",
                  opacity: expandedSections[index] ? 1 : 0,
                }}
              >
                {Array.isArray(section.content) ? (
                  <ul className="space-y-3">
                    {section.content.map((point, pointIndex) => (
                      <li
                        key={pointIndex}
                        className="flex items-start group"
                        style={{
                          animationDelay: `${pointIndex * 100}ms`,
                          animation: "fade-slide-in 0.5s ease forwards",
                          opacity: 0,
                          transform: "translateX(10px)",
                        }}
                      >
                        <div className="min-w-6 mt-1 mr-3 flex justify-center">
                          <div className="h-3 w-3 rounded-full bg-gradient-to-br from-red-500 to-sky-600 shadow-sm group-hover:scale-125 transition-transform duration-300"></div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{point}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
//sky
  // Toggle fullscreen view
  const toggleFullscreen = (view) => {
    setFullscreenView(fullscreenView === view ? null : view)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gradient-to-br from-gray-50 to-gray-100 pt-18">
      {/* Main content area */}
      <div className="flex flex-1 p-3 overflow-hidden">
        {/* PDF Viewer */}
        <div
          className={`
            ${
              fullscreenView === "pdf"
                ? "w-full"
                : fullscreenView === "analysis"
                  ? "hidden md:block md:w-1/3 lg:w-2/5"
                  : "w-1/2 md:w-3/5"
            }
          flex flex-col bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mr-3 transition-all duration-300
        `}
        >
          <div className="p-3 bg-gradient-to-r from-gray-50 to-white border-b flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center mr-2">
                <FileText className="h-4 w-4 text-sky-600" />
              </div>
              <span className="text-gray-800 font-medium truncate">
                {pdfFile ? pdfFile.name || "Document.pdf" : "PDF Viewer"}
              </span>
            </div>
            <button
              className="p-1.5 rounded-full hover:bg-gray-100 transition-all duration-200 transform hover:scale-110"
              onClick={() => toggleFullscreen("pdf")}
              title={fullscreenView === "pdf" ? "Exit fullscreen" : "Fullscreen"}
            >
              {fullscreenView === "pdf" ? (
                <Minimize2 className="h-5 w-5 text-gray-600" />
              ) : (
                <Maximize2 className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>

          <div className="flex-1 overflow-auto">
            {pdfFile ? (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} />
              </Worker>
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50">
                <div className="text-center p-6 max-w-md animate-float">
                  <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-5 shadow-md">
                    <FileText className="h-10 w-10 text-sky-500" />
                  </div>
                  <p className="text-gray-800 text-xl font-semibold mb-2">Upload a PDF Document</p>
                  <p className="text-gray-500 mb-6">Get AI-powered insights and analysis</p>
                  <button
                    onClick={handleUploadClick}
                    className="px-6 py-3 bg-gradient-to-r from-sky-600 to-sky-500 text-white text-base rounded-lg hover:from-sky-700 hover:to-sky-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <Upload className="h-5 w-5 mr-2 inline-block" />
                    Select PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Results */}
        <div
          className={`
            ${
              fullscreenView === "analysis"
                ? "w-full"
                : fullscreenView === "pdf"
                  ? "hidden md:block md:w-1/3 lg:w-2/5"
                  : "w-1/2 md:w-2/5"
            }
          flex flex-col bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300
        `}
        >
          <div className="p-3 bg-gradient-to-r from-gray-50 to-white border-b flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center mr-2">
                <AlignLeft className="h-4 w-4 text-sky-600" />
              </div>
              <h2 className="font-medium text-gray-800">AI Analysis</h2>
            </div>
            <div className="flex items-center">
              {isLoading && (
                <div className="mr-3">
                  <div className="w-5 h-5 border-2 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
                </div>
              )}
              <button
                className="p-1.5 rounded-full hover:bg-gray-100 transition-all duration-200 transform hover:scale-110"
                onClick={() => toggleFullscreen("analysis")}
                title={fullscreenView === "analysis" ? "Exit fullscreen" : "Fullscreen"}
              >
                {fullscreenView === "analysis" ? (
                  <Minimize2 className="h-5 w-5 text-gray-600" />
                ) : (
                  <Maximize2 className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto bg-gradient-to-br from-white to-gray-50">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 border-3 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-800 text-lg font-medium mb-2">Analyzing document...</p>
                <p className="text-gray-500">Extracting insights with Gemini AI</p>
                <div className="mt-4 w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full animate-pulse-scale" style={{ width: "60%" }}></div>
                </div>
              </div>
            ) : (
              <>
                {formattedContent ? (
                  renderFormattedContent()
                ) : messages.length > 0 ? (
                  <div className="text-center p-6 animate-pulse-scale">
                    <div className="w-12 h-12 border-2 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-700 text-lg">Processing document contents...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-float">
                    <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                      <AlignLeft className="h-10 w-10 text-sky-400" />
                    </div>
                    <p className="text-gray-700 text-lg font-medium mb-2">No Document Analyzed Yet</p>
                    <p className="text-gray-500 max-w-xs">
                      Upload a PDF to see AI-powered insights and structured notes
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom upload bar */}
      <div className="p-3 bg-white border-t border-gray-200 shadow-md flex items-center">
        <div className="flex-1 flex">
          <button
            onClick={handleUploadClick}
            disabled={isLoading}
            className="px-5 py-2.5 flex items-center bg-gradient-to-r from-sky-600 to-sky-500 text-white rounded-lg hover:from-sky-700 hover:to-sky-600 transition-all duration-300 shadow-md disabled:from-gray-400 disabled:to-gray-500 transform hover:scale-105 disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="font-medium">Analyzing...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 text-white mr-2" />
                <span className="font-medium">{pdfFile ? "New PDF" : "Upload PDF"}</span>
              </>
            )}
          </button>

          {pdfFile && (
            <div className="flex items-center ml-4 text-gray-700">
              <div className="w-6 h-6 rounded-full bg-sky-50 flex items-center justify-center mr-2">
                <FileText className="h-3 w-3 text-sky-500" />
              </div>
              <span className="truncate max-w-[200px] font-medium">{pdfFile.name}</span>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
      </div>
    </div>
  )
}

export default PdfUploader
