


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NavbarLogo } from '../components/Logo';
import AuthBackground from '../components/AuthBackground';
import { validateEmail } from '../utils/validation';


const PasswordReset: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const validateEmailField = (): boolean => {
    // Validate email using shared utility
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error!);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);


    if (!validateEmailField()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <AuthBackground>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <NavbarLogo className="h-20 w-20" />
          </div>
          <h1 className="text-3xl font-bold text-white dark:text-white drop-shadow-lg">MedAIx</h1>
          <p className="mt-2 text-gray-200 dark:text-gray-300">Reset your password</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md p-8 shadow-lg border border-white/20 dark:border-gray-700/50">
          {isSubmitted ? (
            // Success State
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-success-100 p-4">
                  <svg className="h-12 w-12 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>


              <div className="text-center">
                <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Check Your Email</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  We've sent a password reset link to <strong>{email}</strong>. 
                  Please check your inbox and follow the instructions.
                </p>
              </div>

              <div className="rounded-lg bg-blue-50/80 dark:bg-blue-900/50 p-4 text-sm text-gray-700 dark:text-gray-300 backdrop-blur-sm">
                <p className="font-semibold mb-2">💡 Didn't receive the email?</p>
                <ul className="space-y-1 text-xs">
                  <li>• Check your spam or junk folder</li>
                  <li>• Make sure the email is correct</li>
                  <li>• Try requesting a new link</li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
                className="w-full rounded-lg border-2 border-primary px-4 py-2 font-semibold text-primary transition duration-200 hover:bg-primary-50"
              >
                Send Another Link
              </button>
            </div>
          ) : (

            // Form State
            <>
              <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {/* Error Alert */}
              {error && (
                <div className="mb-6 flex items-start gap-3 rounded-lg border border-danger-200 bg-danger-50 p-4">
                  <svg className="h-5 w-5 flex-shrink-0 text-danger mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-danger">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-primary hover:underline">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </AuthBackground>
  );
};

export default PasswordReset;
