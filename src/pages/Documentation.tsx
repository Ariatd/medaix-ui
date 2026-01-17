import React, { useState } from 'react';
import Layout from '../components/Layout';

interface DocSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const Documentation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections: DocSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Getting Started with MedAIx</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Welcome to MedAIx, an AI-powered medical image analysis platform. This guide will help you get started in minutes.
          </p>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">System Requirements</h3>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
            <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
            <li>JavaScript enabled</li>
            <li>Stable internet connection</li>
            <li>Minimum 2GB RAM recommended</li>
          </ul>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">Creating Your Account</h3>
          <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-1">
            <li>Click "Sign Up" on the landing page</li>
            <li>Enter your email and create a strong password</li>
            <li>Accept the terms and conditions</li>
            <li>Verify your email address</li>
            <li>Start uploading medical images</li>
          </ol>
        </div>
      ),
    },
    {
      id: 'how-to-use',
      title: 'How to Use',
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How to Use MedAIx</h2>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Uploading Images</h3>
          <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>Navigate to the Upload page from the main menu</li>
            <li>Drag and drop your medical image or click to select</li>
            <li>Wait for the analysis to complete (usually 30-60 seconds)</li>
            <li>Review the results on the Results page</li>
          </ol>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">Viewing Results</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Results include the original image, AI predictions, confidence scores, and a heatmap showing regions of interest. You can adjust the heatmap opacity using the slider.
          </p>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">Accessing Your History</h3>
          <p className="text-gray-700 dark:text-gray-300">
            All your analyses are saved in the History page. You can search, filter by date, result type, and confidence level. Export your data as CSV for further analysis.
          </p>
        </div>
      ),
    },
    {
      id: 'supported-formats',
      title: 'Supported Formats',
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Supported File Formats</h2>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Maximum file size:</strong> 50MB for standard formats, 500MB for DICOM files
            </p>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">Image Formats</h3>
          <ul className="space-y-2">
            {[
              { format: 'DICOM (.dcm)', description: 'Medical imaging standard, full metadata support' },
              { format: 'JPEG (.jpg, .jpeg)', description: 'Compressed format, suitable for X-rays' },
              { format: 'PNG (.png)', description: 'Lossless compression, preserves quality' },
              { format: 'TIFF (.tif, .tiff)', description: 'High-quality format, supports multiple images' },
            ].map((item) => (
              <li key={item.format} className="border-l-4 border-primary-600 pl-4">
                <p className="font-medium text-gray-900 dark:text-white">{item.format}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      id: 'understanding-results',
      title: 'Understanding Results',
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Understanding Analysis Results</h2>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Result Components</h3>
          <div className="space-y-3">
            {[
              { title: 'Original Image', desc: 'Your uploaded medical image displayed at original resolution' },
              { title: 'AI Prediction', desc: 'The primary diagnosis or finding identified by the AI model' },
              { title: 'Confidence Score', desc: 'Percentage indicating the AI\'s confidence in the prediction (0-100%)' },
              { title: 'Heatmap', desc: 'Visual overlay showing regions the AI focused on for its prediction' },
              {
                title: 'Differential Diagnosis',
                desc: 'Alternative diagnoses ranked by probability',
              },
            ].map((item) => (
              <div key={item.title} className="border border-gray-200 dark:border-gray-700 p-3 rounded">
                <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-warning-50 dark:bg-warning-900/20 p-4 rounded-lg border border-warning-200 dark:border-warning-800 mt-4">
            <p className="text-gray-700 dark:text-gray-300 font-medium">⚠️ Important Disclaimer</p>
            <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
              MedAIx results are for research and educational purposes only and should not be used as a substitute for professional medical diagnosis.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'api-documentation',
      title: 'API Documentation',
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">API Documentation</h2>
          <p className="text-gray-700 dark:text-gray-300">
            MedAIx provides a REST API for developers to integrate medical image analysis into their applications.
          </p>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">Authentication</h3>
          <p className="text-gray-700 dark:text-gray-300">All API requests require an API key in the Authorization header:</p>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm">
            <code>Authorization: Bearer YOUR_API_KEY</code>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">Upload Image</h3>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm">
            <code>
              {`POST /api/analyze
Content-Type: multipart/form-data

{
  "file": <image_file>,
  "model": "brain-mri" // optional
}`}
            </code>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">Get Results</h3>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm">
            <code>{`GET /api/results/{jobId}`}</code>
          </div>
        </div>
      ),
    },
    {
      id: 'faqs',
      title: 'FAQs',
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          {[
            {
              q: 'How long does analysis take?',
              a: 'Most analyses complete within 30-60 seconds depending on image size and complexity.',
            },
            {
              q: 'Is my data secure?',
              a: 'Yes, all data is encrypted in transit (HTTPS) and at rest. We comply with HIPAA and GDPR regulations.',
            },
            {
              q: 'Can I export my results?',
              a: 'Yes, you can export individual results as PDF or CSV, or download all data from your account settings.',
            },
            {
              q: 'What if the analysis seems incorrect?',
              a: 'Always consult with medical professionals. MedAIx is a tool for assistance, not a replacement for clinical judgment.',
            },
            {
              q: 'How do I delete my account?',
              a: 'Go to Settings > Account Settings and click "Delete Account". This action is permanent.',
            },
          ].map((item, idx) => (
            <details key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <summary className="font-medium text-gray-900 dark:text-white cursor-pointer">
                {item.q}
              </summary>
              <p className="text-gray-700 dark:text-gray-300 mt-2">{item.a}</p>
            </details>
          ))}
        </div>
      ),
    },
    {
      id: 'contact-support',
      title: 'Contact Support',
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Support</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Need help? Our support team is here to assist you 24/7.
          </p>
          <div className="space-y-3">
            <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white">📧 Email</p>
              <p className="text-primary-600 dark:text-primary-400">support@max.ai</p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white">💬 Live Chat</p>
              <p className="text-gray-700 dark:text-gray-300">Available Monday-Friday, 9AM-5PM EST</p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white">🐛 Bug Reports</p>
              <p className="text-gray-700 dark:text-gray-300">Found a bug? Report it on our GitHub issues page</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const filteredSections = sections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (section.content && typeof section.content === 'string' && section.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
      <div className="min-h-screen bg-[#f7f8fa] dark:bg-[#071029] text-gray-900 dark:text-gray-100 ring-1 ring-black/5 dark:ring-white/6">
        {/* Header with Search */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Documentation</h1>
            <div className="relative">
              <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <nav className="sticky top-24 space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    activeSection === section.id
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {filteredSections.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">No documentation found for "{searchTerm}"</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                {sections.find((s) => s.id === activeSection)?.content}
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Documentation;
