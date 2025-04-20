import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";

// Components
import Navbar from "./components/navbar";
import PageLoader from "./components/PageLoader";
import Auth from "./components/Auth";
import About from "./components/About";
import GrammarChecker from "./components/Grammer";
import ArticleReader from "./components/ArticleReader";
import PdfUploader from "./components/PdfUploader";
import TextSummarizer from "./components/TextSummarizer";
import ResearchEditor from "./components/RealtimeCollabEditor";
import GeminiChat from "./components/GeminiChat";
import Chatbot from "./components/Chatbot";
import CitationGenerator from "./components/CitationGenerator";
import Buy from "./components/Buy";

function AppRoutes({ isAuthenticated, setIsAuthenticated }) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 2000); // adjust timing
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      {loading && <PageLoader />}

      <Routes>
        <Route path="/" element={<About />} />
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/about" /> : <Auth setIsAuthenticated={setIsAuthenticated} />
          }
        />
        <Route
          path="/about"
          element={
            isAuthenticated ? <About /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/grammar-checker"
          element={
            isAuthenticated ? <GrammarChecker /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/article-reader"
          element={
            isAuthenticated ? <ArticleReader /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/pdf-uploader"
          element={
            isAuthenticated ? <PdfUploader /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/text-summarizer"
          element={
            isAuthenticated ? <TextSummarizer /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/realtime-editor"
          element={
            isAuthenticated ? (
              <ResearchEditor docId="sample-document" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/citation-generator"
          element={
            isAuthenticated ? <CitationGenerator /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/chatbot"
          element={
            isAuthenticated ? <Chatbot /> : <Navigate to="/login" />
          }
        />
        <Route
    path="/buy"
    element={
      isAuthenticated ? <Buy /> : <Navigate to="/login" />
    }
  />
      </Routes>
    </>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated.toString());
  }, [isAuthenticated]);

  return (
    <Router>
      <AppRoutes
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
    </Router>
  );
}

export default App;
