import React, { useState, useEffect } from "react";

const TypewriterText = () => {
  const texts = [
    "AI-powered tools to enhance your academic success.",
    "Streamline your research process with smart features.",
    "Simplify writing with citation, grammar, and summaries.",
  ];

  const [textIndex, setTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeed = isDeleting ? 30 : 60;


  useEffect(() => {
    const currentText = texts[textIndex];

    const timeout = setTimeout(() => {
      const updatedText = isDeleting
        ? currentText.substring(0, displayedText.length - 1)
        : currentText.substring(0, displayedText.length + 1);

      setDisplayedText(updatedText);

      // Start deleting after full text is typed
      if (!isDeleting && updatedText === currentText) {
        setTimeout(() => setIsDeleting(true), 1500); // pause before deleting
      }

      // Move to next text after deletion
      if (isDeleting && updatedText === "") {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, textIndex]);

  return (
    <p className="text-xl md:text-2xl text-pink-700 font-semibold mb-8 max-w-3xl mx-auto">
      {displayedText}
      <span className="border-r-2 border-pink-700 animate-pulse ml-1" />
    </p>
  );
};

export default TypewriterText;
