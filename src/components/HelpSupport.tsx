import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HelpItem {
  q: string;
  a: string;
}

const HelpSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'faq' | 'contact'>('faq');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [formData, setFormData] = useState({ email: '', subject: '', message: '' });

  const faqs: HelpItem[] = [
    {
      q: 'How do I upload a medical image?',
      a: 'Go to the Upload page, drag and drop your image or click to select. Supported formats include DICOM, JPEG, PNG, and TIFF.',
    },
    {
      q: 'What is the maximum file size?',
      a: 'Standard formats (JPEG, PNG, TIFF) can be up to 50MB. DICOM files can be up to 500MB.',
    },
    {
      q: 'How long does analysis take?',
      a: 'Most analyses complete within 30-60 seconds. You can check the progress on the Results page.',
    },
    {
      q: 'Can I export my results?',
      a: 'Yes! You can export individual analyses as PDF or your entire history as CSV from the History page.',
    },
    {
      q: 'Is my data secure?',
      a: 'All data is encrypted in transit and at rest. We comply with HIPAA and GDPR regulations.',
    },
    {
      q: 'How do I delete my account?',
      a: 'Go to Settings > Account Settings and click "Delete Account". This action is permanent.',
    },
  ];

  return (
    <>
      {/* Floating Help Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition flex items-center justify-center z-40"
        aria-label="Open help"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </motion.button>

      {/* Help Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between bg-white dark:bg-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Help & Support</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700 flex">
                <button
                  onClick={() => setActiveTab('faq')}
                  className={`flex-1 px-6 py-3 font-medium transition ${
                    activeTab === 'faq'
                      ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                  }`}
                >
                  FAQs
                </button>
                <button
                  onClick={() => setActiveTab('contact')}
                  className={`flex-1 px-6 py-3 font-medium transition ${
                    activeTab === 'contact'
                      ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                  }`}
                >
                  Contact Us
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeTab === 'faq' ? (
                  <div className="space-y-3">
                    {faqs.map((faq, idx) => (
                      <details
                        key={idx}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer group"
                        onToggle={(e) => setExpandedFAQ(e.currentTarget.open ? idx : null)}
                      >
                        <summary className="font-medium text-gray-900 dark:text-white flex items-center justify-between select-none">
                          {faq.q}
                          <svg
                            className={`w-5 h-5 transition transform ${expandedFAQ === idx ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </summary>
                        <p className="text-gray-600 dark:text-gray-400 mt-3">{faq.a}</p>
                      </details>
                    ))}
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert('Thank you for contacting us! We\'ll get back to you soon.');
                      setFormData({ email: '', subject: '', message: '' });
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Message
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                        required
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>

              {/* Quick Links */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quick Links:</p>
                <div className="flex gap-4 flex-wrap">
                  <a href="/documentation" className="text-primary-600 dark:text-primary-400 hover:underline text-sm">
                    Documentation
                  </a>
                  <a href="mailto:support@max.ai" className="text-primary-600 dark:text-primary-400 hover:underline text-sm">
                    Email Support
                  </a>
                  <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline text-sm">
                    Status Page
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HelpSupport;
