import { useState, useEffect } from 'react';

export type NetworkType = '4g' | '3g' | '2g' | 'slow-2g' | 'unknown';
export type OrientationType = 'portrait' | 'landscape';

export const useNetworkSpeed = (): NetworkType => {
  const [networkType, setNetworkType] = useState<NetworkType>('unknown');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

    if (!connection) {
      setNetworkType('unknown');
      return;
    }

    const updateNetworkType = () => {
      const effectiveType = connection.effectiveType;
      setNetworkType(effectiveType as NetworkType);
    };

    updateNetworkType();
    connection.addEventListener('change', updateNetworkType);

    return () => connection.removeEventListener('change', updateNetworkType);
  }, []);

  return networkType;
};

export const useIsSlowConnection = (): boolean => {
  const networkType = useNetworkSpeed();
  return networkType === '2g' || networkType === 'slow-2g' || networkType === '3g';
};

export const useOrientation = (): OrientationType => {
  const [orientation, setOrientation] = useState<OrientationType>(() => {
    if (typeof window === 'undefined') return 'portrait';
    return window.innerHeight >= window.innerWidth ? 'portrait' : 'landscape';
  });

  useEffect(() => {
    const handleOrientationChange = () => {
      const newOrientation = window.innerHeight >= window.innerWidth ? 'portrait' : 'landscape';
      setOrientation(newOrientation);
    };

    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return orientation;
};

export const useIsPortrait = (): boolean => {
  const orientation = useOrientation();
  return orientation === 'portrait';
};

export const useIsLandscape = (): boolean => {
  const orientation = useOrientation();
  return orientation === 'landscape';
};
