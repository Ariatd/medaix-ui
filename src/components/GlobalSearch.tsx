import React, { useState, useEffect, useRef } from 'react';
import { formatPercent } from '../utils/confidenceUtils';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  id: string;
  title: string;
  category: 'analysis' | 'documentation' | 'settings';
  description: string;
  path?: string;
}

const GlobalSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();

    // Search in analyses
    const analyses = localStorage.getItem('medaix_analyses');
    const analysisResults: SearchResult[] = [];
    if (analyses) {
      JSON.parse(analyses).forEach((analysis: any, idx: number) => {
        if (
          analysis.result?.toLowerCase().includes(term) ||
          analysis.imageName?.toLowerCase().includes(term) ||
          analysis.region?.toLowerCase().includes(term)
        ) {
          analysisResults.push({
            id: analysis.id || idx.toString(),
            title: analysis.imageName || `Analysis ${idx + 1}`,
            category: 'analysis',
            description: `Result: ${analysis.result} (${formatPercent(analysis.results?.overallConfidence ?? analysis.confidence)})`,
            path: `/results/${analysis.id}`,
          });
        }
      });
    }

    // Search in documentation
    const docResults: SearchResult[] = [];
    const docSections = [
      {
        id: 'getting-started',
        title: 'Getting Started',
        content: 'System Requirements Account Creation',
      },
      {
        id: 'how-to-use',
        title: 'How to Use',
        content: 'Uploading Images Viewing Results History',
      },
      { id: 'supported-formats', title: 'Supported Formats', content: 'DICOM JPEG PNG TIFF' },
      {
        id: 'understanding-results',
        title: 'Understanding Results',
        content: 'Confidence Score Heatmap Differential Diagnosis',
      },
      {
        id: 'api-documentation',
        title: 'API Documentation',
        content: 'Authentication Upload Image Get Results',
      },
      { id: 'faqs', title: 'FAQs', content: 'Analysis Time Data Security Export Results' },
      { id: 'contact-support', title: 'Contact Support', content: 'Email Chat Bug Reports' },
    ];

    docSections.forEach((section) => {
      if (section.title.toLowerCase().includes(term) || section.content.toLowerCase().includes(term)) {
        docResults.push({
          id: section.id,
          title: section.title,
          category: 'documentation',
          description: `Documentation - ${section.title}`,
          path: `/documentation#${section.id}`,
        });
      }
    });

    // Search in settings
    const settingsResults: SearchResult[] = [];
    const settingsTopics = [
      { id: 'account', title: 'Account Settings', content: 'Profile Avatar Name Email Phone' },
      { id: 'preferences', title: 'Preferences', content: 'Theme Language Notifications' },
      { id: 'privacy', title: 'Privacy & Security', content: '2FA Login History Sessions' },
      { id: 'advanced', title: 'Advanced Settings', content: 'API Key Webhook Debug Mode' },
    ];

    settingsTopics.forEach((topic) => {
      if (topic.title.toLowerCase().includes(term) || topic.content.toLowerCase().includes(term)) {
        settingsResults.push({
          id: topic.id,
          title: topic.title,
          category: 'settings',
          description: `Settings - ${topic.title}`,
          path: `/settings#${topic.id}`,
        });
      }
    });

    setResults([...analysisResults.slice(0, 3), ...docResults.slice(0, 3), ...settingsResults.slice(0, 3)]);
  }, [searchTerm]);

  const handleResultClick = (result: SearchResult) => {
    if (result.path) {
      navigate(result.path);
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'analysis':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'documentation':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'settings':
        return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
        title="Press Cmd+K to search"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline text-xs text-gray-400">⌘K</span>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl"
            >
              {/* Search Input */}
              <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                <div className="relative flex items-center">
                  <svg className="absolute left-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    autoFocus
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search analyses, documentation, settings..."
                    className="w-full pl-10 pr-10 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className="absolute right-3 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition"
                    aria-label="Close search"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {searchTerm.trim() === '' ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <p className="text-sm">Start typing to search...</p>
                    <p className="text-xs mt-2">Press ESC to close</p>
                  </div>
                ) : results.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <p>No results found for "{searchTerm}"</p>
                  </div>
                ) : (
                  <motion.div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {results.map((result, idx) => (
                      <motion.button
                        key={`${result.category}-${result.id}`}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        onClick={() => {
                          handleResultClick(result);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-start gap-3"
                      >
                        <div className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(result.category)}`}>
                          {result.category.charAt(0).toUpperCase() + result.category.slice(1)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">{result.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{result.description}</p>
                        </div>
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-900 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Press ESC to close</span>
                <span>Enter to select</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalSearch;
