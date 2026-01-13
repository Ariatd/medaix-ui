import { useToast } from '../context/ToastContext';
import usePlatform from '../hooks/usePlatform';

export const useClipboardFeedback = () => {
  const { addToast } = useToast();
  const platform = usePlatform();

  const copied = (label = 'Copied') => {
    if (platform.isMac) {
      addToast(`${label}! (⌘V to paste)`, 'success');
    } else if (platform.isWindows) {
      addToast(`${label}! (Ctrl+V to paste)`, 'success');
    } else if (platform.deviceType === 'mobile') {
      addToast('Copied to clipboard', 'success');
    } else {
      addToast(`${label}! (Ctrl+V to paste)`, 'success');
    }
  };

  return { copied };
};

export default useClipboardFeedback;
