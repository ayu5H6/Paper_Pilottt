import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { 
  Send, Moon, Sun, Menu, ArrowLeft, Save, History, LogOut,
  X, Zap, Mic, BookmarkPlus, ExternalLink, ChevronRight 
} from "lucide-react";

const GeminiChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [chatTitle, setChatTitle] = useState("");
  const [conversations, setConversations] = useState([
    { id: 1, title: "AI Capabilities", date: "Mar 17", messages: [] },
    { id: 2, title: "Website Design Ideas", date: "Mar 16", messages: [] }
  ]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [listening, setListening] = useState(false);
  const chatContainerRef = useRef(null);
  
  const handleLogout = () => {
    // Clear user session (if needed)
    localStorage.removeItem("userToken"); // Example: Remove token

    // Redirect to auth.jsx (assuming it's at "/auth")
    navigate("/auth");
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending message
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: "user", timestamp: new Date().toISOString() };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    
    try {
      const res = await axios.post(
        "https://paper-pilottt.onrender.com/api/gemini",
        { question: input }
      );
      const botMessage = { text: res.data.result, sender: "bot", timestamp: new Date().toISOString() };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { 
        text: "Error getting response. Please try again.", 
        sender: "bot", 
        timestamp: new Date().toISOString() 
      }]);
    }
    
    setLoading(false);
  };

  // Handle voice input
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice recognition is not supported in your browser");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    if (!listening) {
      recognition.start();
      setListening(true);
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setListening(false);
      };
      
      recognition.onerror = () => {
        setListening(false);
      };
      
      recognition.onend = () => {
        setListening(false);
      };
    } else {
      recognition.stop();
      setListening(false);
    }
  };

  // Load conversation
  const loadConversation = (convo) => {
    setCurrentConversation(convo);
    setMessages(convo.messages.length > 0 ? convo.messages : []);
    setMenuOpen(false);
  };

  // Save current conversation
  const saveConversation = () => {
    if (messages.length === 0) return;
    setShowSaveDialog(true);
    
    // Suggest a title based on the first message
    const suggestedTitle = messages[0].text.substring(0, 30);
    setChatTitle(suggestedTitle + (suggestedTitle.length >= 30 ? "..." : ""));
  };

  // Confirm save
  const confirmSave = () => {
    const newConvo = {
      id: Date.now(),
      title: chatTitle || "Untitled Chat",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      messages: [...messages]
    };
    
    setConversations([newConvo, ...conversations]);
    setCurrentConversation(newConvo);
    setShowSaveDialog(false);
    
    // Animation feedback
    const saveButton = document.getElementById("save-button");
    if (saveButton) {
      saveButton.classList.add("scale-125");
      setTimeout(() => saveButton.classList.remove("scale-125"), 300);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Get background color based on mode
  const getBgColor = (primary, secondary) => {
    return darkMode ? primary : secondary;
  };

  return (
    <div className={`flex flex-col h-screen ${getBgColor('bg-gray-900', 'bg-white')} ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      {/* Sidebar */}
      <div 
        className={`fixed top-5 left-0 h-full w-72 md:w-80 ${getBgColor('bg-gray-800', 'bg-gray-100')} transform transition-all duration-300 ease-in-out z-30 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } shadow-xl`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">
            <span className="text-red-600">Gemini</span> Chats
          </h2>
          <button 
            onClick={() => setMenuOpen(false)} 
            className="md:hidden rounded-full p-1 hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <button 
            onClick={() => {
              setMessages([]);
              setCurrentConversation(null);
              setMenuOpen(false);
            }}
            className="w-full py-3 px-4 bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition-all duration-300 mb-4 hover:shadow-lg"
          >
            <Zap size={18} />
            New Chat
          </button>
        </div>
        
        <div className="p-2 font-medium text-sm uppercase text-gray-500 dark:text-gray-400 pl-6">
          Saved Conversations
        </div>
        
        <div className="overflow-y-auto h-[calc(100%-160px)] pb-24">
          {conversations.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No saved conversations yet
            </div>
          )}
          
          {conversations.map((convo) => (
            <div 
              key={convo.id} 
              onClick={() => loadConversation(convo)}
              className={`p-4 hover:${getBgColor('bg-gray-700', 'bg-gray-200')} cursor-pointer flex justify-between items-center ${
                currentConversation?.id === convo.id ? getBgColor('bg-gray-700', 'bg-gray-200') : ''
              } transition-all duration-200 mx-2 my-1 rounded-lg`}
            >
              <div className="flex items-center gap-3">
                <History size={16} className="text-red-600" />
                <span className="truncate">{convo.title}</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs opacity-60 mr-2">{convo.date}</span>
                <ChevronRight size={16} className="text-gray-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className={`w-full max-w-md ${getBgColor('bg-gray-800', 'bg-white')} rounded-xl p-6 transform transition-all duration-300 animate-fadeIn`}>
            <h3 className="text-xl font-bold mb-4">Save Conversation</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input 
                type="text" 
                value={chatTitle}
                onChange={(e) => setChatTitle(e.target.value)}
                className={`w-full p-2 rounded-lg ${getBgColor('bg-gray-700', 'bg-gray-100')} outline-none border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                placeholder="Enter a title for this conversation"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 text-sm font-medium border rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={confirmSave}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all duration-200"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Overlay for mobile */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div className={`flex-1 md:ml-80 transition-all duration-300`}>
        {/* Chat Header */}
        <div className="bg-red-600 text-white py-4 px-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="p-1 rounded-full hover:bg-red-700 md:hidden transition-all duration-200"
            >
              <Menu size={20} />
            </button>
            
            {currentConversation && (
              <>
                <button 
                  onClick={() => setCurrentConversation(null)}
                  className="p-1 rounded-full hover:bg-red-700 hidden sm:flex transition-all duration-200"
                >
                  <ArrowLeft size={20} />
                </button>
                <h1 className="text-lg font-bold truncate">
                  {currentConversation.title}
                </h1>
              </>
            )}
            
            {!currentConversation && (
              <h1 className="text-lg font-bold">Gemini AI Chat</h1>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              id="save-button"
              onClick={saveConversation}
              className="p-2 rounded-full hover:bg-red-700 transition-all duration-300"
              title="Save conversation"
              disabled={messages.length === 0}
            >
              <BookmarkPlus size={18} className={messages.length === 0 ? "opacity-50" : ""} />
            </button>
            
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-red-700 transition-all duration-300"
              title={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
        onClick={handleLogout}
        className="p-2 rounded bg-red-600 hover:bg-red-700 transition-all flex items-center"
      >
        <LogOut size={18} className="mr-2" />
        Logout
      </button>
          </div>
        </div>

       {/* Chat Window */}
<div
  ref={chatContainerRef}
  className={`flex-1 overflow-y-auto p-6 space-y-6 h-[calc(100vh-140px)]`}
>
  {messages.length === 0 && (
    <div className="flex flex-col items-center justify-center h-full opacity-80 animate-fadeIn">
      <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center mb-6 animate-pulse">
        <Zap size={40} className="text-white" />
      </div>
      <h2 className="text-2xl font-bold mb-3">How can I help you today?</h2>
      <p className={`text-center max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Ask me questions, get creative writing, technical help, and more
      </p>
    </div>
  )}
  
  {messages.map((msg, index) => (
    <div
      key={index}
      className={`${
        msg.sender === "user" ? "ml-auto" : "mr-auto"
      } animate-slideIn`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={`p-4 rounded-2xl ${
        msg.sender === "user" 
          ? "bg-red-600 text-white rounded-br-none" 
          : `${getBgColor('bg-gray-700', 'bg-gray-200')} ${darkMode ? 'text-white' : 'text-gray-800'} rounded-bl-none`
      } max-w-[85%] shadow-md`}>
        {msg.text}
      </div>
      <div className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'} ${
        msg.sender === "user" ? "text-right mr-2" : "ml-2"
      }`}>
        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
      </div>
    </div>
  ))}
  
  {loading && (
    <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-3 animate-fadeIn`}>
      <div className="p-4 rounded-2xl bg-gray-700 text-white rounded-bl-none shadow-md flex items-center">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <span className="ml-3">Gemini is thinking...</span>
      </div>
    </div>
  )}
</div>

{/* Input Box */}
<div className={`p-4 ${getBgColor('bg-gray-800', 'bg-gray-100')} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center gap-3 sticky bottom-0 shadow-lg`}>
  <button
    onClick={handleVoiceInput}
    className={`p-3 rounded-full transition-all duration-300 ${
      listening 
        ? 'bg-red-600 text-white animate-pulse' 
        : `${getBgColor('bg-gray-700', 'bg-white')} ${darkMode ? 'text-white' : 'text-gray-800'} hover:bg-red-600 hover:text-white`
    } shadow-md`}
    title="Voice input"
  >
    <Mic className="w-5 h-5" />
  </button>
  
  <div className="flex-1 relative">
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyPress={handleKeyPress}
      placeholder="Ask Gemini something..."
      className={`w-full p-4 rounded-xl ${getBgColor('bg-gray-700', 'bg-white')} ${darkMode ? 'text-white' : 'text-gray-800'} outline-none border ${darkMode ? 'border-gray-600' : 'border-gray-300'} shadow-md text-sm sm:text-base pr-12 transition-all duration-200 focus:border-red-600`}
    />
    <button
      onClick={sendMessage}
      disabled={!input.trim()}
      className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${
        input.trim() 
          ? 'bg-red-600 text-white hover:bg-red-700' 
          : `${getBgColor('bg-gray-600', 'bg-gray-300')} opacity-50 cursor-not-allowed`
      }`}
    >
      <Send className="w-5 h-5" />
    </button>
  </div>
</div>

{/* Cookie banner - Important for mobile */}
<div className="fixed bottom-0 left-0 right-0 md:hidden">
  <div className="h-6 bg-gradient-to-t from-gray-900 to-transparent opacity-50 pointer-events-none"></div>
</div>
</div>

{/* Add CSS for animations in the global scope */}
<style jsx global>{`
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideIn {
    from { 
      opacity: 0;
      transform: translateY(10px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease forwards;
  }
  
  .animate-slideIn {
    animation: slideIn 0.3s ease forwards;
  }
  
  .scale-125 {
    transform: scale(1.25);
    transition: transform 0.3s ease;
  }
`}
</style>

</div>
  )
};

export default GeminiChat;