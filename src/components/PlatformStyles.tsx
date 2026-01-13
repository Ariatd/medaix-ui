import React from 'react';
import usePlatform from '../hooks/usePlatform';
import '../styles/platform-scrollbars.css';

interface PlatformStylesProps {
  children: React.ReactNode;
}

/**
 * Applies platform-specific font families and visual styles
 * - iOS: San Francisco
 * - Android: Roboto
 * - macOS: San Francisco Pro
 * - Windows: Segoe UI
 * - Linux: System default
 */
export const PlatformStyles: React.FC<PlatformStylesProps> = ({ children }) => {
  const platform = usePlatform();

  const platformFont = 'font-sans';

  const base = platform.deviceType === 'mobile' ? 'platform-mobile' : platform.isMac ? 'platform-macos' : platform.isWindows ? 'platform-windows' : 'platform-linux';
  const scrollbarClass = `platform-scrollbar ${platform.isMac ? 'macos' : platform.isWindows ? 'windows' : ''}`;

  return (
    <div className={`${platformFont} ${base} ${scrollbarClass}`}>
      {children}
    </div>
  );
};

export default PlatformStyles;
