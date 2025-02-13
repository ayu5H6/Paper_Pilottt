import { useState } from 'react'
import GrammarChecker from './components/Grammer'
import ArticleReader from './components/ArticleReader'
import PdfUploader from './components/PdfUploader'
import TextSummarizer from './components/TextSummarizer';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <GrammarChecker/>
      <ArticleReader/> 
      <PdfUploader/>
      <TextSummarizer/>
    </>
  );
}

export default App
