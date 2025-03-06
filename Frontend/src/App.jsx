import { useState } from 'react'
import GrammarChecker from './components/Grammer'
import ArticleReader from './components/ArticleReader'
import PdfUploader from './components/PdfUploader'
import TextSummarizer from './components/TextSummarizer';
import RealtimeEditor from './components/RealtimeCollabEditor';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <GrammarChecker/>
      <ArticleReader/> 
      <PdfUploader/>
      <TextSummarizer/> */}

      <div>
        <h1>Research Paper Collaboration</h1>
        <RealtimeEditor docId="sample-document" />
      </div>
    </>
  );
}

export default App
