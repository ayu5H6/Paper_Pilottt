import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000"); // Connect to backend

const ResearchEditor = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your Research AI assistant. Write something in the editor, and I can help you improve your research paper.",
      sender: "ai",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [roomId, setRoomId] = useState("");
  const [editorContent, setEditorContent] = useState(""); // For real-time updates
  const editorRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Join a room
  const joinRoom = () => {
    const id = prompt("Enter room ID or create a new one:");
    if (id) {
      setRoomId(id);
      socket.emit("joinRoom", id);
    }
  };

  // Send message to AI assistant
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const updatedMessages = [
      ...messages,
      { text: inputMessage, sender: "user" },
    ];
    setMessages(updatedMessages);
    setInputMessage("");

    const editorText = editorRef.current?.getContent();

    try {
      const response = await axios.post("http://localhost:5000/api/gemini", {
        message: inputMessage,
        document: editorText,
      });

      const aiResponse = { text: response.data.text, sender: "ai" };
      setMessages([...updatedMessages, aiResponse]);

      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  // Send document updates to other users in the room
const handleEditorChange = (content) => {
  if (!editorRef.current) return;

  const editor = editorRef.current;
  const cursorPosition = editor.selection.getRng(); // Save cursor position

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

  return () => {
    socket.off("documentUpdated");
  };
}, []);


  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Editor Section */}
      <div className="flex flex-col flex-grow p-4 border-r border-gray-200 bg-red-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Research Document</h2>
          <button
            className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            onClick={joinRoom}
          >
            {roomId ? `Room: ${roomId}` : "Create/Join Room"}
          </button>
        </div>

        <div className="flex-grow border border-gray-200 rounded-md overflow-hidden resize">
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

      {/* Chat Section */}
      <div className="flex flex-col w-1/3 min-w-[300px] max-w-[450px] bg-gray-100 p-4">
        <h2 className="text-lg font-medium mb-4">Research AI Assistant</h2>
        <div
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto p-3 border border-gray-200 rounded-md bg-white mb-4"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-3 p-2.5 rounded-lg ${
                message.sender === "user"
                  ? "bg-blue-50 text-blue-900 ml-auto"
                  : "bg-gray-100 text-gray-800 mr-auto"
              }`}
            >
              <div className="text-sm">{message.text}</div>
            </div>
          ))}
        </div>
        <div className="flex mb-4">
          <textarea
            className="flex-grow p-3 border border-gray-200 rounded-l-md resize-none"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask AI for help..."
          />
          <button
            className="px-4 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResearchEditor;
