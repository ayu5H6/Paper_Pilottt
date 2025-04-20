import React, { useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const PageLoader = () => {
  const [loadingText, setLoadingText] = useState('Loading');
  
  // Animated ellipsis effect
  useEffect(() => {
    const texts = ['Loading', 'Loading.', 'Loading..', 'Loading...'];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % texts.length;
      setLoadingText(texts[currentIndex]);
    }, 400);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-white to-gray-100 flex flex-col items-center justify-center z-50">
      <div className="relative">
        {/* Shadow effect for depth */}
        <div className="absolute inset-0 rounded-full bg-gray-200 opacity-50 blur-md transform scale-110"></div>
        
        {/* Main loader animation */}
        <div className="relative w-40 h-40">
          <DotLottieReact
            src="/loader.lottie"
            autoplay
            loop
            speed={2.5}
          />
        </div>
      </div>
      
      {/* Loading text with animations */}
      <div className="mt-8 flex flex-col items-center">
        <p className="text-xl font-medium text-gray-700">
          {loadingText}
        </p>
        <p className="mt-2 text-sm text-gray-500 max-w-xs text-center transition-opacity duration-1000 opacity-75">
          Preparing your experience
        </p>
        
        {/* Progress bar */}
        <div className="mt-6 w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-yellow-500 rounded-full animate-progress"></div>
        </div>
      </div>
    </div>
  );
};

// Add this to your CSS or tailwind.config.js
// @keyframes progress {
//   0% { width: 0% }
//   50% { width: 70% }
//   100% { width: 100% }
// }
// .animate-progress {
//   animation: progress 2s ease-in-out infinite;
// }

export default PageLoader;