import { useEffect, useMemo, useState } from 'react';

type OS = 'macos' | 'windows' | 'linux' | 'ios' | 'android' | 'unknown';
type DeviceType = 'desktop' | 'tablet' | 'mobile';
type KeyboardLayout = 'qwerty' | 'azerty' | 'qwertz' | 'other';

export const usePlatform = () => {
  const [isTouch, setIsTouch] = useState<boolean>(false);

  useEffect(() => {
    const touch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    setIsTouch(!!touch);
  }, []);

  const ua = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
  const platform = typeof navigator !== 'undefined' ? (navigator.platform || '').toLowerCase() : '';

  const os: OS = useMemo(() => {
    if (/iphone|ipad|ipod/.test(ua)) return 'ios';
    if (/android/.test(ua)) return 'android';
    if (/mac/.test(platform) || /macintosh/.test(ua)) return 'macos';
    if (/win/.test(platform) || /windows/.test(ua)) return 'windows';
    if (/linux/.test(platform)) return 'linux';
    return 'unknown';
  }, [ua, platform]);

  const browser = useMemo(() => {
    if (/edg\//.test(ua)) return 'edge';
    if (/chrome\//.test(ua) && !/edg\//.test(ua)) return 'chrome';
    if (/safari/.test(ua) && !/chrome\//.test(ua)) return 'safari';
    if (/firefox\//.test(ua)) return 'firefox';
    return 'unknown';
  }, [ua]);

  const deviceType: DeviceType = useMemo(() => {
    if (isTouch && /mobile|android|iphone|ipod/.test(ua)) return 'mobile';
    if (isTouch && (Math.max(window.innerWidth, window.innerHeight) <= 900)) return 'tablet';
    return 'desktop';
  }, [isTouch, ua]);

  const isMac = os === 'macos' || os === 'ios';
  const isWindows = os === 'windows';

  const modifierKey = isMac ? '⌘' : 'Ctrl';

  const language = (typeof navigator !== 'undefined' && navigator.language) ? navigator.language : 'en-US';

  const keyboardLayout: KeyboardLayout = useMemo(() => {
    const lang = language.toLowerCase();
    if (lang.startsWith('fr')) return 'azerty';
    if (lang.startsWith('de')) return 'qwertz';
    if (lang.startsWith('tr')) return 'qwerty';
    return 'qwerty';
  }, [language]);

  return {
    os,
    browser,
    deviceType,
    isMac,
    isWindows,
    isTouch,
    modifierKey,
    language,
    keyboardLayout,
  } as const;
};

export default usePlatform;
