import usePlatform from '../hooks/usePlatform';

export const getNotificationPositionClass = () => {
  const platform = usePlatform();
  // return a Tailwind class for container positioning
  if (platform.isMac) return 'fixed top-4 right-4 flex flex-col items-end gap-3';
  if (platform.isWindows) return 'fixed bottom-4 right-4 flex flex-col items-end gap-3';
  if (platform.deviceType === 'mobile') return 'fixed top-16 inset-x-0 flex items-center justify-center gap-3';
  // fallback
  return 'fixed top-4 right-4 flex flex-col items-end gap-3';
};

export default getNotificationPositionClass;
