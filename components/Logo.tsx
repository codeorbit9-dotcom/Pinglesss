import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl',
    xl: 'w-20 h-20 rounded-[2rem]'
  };

  return (
    <div className={`${sizes[size]} bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-2xl shadow-indigo-600/30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 overflow-hidden relative ${className}`}>
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
      
      {/* Vector Shield + P Icon */}
      <svg viewBox="0 0 32 32" className="w-3/5 h-3/5 relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M9 7h8.5a6.5 6.5 0 0 1 0 13H13v5H9V7zm4 6h4.5a2.5 2.5 0 1 0 0-5H13v5z" 
          fill="white" 
          fillRule="evenodd"
          clipRule="evenodd"
        />
        <path 
          d="M16 2L28 7v7c0 7.73-5.12 14.94-12 17-6.88-2.06-12-9.27-12-17V7l12-5z" 
          stroke="white" 
          strokeWidth="1.5" 
          strokeOpacity="0.25"
          fill="none" 
        />
      </svg>
    </div>
  );
};

export default Logo;