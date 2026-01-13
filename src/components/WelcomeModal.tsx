import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const WelcomeModal: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const hasSeenWelcome = localStorage.getItem(`medaix_welcome_${currentUser.id}`);
      if (!hasSeenWelcome) {
        setShowWelcome(true);
      }
    }
  }, [isAuthenticated, currentUser]);

  const steps = [
    {
      title: 'Welcome to MedAIx',
      description: 'Your AI-powered medical image analysis platform',
      icon: '👋',
      highlight: 'Upload. Analyze. Discover.',
    },
    {
      title: 'Upload Medical Images',
      description: 'Drag and drop DICOM, X-ray, CT, and MRI images for instant analysis',
      icon: '📤',
      highlight: 'Supports up to 500MB DICOM files',
    },
    {
      title: 'Get Instant Insights',
      description: 'Our AI provides detailed analysis, confidence scores, and differential diagnoses',
      icon: '✨',
      highlight: 'Results in 30-60 seconds',
    },
    {
      title: 'Track Your History',
      description: 'All analyses are saved for future reference. Export as PDF or CSV anytime',
      icon: '📊',
      highlight: 'Organize and manage your data',
    },
  ];

  const handleClose = () => {
    if (currentUser) {
      localStorage.setItem(`medaix_welcome_${currentUser.id}`, 'true');
    }
    setShowWelcome(false);
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  return (
    <AnimatePresence>
      {showWelcome && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-8 space-y-6"
          >
            {/* Progress Indicator */}
            <div className="flex gap-2 justify-center">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 w-2 rounded-full transition-all ${
                    idx === step ? 'bg-primary-600 w-8' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            <div className="text-center">
              <div className="text-5xl mb-4">{steps[step].icon}</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {steps[step].title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {steps[step].description}
              </p>
              <div className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm rounded-full">
                {steps[step].highlight}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Skip Tour
              </button>
              <button
                onClick={handleNext}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                {step === steps.length - 1 ? 'Get Started' : 'Next'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeModal;
