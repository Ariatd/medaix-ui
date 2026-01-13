import React from 'react';

export interface LogoProps {
  size?: 'small' | 'medium' | 'large' | number; // size in px or preset
  variant?: 'option-a' | 'option-b' | 'option-c'; // design option
  animated?: boolean;
  dark?: boolean;
  monochrome?: boolean;
  className?: string;
}

// Helper to get size in pixels with responsive scaling
const getSizeInPx = (size?: 'small' | 'medium' | 'large' | number): number => {
  if (typeof size === 'number') return size;
  switch (size) {
    case 'small':
      return 24; // 24px for mobile
    case 'large':
      return 256;
    default: // medium - now larger for navbar
      return 48; // 48px for header (was 32px)
  }
};

// OPTION A: Medical Cross + Technology (Updated with darker colors and bolder design)
const LogoOptionA: React.FC<LogoProps> = ({ animated, dark, monochrome, size = 'medium' }) => {
  const px = getSizeInPx(size);

  const colors = monochrome
    ? { primary: '#000000', secondary: '#333333', accent: '#666666' }
    : dark
    ? { primary: '#0B2E6F', secondary: '#1a4fb8', accent: '#2d5fd6' }
    : { primary: '#0B2E6F', secondary: '#1a4fb8', accent: '#2d5fd6' };

  return (
    <svg
      viewBox="0 0 64 64"
      width={px}
      height={px}
      xmlns="http://www.w3.org/2000/svg"
      className={animated ? 'animate-pulse' : ''}
    >
      <defs>
        <linearGradient id="medaixGradientA" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="100%" stopColor={colors.secondary} />
        </linearGradient>
        <style>{`
          @keyframes pulse-glow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          .logo-pulse { animation: pulse-glow 2s infinite; }
        `}</style>
      </defs>

      {/* Background circle */}
      <circle cx="32" cy="32" r="30" fill="none" stroke={colors.primary} strokeWidth="0.5" opacity="0.2" />

      {/* Circuit board pattern (subtle) */}
      <g opacity="0.15" stroke={colors.secondary} strokeWidth="0.8" fill="none">
        <line x1="12" y1="32" x2="20" y2="32" />
        <line x1="20" y1="32" x2="20" y2="24" />
        <line x1="20" y1="24" x2="28" y2="24" />
        <line x1="44" y1="32" x2="52" y2="32" />
        <line x1="44" y1="32" x2="44" y2="40" />
        <line x1="44" y1="40" x2="36" y2="40" />
        <circle cx="20" cy="32" r="1.5" fill={colors.secondary} />
        <circle cx="44" cy="32" r="1.5" fill={colors.secondary} />
      </g>

      {/* M - Left side (BOLDER) */}
      <text
        x="18"
        y="38"
        fontSize="32"
        fontFamily="Poppins, Arial, sans-serif"
        fontWeight="900"
        fill={colors.primary}
        textAnchor="middle"
      >
        M
      </text>

      {/* Medical Cross - Center (BOLDER) */}
      <g className={animated ? 'logo-pulse' : ''}>
        {/* Vertical line of cross */}
        <line x1="32" y1="16" x2="32" y2="48" stroke={colors.primary} strokeWidth="4" strokeLinecap="round" />
        {/* Horizontal line of cross */}
        <line x1="18" y1="32" x2="46" y2="32" stroke={colors.primary} strokeWidth="4" strokeLinecap="round" />
        {/* Circle around cross */}
        <circle cx="32" cy="32" r="18" fill="none" stroke={colors.secondary} strokeWidth="2" opacity="0.5" />
      </g>

      {/* X - Right side (BOLDER) */}
      <text
        x="46"
        y="38"
        fontSize="32"
        fontFamily="Poppins, Arial, sans-serif"
        fontWeight="900"
        fill={colors.primary}
        textAnchor="middle"
      >
        X
      </text>

      {/* Subtle glow effect (animated) */}
      {animated && (
        <circle
          cx="32"
          cy="32"
          r="30"
          fill="none"
          stroke={colors.primary}
          strokeWidth="1"
          opacity="0.3"
          style={{
            animation: 'glow 3s infinite',
          }}
        />
      )}

      <style>{`
        @keyframes glow {
          0%, 100% { r: 28px; opacity: 0; }
          50% { r: 32px; opacity: 0.3; }
        }
      `}</style>
    </svg>
  );
};

