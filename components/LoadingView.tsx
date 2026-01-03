
import React, { useState, useEffect } from 'react';

const LoadingView: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "Interpreting your brand vision...",
    "Drafting minimalist silhouettes...",
    "Perfecting geometric balance...",
    "Synthesizing high-contrast vectors...",
    "Almost ready..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-20 animate-in fade-in duration-700">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-white/10 rounded-full animate-spin border-t-indigo-500"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <i className="fa-solid fa-wand-magic-sparkles text-xl text-indigo-400"></i>
        </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-heading font-semibold text-white">
          {messages[messageIndex]}
        </h3>
        <p className="text-gray-500 text-sm italic">Fast generative design in progress.</p>
      </div>
    </div>
  );
};

export default LoadingView;
