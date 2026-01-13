import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'laptop' | 'desktop';

const getDeviceType = (width: number): DeviceType => {
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  if (width < 1440) return 'laptop';
  return 'desktop';
};

export const useDeviceType = (): DeviceType => {
  const [device, setDevice] = useState<DeviceType>(() => {
    if (typeof window === 'undefined') return 'laptop';
    return getDeviceType(window.innerWidth);
  });

  useEffect(() => {
    const handleResize = () => {
      setDevice(getDeviceType(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return device;
};

export const useIsTabletOrSmaller = (): boolean => {
  const deviceType = useDeviceType();
  return deviceType === 'mobile' || deviceType === 'tablet';
};

export const useIsMobile = (): boolean => {
  const deviceType = useDeviceType();
  return deviceType === 'mobile';
};

export const useIsTablet = (): boolean => {
  const deviceType = useDeviceType();
  return deviceType === 'tablet';
};

export const useIsDesktop = (): boolean => {
  const deviceType = useDeviceType();
  return deviceType === 'laptop' || deviceType === 'desktop';
};