// OPTION B: DNA Helix (Updated colors)
const LogoOptionB: React.FC<LogoProps> = ({ animated, dark, monochrome, size = 'medium' }) => {
  const px = getSizeInPx(size);

  const colors = monochrome
    ? { primary: '#000000', secondary: '#333333', accent: '#666666' }
    : dark
    ? { primary: '#0B2E6F', secondary: '#1a4fb8', accent: '#2d5fd6' }
    : { primary: '#0B2E6F', secondary: '#1a4fb8', accent: '#2d5fd6' };

  return (
    <svg
      viewBox="0 0 64 64"
      width={px}
      height={px}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="medaixGradientB" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="100%" stopColor={colors.secondary} />
        </linearGradient>
        <style>{`
          @keyframes helix-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
          .helix-strand { animation: ${animated ? 'helix-pulse 2s infinite' : 'none'}; }
        `}</style>
      </defs>

      {/* Left helix strand (M) */}
      <path
        d="M 18 16 Q 22 20 18 28 Q 14 36 18 44 Q 22 52 18 56"
        fill="none"
        stroke={colors.primary}
        strokeWidth="3"
        strokeLinecap="round"
        className="helix-strand"
      />

      {/* Right helix strand (X) */}
      <path
        d="M 46 16 Q 50 20 46 28 Q 42 36 46 44 Q 50 52 46 56"
        fill="none"
        stroke={colors.secondary}
        strokeWidth="3"
        strokeLinecap="round"
        className="helix-strand"
        style={{ animationDelay: '0.3s' }}
      />

      {/* Connecting strands */}
      <g opacity="0.6" stroke={colors.accent} strokeWidth="1.5" fill="none">
        <line x1="18" y1="20" x2="46" y2="28" />
        <line x1="18" y1="32" x2="46" y2="32" />
        <line x1="18" y1="44" x2="46" y2="36" />
      </g>

      {/* Center A */}
      <text
        x="32"
        y="38"
        fontSize="24"
        fontFamily="Poppins, Arial, sans-serif"
        fontWeight="700"
        fill={colors.primary}
        textAnchor="middle"
      >
        A
      </text>

      {/* M text */}
      <text
        x="18"
        y="62"
        fontSize="12"
        fontFamily="Poppins, Arial, sans-serif"
        fontWeight="400"
        fill={colors.primary}
        textAnchor="middle"
        opacity="0.7"
      >
        M
      </text>

      {/* X text */}
      <text
        x="46"
        y="62"
        fontSize="12"
        fontFamily="Poppins, Arial, sans-serif"
        fontWeight="400"
        fill={colors.secondary}
        textAnchor="middle"
        opacity="0.7"
      >
        X
      </text>

      {/* Decorative circles */}
      {animated && (
        <>
          <circle cx="18" cy="20" r="1.5" fill={colors.primary} opacity="0.5" style={{ animation: 'pulse 2s infinite' }} />
          <circle cx="46" cy="28" r="1.5" fill={colors.secondary} opacity="0.5" style={{ animation: 'pulse 2s infinite 0.3s' }} />
        </>
      )}
    </svg>
  );
};

