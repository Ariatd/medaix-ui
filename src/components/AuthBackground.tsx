import React from 'react';

interface AuthBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const AuthBackground: React.FC<AuthBackgroundProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}>
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0C1A2A] via-[#1a2842] to-[#2D7FF9]/20 dark:from-[#0C1A2A] dark:via-[#1a2842] dark:to-[#2D7FF9]/10" />
      
      {/* Medical-themed Background Pattern */}
      <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.12]">
        {/* Subtle medical pattern using CSS */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(45, 127, 249, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(45, 127, 249, 0.08) 0%, transparent 50%),
              linear-gradient(45deg, transparent 40%, rgba(45, 127, 249, 0.03) 50%, transparent 60%)
            `,
            backgroundSize: '120px 120px, 80px 80px, 40px 40px',
            filter: 'blur(1px)'
          }}
        />
        
        {/* Subtle medical cross patterns */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="grid grid-cols-8 gap-8 h-full w-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="flex items-center justify-center">
                <div className="w-2 h-2 bg-[#2D7FF9] rounded-full opacity-30" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle animated particles for depth */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#2D7FF9]/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}

      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[450px] mx-auto px-4 sm:px-6 py-6 sm:py-12 auth-container">
        {children}
      </div>
    </div>
  );
};

export default AuthBackground;
