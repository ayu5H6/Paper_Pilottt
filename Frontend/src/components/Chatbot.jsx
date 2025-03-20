import React, { useState, useRef, useEffect } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  // Components information
  const components = [
    {
      id: 1,
      name: "Abstract Extractor",
      description:
        "This component allows you to extract and summarize abstracts from research papers.",
      usage:
        "To use the Abstract Extractor:\n1. Upload your research paper PDF or paste the paper URL\n2. Click 'Extract Abstract'\n3. The tool will identify and extract the abstract section\n4. You can copy, download, or further summarize the extracted abstract",
    },
    {
      id: 2,
      name: "Article Reader",
      description:
        "This component highlights and explains difficult terminology in research articles.",
      usage:
        "To use the Article Reader:\n1. Upload your article or paste the article text\n2. The tool will automatically highlight complex terms\n3. Click on any highlighted term to see its definition\n4. You can toggle between simplified and technical explanation",
    },
    {
      id: 3,
      name: "Citation Generator",
      description:
        "This component helps generate citations in various formats.",
      usage:
        "To use the Citation Generator:\n1. Enter the DOI, URL, or paper details manually\n2. Select your preferred citation style (APA, MLA, Chicago, etc.)\n3. Click 'Generate Citation'\n4. Copy the formatted citation or add it to your bibliography list",
    },
    {
      id: 4,
      name: "Literature Mapper",
      description:
        "This component visualizes connections between research papers.",
      usage:
        "To use the Literature Mapper:\n1. Upload multiple papers or enter their DOIs\n2. Select mapping criteria (co-citation, shared authors, keywords, etc.)\n3. Click 'Generate Map'\n4. Use the interactive visualization to explore connections\n5. Adjust the view using filters and zoom controls",
    },
  ];

  // Add welcome messages when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          text: "Hi there! I'm your research assistant. How can I help you today?",
          isBot: true,
        },
        {
          text: "Here are the components available on our research platform:",
          isBot: true,
        },
        {
          text: components.map((comp) => `${comp.id}. ${comp.name}`).join("\n"),
          isBot: true,
        },
        {
          text: "Enter a component number to learn more about it, or ask me a question!",
          isBot: true,
        },
      ]);
    }
  }, [isOpen]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message
    const newMessages = [...messages, { text: inputValue, isBot: false }];
    setMessages(newMessages);
    setInputValue("");

    // Process user input and respond
    setTimeout(() => {
      const userInput = inputValue.trim();
      let botResponse;

      // Check if input is a number corresponding to a component
      const componentNumber = parseInt(userInput);
      const component = components.find((comp) => comp.id === componentNumber);

      if (component) {
        botResponse = [
          { text: `📌 ${component.name}`, isBot: true },
          { text: component.description, isBot: true },
          { text: `📝 How to use:\n${component.usage}`, isBot: true },
          {
            text: "Is there anything specific you'd like to know about this component?",
            isBot: true,
          },
        ];
      } else if (
        userInput.toLowerCase().includes("hello") ||
        userInput.toLowerCase().includes("hi")
      ) {
        botResponse = [
          {
            text: "Hello! I'm your research assistant. What can I help you with today?",
            isBot: true,
          },
        ];
      } else if (userInput.toLowerCase().includes("help")) {
        botResponse = [
          {
            text: "I can help you use any of our research tools. Enter a component number to learn more about its functionality.",
            isBot: true,
          },
        ];
      } else if (
        userInput.toLowerCase().includes("list") ||
        userInput.toLowerCase().includes("components")
      ) {
        botResponse = [
          { text: "Here are all the available components:", isBot: true },
          {
            text: components
              .map((comp) => `${comp.id}. ${comp.name}`)
              .join("\n"),
            isBot: true,
          },
        ];
      } else {
        botResponse = [
          {
            text: "I'm not sure I understand. Please enter a component number to learn about our tools, or try asking in a different way.",
            isBot: true,
          },
        ];
      }

      setMessages((prevMessages) => [...prevMessages, ...botResponse]);
    }, 500);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-200"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col transition-all duration-200 max-h-[500px]">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-medium">Research Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isBot ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    message.isBot
                      ? "bg-gray-100 text-gray-800"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  <pre
                    className={`whitespace-pre-wrap font-sans text-sm ${
                      message.isBot ? "" : "text-white"
                    }`}
                  >
                    {message.text}
                  </pre>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-gray-200 p-3"
          >
            <div className="flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
