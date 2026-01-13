import { useState, useEffect } from 'react';

export type OSType = 'iOS' | 'Android' | 'macOS' | 'Windows' | 'Linux' | 'unknown';

const detectOS = (): OSType => {
  if (typeof window === 'undefined') return 'unknown';

  const ua = navigator.userAgent.toLowerCase();

  if (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1) return 'iOS';
  if (ua.indexOf('android') > -1) return 'Android';
  if (ua.indexOf('mac') > -1) return 'macOS';
  if (ua.indexOf('win') > -1) return 'Windows';
  if (ua.indexOf('linux') > -1 && ua.indexOf('android') === -1) return 'Linux';

  return 'unknown';
};

export const useOS = (): OSType => {
  const [os, setOS] = useState<OSType>('unknown');

  useEffect(() => {
    setOS(detectOS());
  }, []);

  return os;
};

export const useIsIOS = (): boolean => {
  const os = useOS();
  return os === 'iOS';
};

export const useIsAndroid = (): boolean => {
  const os = useOS();
  return os === 'Android';
};

export const useIsMacOS = (): boolean => {
  const os = useOS();
  return os === 'macOS';
};

export const useIsWindows = (): boolean => {
  const os = useOS();
  return os === 'Windows';
};

export const useIsLinux = (): boolean => {
  const os = useOS();
  return os === 'Linux';
};

export const useIsTouchDevice = (): boolean => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const isTouchDevice = () => {
      return (
        typeof window !== 'undefined' &&
        ('ontouchstart' in window ||
          navigator.maxTouchPoints > 0 ||
          (navigator as any).msMaxTouchPoints > 0)
      );
    };

    setIsTouch(isTouchDevice());
  }, []);

  return isTouch;
};
