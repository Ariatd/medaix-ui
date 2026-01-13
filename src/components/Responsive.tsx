import { useDeviceType, useIsMobile, useIsTablet, useIsDesktop } from '../hooks/useDeviceType';
import { useOS } from '../hooks/useOS';

interface ResponsiveProps {
  children: React.ReactNode;
  className?: string;
}

interface DeviceSpecificProps {
  children: React.ReactNode;
}

interface PlatformWrapperProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Show content only on mobile devices
 */
export const MobileOnly: React.FC<DeviceSpecificProps> = ({ children }) => {
  const isMobile = useIsMobile();
  return isMobile ? <>{children}</> : null;
};

/**
 * Show content only on tablet devices
 */
export const TabletOnly: React.FC<DeviceSpecificProps> = ({ children }) => {
  const isTablet = useIsTablet();
  return isTablet ? <>{children}</> : null;
};

/**
 * Show content only on desktop devices
 */
export const DesktopOnly: React.FC<DeviceSpecificProps> = ({ children }) => {
  const isDesktop = useIsDesktop();
  return isDesktop ? <>{children}</> : null;
};

/**
 * Show content on mobile and tablet only (hide on desktop)
 */
export const TabletOrSmaller: React.FC<DeviceSpecificProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  return isMobile || isTablet ? <>{children}</> : null;
};

/**
 * Platform-specific wrapper for OS-specific styling and behavior
 */
export const PlatformWrapper: React.FC<PlatformWrapperProps> = ({ children, className = '' }) => {
  const os = useOS();

  const platformClasses = {
    iOS: 'platform-ios',
    Android: 'platform-android',
    macOS: 'platform-macos',
    Windows: 'platform-windows',
    Linux: 'platform-linux',
    unknown: 'platform-unknown',
  };

  return (
    <div className={`${platformClasses[os]} ${className}`}>
      {children}
    </div>
  );
};

/**
 * Responsive container with device-aware padding and max-width
 */
interface ResponsiveContainerProps extends ResponsiveProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'compact' | 'normal' | 'spacious';
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  maxWidth = 'lg',
  padding = 'normal',
}) => {
  const deviceType = useDeviceType();

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'w-full',
  };

  // Compact padding on mobile, normal on tablet, spacious on desktop
  const paddingClasses = {
    compact: {
      mobile: 'px-3 py-2',
      tablet: 'px-4 py-3',
      desktop: 'px-6 py-4',
    },
    normal: {
      mobile: 'px-4 py-3',
      tablet: 'px-6 py-4',
      desktop: 'px-8 py-6',
    },
    spacious: {
      mobile: 'px-4 py-4',
      tablet: 'px-8 py-6',
      desktop: 'px-12 py-8',
    },
  };

  const getPadding = () => {
    if (deviceType === 'mobile') return paddingClasses[padding].mobile;
    if (deviceType === 'tablet') return paddingClasses[padding].tablet;
    return paddingClasses[padding].desktop;
  };

  return (
    <div className={`mx-auto w-full ${maxWidthClasses[maxWidth]} ${getPadding()} ${className}`}>
      {children}
    </div>
  );
};

/**
 * Grid that adapts columns based on device
 */
interface ResponsiveGridProps extends ResponsiveProps {
  /**
   * Number of columns: {mobile, tablet, desktop}
   */
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'xs' | 'sm' | 'md' | 'lg';
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className = '',
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
}) => {
  const deviceType = useDeviceType();

  const getColumns = () => {
    if (deviceType === 'mobile') return cols.mobile || 1;
    if (deviceType === 'tablet') return cols.tablet || 2;
    return cols.desktop || 3;
  };

  const gapClasses = {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const columnCount = getColumns();
  const gridColsClass = `grid-cols-${columnCount}`;

  return (
    <div className={`grid ${gridColsClass} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

/**
 * Stack component that changes direction based on device
 */
interface ResponsiveStackProps extends ResponsiveProps {
  direction?: 'vertical' | 'horizontal' | 'auto';
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export const ResponsiveStack: React.FC<ResponsiveStackProps> = ({
  children,
  className = '',
  direction = 'auto',
  gap = 'md',
  align = 'start',
}) => {
  const deviceType = useDeviceType();

  const getDirection = () => {
    if (direction !== 'auto') return direction;
    return deviceType === 'mobile' ? 'vertical' : 'horizontal';
  };

  const gapClasses = {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const dir = getDirection();
  const flexDir = dir === 'vertical' ? 'flex-col' : 'flex-row';

  return (
    <div className={`flex ${flexDir} ${gapClasses[gap]} ${alignClasses[align]} ${className}`}>
      {children}
    </div>
  );
};
