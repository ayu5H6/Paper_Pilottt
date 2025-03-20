import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { useState } from "react";
import Auth from "./components/Auth.jsx";
import GrammarChecker from "./components/Grammer";
import ArticleReader from "./components/ArticleReader";
import PdfUploader from "./components/PdfUploader";
import TextSummarizer from "./components/TextSummarizer";
import ResearchEditor from "./components/RealtimeCollabEditor";
import GeminiChat from "./components/GeminiChat.jsx";
import Navbar from "./components/navbar.jsx";
import About from "./components/TeamSection.jsx";
import Chatbot from "./components/Chatbot.jsx";
import CitationGenerator from "./components/CitationGenerator.jsx";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login status

  return (
    // <Router>
    //   <nav className="p-4 bg-gray-800 text-white flex gap-4">
    //     {!isAuthenticated ? (
    //       <Link to="/" className="hover:underline">
    //         Login
    //       </Link>
    //     ) : (
    //       <>
    //         <Link to="/gemini-chat" className="hover:underline">
    //           Gemini Chat
    //         </Link>
    //         <Link to="/article-reader" className="hover:underline">
    //           Article Reader
    //         </Link>
    //         <Link to="/pdf-uploader" className="hover:underline">
    //           PDF Uploader
    //         </Link>
    //         <Link to="/text-summarizer" className="hover:underline">
    //           Text Summarizer
    //         </Link>
    //         <Link to="/realtime-editor" className="hover:underline">
    //           Realtime Editor
    //         </Link>
    //       </>
    //     )}
    //   </nav>

    //   <Routes>
    //     {/* Default route shows the Auth page */}
    //     <Route
    //       path="/"
    //       element={<Auth setIsAuthenticated={setIsAuthenticated} />}
    //     />

    //     {/* Show Gemini Chat (GrammarChecker) only if authenticated */}
    //     <Route
    //       path="/gemini-chat"
    //       element={isAuthenticated ? <GrammarChecker /> : <Navigate to="/" />}
    //     />

    //     {/* Other Pages (Accessible only if logged in) */}
    //     <Route
    //       path="/article-reader"
    //       element={isAuthenticated ? <ArticleReader /> : <Navigate to="/" />}
    //     />
    //     <Route
    //       path="/pdf-uploader"
    //       element={isAuthenticated ? <PdfUploader /> : <Navigate to="/" />}
    //     />
    //     <Route
    //       path="/text-summarizer"
    //       element={isAuthenticated ? <TextSummarizer /> : <Navigate to="/" />}
    //     />
    //     <Route
    //       path="/realtime-editor"
    //       element={
    //         isAuthenticated ? (
    //           <RealtimeEditor docId="sample-document" />
    //         ) : (
    //           <Navigate to="/" />
    //         )
    //       }
    //     />
    //   </Routes>
    // </Router>
    // <PdfUploader/>
    // <GrammarChecker/>
    <ResearchEditor/>
    // <About/>
    // <ArticleReader/>
    // <Chatbot/>
    // <CitationGenerator/>
  //  <Auth/>
  
    
  );
}

export default App;