// OPTION C: Brain + Circuit (Updated colors)
const LogoOptionC: React.FC<LogoProps> = ({ animated, dark, monochrome, size = 'medium' }) => {
  const px = getSizeInPx(size);

  const colors = monochrome
    ? { primary: '#000000', secondary: '#333333', accent: '#666666', light: '#CCCCCC' }
    : dark
    ? { primary: '#0B2E6F', secondary: '#1a4fb8', accent: '#2d5fd6', light: '#003366' }
    : { primary: '#0B2E6F', secondary: '#1a4fb8', accent: '#2d5fd6', light: '#E6F2FF' };

  return (
    <svg
      viewBox="0 0 64 64"
      width={px}
      height={px}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="medaixGradientC" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="100%" stopColor={colors.secondary} />
        </linearGradient>
        <style>{`
          @keyframes circuit-flow {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
          .circuit-line { animation: ${animated ? 'circuit-flow 3s infinite' : 'none'}; }
        `}</style>
      </defs>

      {/* Background light circle */}
      <circle cx="32" cy="32" r="28" fill={colors.light} opacity="0.2" />

      {/* Brain shape (simplified) */}
      <g opacity="0.3" stroke={colors.primary} strokeWidth="1.5" fill="none">
        {/* Brain outline */}
        <path d="M 24 32 Q 20 26 20 20 Q 20 16 24 14 Q 28 12 32 12 Q 36 12 40 14 Q 44 16 44 20 Q 44 26 40 32" />
        <path d="M 24 32 Q 20 38 20 44 Q 20 48 24 50 Q 28 52 32 52 Q 36 52 40 50 Q 44 48 44 44 Q 44 38 40 32" />
      </g>

      {/* Circuit paths */}
      <g className="circuit-line" stroke={colors.secondary} strokeWidth="1.5" fill="none" strokeLinecap="round">
        {/* Top left path */}
        <path d="M 18 28 L 24 28 L 24 24" />
        {/* Top right path */}
        <path d="M 46 28 L 40 28 L 40 24" />
        {/* Bottom left path */}
        <path d="M 18 36 L 24 36 L 24 40" />
        {/* Bottom right path */}
        <path d="M 46 36 L 40 36 L 40 40" />
      </g>

      {/* MAX Text with circuit dots */}
      <text
        x="32"
        y="37"
        fontSize="20"
        fontFamily="Poppins, Arial, sans-serif"
        fontWeight="700"
        fill={colors.primary}
        textAnchor="middle"
      >
        MAX
      </text>

      {/* Central circuit nodes */}
      {animated && (
        <>
          <circle cx="18" cy="28" r="1" fill={colors.secondary} style={{ animation: 'pulse 2s infinite' }} />
          <circle cx="46" cy="28" r="1" fill={colors.secondary} style={{ animation: 'pulse 2s infinite 0.3s' }} />
          <circle cx="18" cy="36" r="1" fill={colors.secondary} style={{ animation: 'pulse 2s infinite 0.6s' }} />
          <circle cx="46" cy="36" r="1" fill={colors.secondary} style={{ animation: 'pulse 2s infinite 0.9s' }} />
        </>
      )}

      {/* Glow on animation */}
      {animated && (
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke={colors.primary}
          strokeWidth="1"
          opacity="0.2"
          style={{
            animation: 'ring 2s infinite',
          }}
        />
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { r: 1.5px; opacity: 1; }
          50% { r: 2.5px; opacity: 0.5; }
        }
        @keyframes ring {
          0% { r: 24px; opacity: 0.8; }
          100% { r: 32px; opacity: 0; }
        }
      `}</style>
    </svg>
  );
};

// Main Logo Component - Export all options with responsive sizing
const Logo: React.FC<LogoProps> = ({
  size = 'medium',
  variant = 'option-a',
  animated = false,
  dark = false,
  monochrome = false,
  className = '',
}) => {
  const renderLogo = () => {
    switch (variant) {
      case 'option-b':
        return <LogoOptionB size={size} animated={animated} dark={dark} monochrome={monochrome} />;
      case 'option-c':
        return <LogoOptionC size={size} animated={animated} dark={dark} monochrome={monochrome} />;
      default: // option-a
        return <LogoOptionA size={size} animated={animated} dark={dark} monochrome={monochrome} />;
    }
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`} title="MedAIx - Medical Analysis eXpert">
      {renderLogo()}
    </div>
  );
};


// ENHANCED NAVBAR LOGO - Bigger, Bolder, Darker with contrast improvements
export const NavbarLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <Logo 
      size={64} // Increased from 48px to 64px (33% bigger)
      variant="option-a" 
      className={`${className} transition-transform duration-200 hover:scale-105 logo-contrast-enhanced`}
    />
  );
};

// SMALLER NAVBAR LOGO - For when space is limited
export const SmallNavbarLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <Logo 
      size={48} // Still bigger than before but smaller than main navbar
      variant="option-a" 
      className={`${className} transition-transform duration-200 hover:scale-105`}
    />
  );
};

// Logos for all three options (for comparison)
export const AllLogos: React.FC<{ animated?: boolean }> = ({ animated = false }) => (
  <div className="flex items-center justify-center gap-12 p-8">
    <div className="text-center">
      <Logo variant="option-a" size={128} animated={animated} />
      <p className="mt-4 font-semibold text-gray-700">Option A: Medical Cross</p>
    </div>
    <div className="text-center">
      <Logo variant="option-b" size={128} animated={animated} />
      <p className="mt-4 font-semibold text-gray-700">Option B: DNA Helix</p>
    </div>
    <div className="text-center">
      <Logo variant="option-c" size={128} animated={animated} />
      <p className="mt-4 font-semibold text-gray-700">Option C: Brain Circuit</p>
    </div>
  </div>
);

export default Logo;
