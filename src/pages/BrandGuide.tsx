import React, { useState } from 'react';
import Layout from '../components/Layout';
import Logo, { AllLogos } from '../components/Logo';
import LogoAnimated, { LoadingSpinner, PulsingBadge } from '../components/LogoAnimated';
import SplashScreen from '../components/SplashScreen';

const BrandGuide: React.FC = () => {
  const [showSplash, setShowSplash] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'option-a' | 'option-b' | 'option-c'>('option-a');

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-white">
        {/* SplashScreen Demo */}
        {showSplash && (
          <SplashScreen
            variant={selectedOption}
            onComplete={handleSplashComplete}
            duration={3000}
          />
        )}

        {/* Header Section */}
        <section className="bg-white px-4 py-12 sm:px-6 lg:px-8 border-b border-gray-200">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-6 mb-6">
              <Logo size={96} variant={selectedOption} />
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  MedAIx Brand Guidelines
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                  Medical Analysis eXpert - Complete brand identity system
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Brand Mission</h3>
              <p className="text-blue-800">
                MedAIx delivers AI-powered medical image analysis with clarity, precision, and trust.
                Our brand identity reflects innovation, expertise, and accessibility in healthcare technology.
              </p>
            </div>
            {/* Logo comparison row (All options) */}
            <div className="mt-8">
              <AllLogos animated={false} />
            </div>
          </div>
        </section>

        {/* Logo Variants Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Logo Design Options</h2>
            <p className="text-gray-600 mb-12">
              Choose from three distinctive logo designs, each optimized for different use cases
            </p>

            {/* Option Selector */}
            <div className="mb-12 flex gap-4 flex-wrap">
              {(['option-a', 'option-b', 'option-c'] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedOption(option)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    selectedOption === option
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {option === 'option-a' && 'Medical Cross + Technology'}
                  {option === 'option-b' && 'DNA Helix'}
                  {option === 'option-c' && 'Brain + Circuit'}
                </button>
              ))}
            </div>

            {/* Logo Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Standard Logo */}
              <div className="border rounded-lg p-8 bg-white">
                <div className="flex items-center justify-center h-48 bg-gray-50 rounded mb-6">
                  <Logo size={128} variant={selectedOption} />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Standard Logo</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Primary logo for most applications. Clear, recognizable, and professional.
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>✓ Use cases: Headers, footers, documents</p>
                  <p>✓ Min size: 32px</p>
                  <p>✓ Padding: 8px all sides</p>
                </div>
              </div>

              {/* Animated Logo */}
              <div className="border rounded-lg p-8 bg-white">
                <div className="flex items-center justify-center h-48 bg-gray-50 rounded mb-6">
                  <Logo size={128} variant={selectedOption} animated={true} />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Animated Logo</h4>
                <p className="text-sm text-gray-600 mb-4">
                  With pulse and glow effects. Perfect for loading states and emphasis.
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>✓ Use cases: Loading screens, emphasis</p>
                  <p>✓ Animation: Heartbeat pulse</p>
                  <p>✓ Duration: 1.5-2s</p>
                </div>
              </div>

              {/* Dark Mode Logo */}
              <div className="border rounded-lg p-8 bg-gray-900">
                <div className="flex items-center justify-center h-48 bg-gray-800 rounded mb-6">
                  <Logo size={128} variant={selectedOption} dark={true} />
                </div>
                <h4 className="font-semibold text-white mb-2">Dark Mode Logo</h4>
                <p className="text-sm text-gray-400 mb-4">
                  Optimized for dark backgrounds. Uses light blue gradient.
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>✓ Use cases: Dark theme, evening mode</p>
                  <p>✓ Colors: #00CCFF to #0099FF</p>
                </div>
              </div>

              {/* Monochrome Logo */}
              <div className="border rounded-lg p-8 bg-white">
                <div className="flex items-center justify-center h-48 bg-gray-50 rounded mb-6">
                  <Logo size={128} variant={selectedOption} monochrome={true} />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Monochrome Logo</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Black and white for print and watermarks. Maximum simplicity.
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>✓ Use cases: Print, PDFs, watermarks</p>
                  <p>✓ Colors: Black and gray</p>
                  <p>✓ Reproduction: Guaranteed quality</p>
                </div>
              </div>

              {/* Size Variations */}
              <div className="border rounded-lg p-8 bg-white">
                <div className="flex items-center justify-center h-48 bg-gray-50 rounded mb-6 flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Logo size={32} variant={selectedOption} />
                    <span className="text-xs text-gray-500">32px</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Logo size={64} variant={selectedOption} />
                    <span className="text-xs text-gray-500">64px</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Logo size={96} variant={selectedOption} />
                    <span className="text-xs text-gray-500">96px</span>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Size Variations</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Logo maintains clarity and recognition at all sizes.
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>✓ Minimum: 32px for small icons</p>
                  <p>✓ Standard: 64px for headers</p>
                  <p>✓ Large: 256px+ for hero sections</p>
                </div>
              </div>

              {/* Interactive Demo */}
              <div className="border rounded-lg p-8 bg-white">
                <div className="flex items-center justify-center h-48 bg-gray-50 rounded mb-6">
                  <LogoAnimated size={128} variant={selectedOption} withText={false} />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Animated Heartbeat</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Full animation with glow and pulse effects. Eye-catching and modern.
                </p>
                <button
                  onClick={() => setShowSplash(true)}
                  className="text-sm text-primary font-semibold hover:underline"
                >
                  View Splash Screen Demo →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Color Palette Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Color Palette</h2>
            <p className="text-gray-600 mb-12">
              Official MedAIx color system for consistent brand representation
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Primary Blue */}
              <div>
                <div className="h-32 bg-primary rounded-lg mb-4 shadow"></div>
                <h4 className="font-semibold text-gray-900 mb-1">Primary Blue</h4>
                <p className="text-sm text-gray-600 mb-2">#0066CC</p>
                <p className="text-xs text-gray-500">
                  Primary actions, headings, logo. Core brand color representing trust and expertise.
                </p>
              </div>

              {/* Secondary Blue */}
              <div>
                <div className="h-32 bg-blue-400 rounded-lg mb-4 shadow"></div>
                <h4 className="font-semibold text-gray-900 mb-1">Secondary Blue</h4>
                <p className="text-sm text-gray-600 mb-2">#0099FF</p>
                <p className="text-xs text-gray-500">
                  Accents, secondary elements. Lighter shade for visual hierarchy.
                </p>
              </div>

              {/* Deep Blue */}
              <div>
                <div className="h-32 bg-blue-900 rounded-lg mb-4 shadow"></div>
                <h4 className="font-semibold text-gray-900 mb-1">Deep Blue</h4>
                <p className="text-sm text-gray-600 mb-2">#0052A3</p>
                <p className="text-xs text-gray-500">
                  Dark backgrounds, text contrast. High authority and stability.
                </p>
              </div>

              {/* Success Green */}
              <div>
                <div className="h-32 bg-green-500 rounded-lg mb-4 shadow"></div>
                <h4 className="font-semibold text-gray-900 mb-1">Success Green</h4>
                <p className="text-sm text-gray-600 mb-2">#00C853</p>
                <p className="text-xs text-gray-500">
                  Success states, positive feedback, completed analyses.
                </p>
              </div>

              {/* Warning Orange */}
              <div>
                <div className="h-32 bg-orange-500 rounded-lg mb-4 shadow"></div>
                <h4 className="font-semibold text-gray-900 mb-1">Warning Orange</h4>
                <p className="text-sm text-gray-600 mb-2">#FF9800</p>
                <p className="text-xs text-gray-500">
                  Warnings, alerts, attention. Use sparingly for important notices.
                </p>
              </div>

              {/* Danger Red */}
              <div>
                <div className="h-32 bg-red-500 rounded-lg mb-4 shadow"></div>
                <h4 className="font-semibold text-gray-900 mb-1">Danger Red</h4>
                <p className="text-sm text-gray-600 mb-2">#FF3333</p>
                <p className="text-xs text-gray-500">
                  Errors, deletions, critical actions. High visibility and impact.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Guidelines Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Usage Guidelines</h2>
            <p className="text-gray-600 mb-12">
              Best practices for consistent and effective brand communication
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Do's */}
              <div className="border border-green-200 rounded-lg p-8 bg-green-50">
                <h3 className="text-xl font-semibold text-green-900 mb-6">✓ DO's</h3>
                <ul className="space-y-3 text-sm text-green-800">
                  <li>✓ Maintain clear space around logo (8px minimum)</li>
                  <li>✓ Use official color palette for consistency</li>
                  <li>✓ Scale proportionally (never distort)</li>
                  <li>✓ Apply to high-contrast backgrounds</li>
                  <li>✓ Use monochrome for print materials</li>
                  <li>✓ Animate for loading and interactive states</li>
                  <li>✓ Include tagline: "Medical Analysis eXpert"</li>
                  <li>✓ Test at minimum size (32px)</li>
                </ul>
              </div>

              {/* Don'ts */}
              <div className="border border-red-200 rounded-lg p-8 bg-red-50">
                <h3 className="text-xl font-semibold text-red-900 mb-6">✗ DON'Ts</h3>
                <ul className="space-y-3 text-sm text-red-800">
                  <li>✗ Distort or stretch the logo</li>
                  <li>✗ Rotate or tilt the logo</li>
                  <li>✗ Change the color without approval</li>
                  <li>✗ Place on low-contrast backgrounds</li>
                  <li>✗ Use incomplete versions</li>
                  <li>✗ Add drop shadows or effects</li>
                  <li>✗ Use sizes smaller than 32px</li>
                  <li>✗ Modify the design or proportions</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Component Showcase Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Component Examples</h2>
            <p className="text-gray-600 mb-12">
              MedAIx logo integrated across various interface components
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Loading Spinner */}
              <div className="border rounded-lg p-8 bg-white">
                <h4 className="font-semibold text-gray-900 mb-6">Loading Spinner</h4>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <LoadingSpinner size={32} variant={selectedOption} />
                  <span className="text-gray-600">Processing...</span>
                </div>
                <p className="text-sm text-gray-600">
                  Inline loading indicator for buttons, forms, and data fetching.
                </p>
              </div>

              {/* Pulsing Badge */}
              <div className="border rounded-lg p-8 bg-white">
                <h4 className="font-semibold text-gray-900 mb-6">Pulsing Badge</h4>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <PulsingBadge size={64} variant={selectedOption} status="processing" />
                  <PulsingBadge size={64} variant={selectedOption} status="success" />
                  <PulsingBadge size={64} variant={selectedOption} status="error" />
                </div>
                <p className="text-sm text-gray-600">
                  Status indicators for analysis results (processing, success, error).
                </p>
              </div>

              {/* Header Integration */}
              <div className="border rounded-lg p-8 bg-white">
                <h4 className="font-semibold text-gray-900 mb-6">Header Logo</h4>
                <div className="bg-gray-100 rounded px-4 py-3 flex items-center gap-3 mb-6">
                  <Logo size={40} variant={selectedOption} />
                  <span className="font-bold text-gray-900">MedAIx</span>
                </div>
                <p className="text-sm text-gray-600">
                  Logo placement in page header with text branding.
                </p>
              </div>

              {/* Footer Integration */}
              <div className="border rounded-lg p-8 bg-white">
                <h4 className="font-semibold text-gray-900 mb-6">Footer Logo</h4>
                <div className="bg-gray-100 rounded px-4 py-4 flex items-center gap-3 mb-6">
                  <Logo size={32} variant={selectedOption} />
                  <div className="text-xs text-gray-600">
                    <p className="font-semibold">MedAIx</p>
                    <p>Medical Analysis eXpert © 2024</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Compact footer branding with copyright information.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Typography</h2>
            <p className="text-gray-600 mb-12">
              Font choices that complement the MedAIx brand identity
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border rounded-lg p-8 bg-white">
                <h4 className="font-semibold text-gray-900 mb-4">Primary Font</h4>
                <p style={{ fontFamily: 'Inter, sans-serif' }} className="text-2xl mb-2 text-primary">
                  Inter
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Clean, modern, highly readable. Use for body text, UI elements, and general content.
                </p>
                <p className="text-xs text-gray-500">Font weight: 400, 500, 600, 700</p>
              </div>

              <div className="border rounded-lg p-8 bg-white">
                <h4 className="font-semibold text-gray-900 mb-4">Display Font</h4>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }} className="text-2xl mb-2 text-primary">
                  Montserrat Bold
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Bold and distinctive. Use for logo text, headings, and emphasis.
                </p>
                <p className="text-xs text-gray-500">Font weight: 700</p>
              </div>

              <div className="border rounded-lg p-8 bg-white">
                <h4 className="font-semibold text-gray-900 mb-4">System Font</h4>
                <p className="text-2xl mb-2 text-primary">SF Pro Display</p>
                <p className="text-sm text-gray-600 mb-4">
                  Native system font for optimal performance. Used as fallback.
                </p>
                <p className="text-xs text-gray-500">Font weight: 400, 500, 600</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 bg-primary text-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Use MedAIx Branding?</h2>
            <p className="text-lg mb-8 opacity-90">
              Follow these guidelines to maintain brand consistency across all touchpoints.
            </p>
            <button className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Download Brand Assets
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default BrandGuide;
