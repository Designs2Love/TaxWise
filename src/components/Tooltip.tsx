import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: React.ReactNode;
  children?: React.ReactNode;
  title?: string;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, title, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span 
      className={`relative inline-flex items-center align-middle group cursor-help ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      tabIndex={0}
      role="tooltip"
      aria-label={typeof content === 'string' ? content : title || 'Information tooltip'}
    >
      {children || <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors shrink-0" />}

      {isVisible && (
        <span 
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 max-w-xs p-3 text-xs leading-relaxed text-slate-200 bg-slate-900/95 border border-slate-700/80 rounded-lg shadow-xl shadow-black/40 backdrop-blur-sm pointer-events-none transition-all duration-150 animate-in fade-in"
        >
          {title && <span className="block font-semibold text-emerald-400 mb-1">{title}</span>}
          <span className="block text-slate-300 font-normal">{content}</span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/95" />
        </span>
      )}
    </span>
  );
};
