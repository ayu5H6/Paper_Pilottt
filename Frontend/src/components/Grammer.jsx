import React, { useState } from 'react';

const GrammarChecker = () => {
  const [text, setText] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const checkGrammar = async () => {
    if (!text.trim()) {
      alert('Please enter some text.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `text=${encodeURIComponent(text)}&language=en-US`,
      });
      const data = await response.json();
      setResults(data.matches || []);
    } catch (error) {
      console.error('Error checking grammar:', error);
      alert('An error occurred while checking grammar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Grammar and Spell Checker</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="10"
        cols="50"
        placeholder="Enter your text here..."
        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
      />
      <br />
      <button
        onClick={checkGrammar}
        disabled={loading}
        style={{ marginTop: '10px', padding: '10px 20px', fontSize: '16px' }}
      >
        {loading ? 'Checking...' : 'Check Grammar'}
      </button>

      {results.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h2>Errors and Suggestions:</h2>
          <ul>
            {results.map((match, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                <strong>Error:</strong> {match.message}
                <br />
                <strong>Suggested Fix:</strong>{' '}
                {match.replacements.map((rep) => rep.value).join(', ')}
                <br />
                <strong>Context:</strong> "{match.context.text}"
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GrammarChecker;