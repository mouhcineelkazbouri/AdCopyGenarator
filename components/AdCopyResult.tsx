
import React, { useState, useEffect } from 'react';

interface AdCopyResultProps {
  text: string;
  maxLength: number;
  label: string;
}

const AdCopyResult: React.FC<AdCopyResultProps> = ({ text, maxLength, label }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const lengthColor = text.length > maxLength ? 'text-red-500' : 'text-gray-400';

  return (
    <div className="group flex items-center justify-between p-3 bg-slate-50 rounded-md border border-slate-200 hover:bg-slate-100 transition-colors">
      <div>
        <p className="text-sm font-semibold text-slate-500 mb-1">{label}</p>
        <p className="text-slate-800">{text}</p>
      </div>
      <div className="flex items-center space-x-3">
        <span className={`text-xs font-mono ${lengthColor}`}>
          {text.length}/{maxLength}
        </span>
        <button
          onClick={handleCopy}
          className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
            isCopied
              ? 'bg-green-100 text-green-700'
              : 'bg-slate-200 text-slate-600 group-hover:bg-blue-500 group-hover:text-white'
          }`}
        >
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
};

export default AdCopyResult;
