import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const PageLoadingBar: React.FC = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setProgress(10);
    setIsVisible(true);

    const timer1 = setTimeout(() => setProgress(40), 100);
    const timer2 = setTimeout(() => setProgress(75), 500);
    const timer3 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setIsVisible(false), 300);
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [location]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 z-[100]"
    >
      <motion.div
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
      />
    </motion.div>
  );
};

export default PageLoadingBar;
