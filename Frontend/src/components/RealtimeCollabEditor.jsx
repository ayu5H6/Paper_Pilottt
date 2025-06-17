import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import io from "socket.io-client";
import { FileText, Users, Edit, Clock } from 'lucide-react'; 
import axios from "axios";

const socket = io("https://paper-pilottt.onrender.com"); // Connect to backend

const ResearchEditor = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your Research AI assistant. Write something in the editor, and I can help you improve your research paper.",
      sender: "ai",
    },
 
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [roomId, setRoomId] = useState("");
  const [editorContent, setEditorContent] = useState(""); 
  const [collaborators, setCollaborators] = useState(["You (Admin)"]);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const editorRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Join a room
  const joinRoom = () => {
    const id = prompt("Enter room ID or create a new one:");
    if (id) {
      setRoomId(id);
      socket.emit("joinRoom", id);
      

      const username = localStorage.getItem("username") || "Anonymous User";
      setCollaborators(prev => ["You (Admin)", ...prev.filter(name => name !== "You (Admin)")]);
    }
  };

  // Send message to AI assistant
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) {
      console.warn("Message is empty.");
      return;
    }
  
    const editorText = editorRef.current?.getContent({ format: "text" }).trim();
  
    if (!editorText || editorText === "") {
      console.warn("Editor content is empty.");
      alert("Please write something in the editor before asking for AI help.");
      return;
    }
  
    const updatedMessages = [
      ...messages,
      { text: inputMessage, sender: "user" },
    ];
    setMessages(updatedMessages);
    setInputMessage("");
  
    try {
      const response = await axios.post("http://localhost:5000/api/gemini", {
        message: inputMessage.trim(),
        document: editorText,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const aiResponse = { text: response.data.text, sender: "ai" };
      setMessages([...updatedMessages, aiResponse]);
  

      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages([
        ...updatedMessages,
        { text: "AI failed to respond. Try again later.", sender: "ai" },
      ]);
    }
  };

  // Send document updates to other users in the room
  const handleEditorChange = (content) => {
    if (!editorRef.current) return;

    const editor = editorRef.current;
    const cursorPosition = editor.selection.getRng();

    setEditorContent(content);
    if (roomId) {
      socket.emit("updateDocument", { roomId, content });
    }

    editor.selection.setRng(cursorPosition); // Restore cursor position
  };

  useEffect(() => {
    socket.on("documentUpdated", (newContent) => {
      if (!editorRef.current) return;

      const editor = editorRef.current;
      const currentContent = editor.getContent(); // Get existing content

      if (currentContent !== newContent) {
        const cursorPosition = editor.selection.getBookmark(2); // Save precise cursor position

        editor.setContent(newContent, { format: "raw" }); // Prevent cursor reset
        editor.selection.moveToBookmark(cursorPosition); // Restore cursor position
      }
    });

    // Mock socket for collaborators join/leave (in real implementation, this would come from server)
    socket.on("userJoined", (username) => {
      setCollaborators(prev => [...prev, username]);
    });

    socket.on("userLeft", (username) => {
      setCollaborators(prev => prev.filter(user => user !== username));
    });

    return () => {
      socket.off("documentUpdated");
      socket.off("userJoined");
      socket.off("userLeft");
    };
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="flex flex-col h-screen mt-19 bg-sky">
      {/* Navbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-sky-200 bg-sky shadow-sm">
      <div className="flex items-center">
  <h1 className="text-xl  font-semibold text-blue-900 flex items-center">
    <FileText className="mr-2" />Instantly fetch and view the info you type – your research, summarized and at your fingertips.
  </h1>
  {roomId && (
    <span className="ml-4 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center">
      <Users className="mr-1" /> Room: {roomId}
    </span>
  )}
  
</div>
        
        <div className="flex items-center gap-2">
          {/* Collaborators chat */}
          <div className="flex items-center gap-1 mr-4">
            {collaborators.map((user, index) => (
              <div key={index} className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                  {user.charAt(0).toUpperCase()}
                </div>
              </div>
            ))}
          </div>
              
          
          <button
            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-md hover:from-yellow-600 hover:to-yellow-500 transform transition-all hover:scale-105 shadow-md flex items-center gap-2"
            onClick={joinRoom}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M0 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4zm7-7a3 3 0 0 0-3 3v6h6a1 1 0 0 0 0-2H4V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1 1 1 0 1 0 0 2 3 3 0 0 0 3-3V4a3 3 0 0 0-3-3z"/>
            </svg>
            {roomId ? "Change Room" : "Create/Join Room"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-grow overflow-hidden">
        {/* Editor Section */}
        <div className={`flex flex-col flex-grow p-4 ${isChatOpen ? 'w-2/3' : 'w-full'}`}>
          <div className="flex-grow border border-blue-200 rounded-md overflow-hidden shadow-sm">
            <Editor
              apiKey="8tfoowhi65ml4h4m36yyvqmz5163yblvv2jlh10tsjfagdlz"
              onInit={(evt, editor) => (editorRef.current = editor)}
              value={editorContent}
              onEditorChange={handleEditorChange}
              init={{
                height: "100%",
                plugins: "pagebreak link lists table",
                toolbar:
                  "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | table link | pagebreak",
                content_style: "body { font-size: 14px; }",
              }}
            />
          </div>
        </div>
{
  /* Chat Section - Conditionally shown */
}
{
  isChatOpen ? (
    <div className="flex flex-col w-1/3 min-w-[200px] max-w-[350px] relative transition-all duration-300 ease-in-out transform">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-indigo-900 opacity-90 z-0 rounded-l-lg"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat opacity-10 z-0 rounded-l-lg"></div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="p-3 border-b border-indigo-700 bg-gradient-to-r from-blue-800 to-indigo-800 rounded-tl-lg shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium font-semibold text-white flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-300"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              Research AI Assistant
            </h2>
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse delay-100"></div>
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-200"></div>
            </div>
          </div>
        </div>

        <div
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-transparent z-10"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-3 p-2.5 rounded-lg max-w-[85%] backdrop-blur-sm transition-all duration-300 ease-in-out animate-fadeIn ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white ml-auto shadow-md"
                  : "bg-gradient-to-r from-gray-800/70 to-gray-700/70 text-white border border-gray-600/30 shadow-md"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-sm leading-relaxed">{message.text}</div>
              <div className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-200" : "text-gray-300"}`}>
                {message.sender === "user" ? "You" : "AI Assistant"} •{" "}
                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-indigo-700 bg-gradient-to-r from-blue-800 to-indigo-800 rounded-bl-lg shadow-inner z-10">
          <div className="flex">
            <textarea
              className="flex-grow p-2 border border-indigo-600 rounded-l-md resize-none focus:outline-none focus:ring-1 focus:ring-blue-400 bg-gray-800/50 text-white placeholder-gray-400 backdrop-blur-sm"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask AI for help..."
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            <button
              className="px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-r-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md flex items-center justify-center"
              onClick={handleSendMessage}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null
}

{
  /* Add this toggle button at the bottom of the screen */
}
;<div
  className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out ${isChatOpen ? "translate-y-0" : "translate-y-0"}`}
>
  <button
    onClick={toggleChat}
    className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
  >
    <span className="absolute -top-10 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      {isChatOpen ? "Hide Assistant" : "Show Assistant"}
    </span>
    <div className="relative">
      {isChatOpen ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 transition-transform duration-300 ease-in-out"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 transition-transform duration-300 ease-in-out"
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
      <span
        className={`absolute -top-1 -right-1 flex h-3 w-3 ${messages.length > 1 ? "opacity-100" : "opacity-0"} transition-opacity duration-200`}
      >
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-400"></span>
      </span>
    </div>
  </button>
</div>
      </div>
    </div>
  );
};

export default ResearchEditor;
