


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NavbarLogo } from '../components/Logo';
import AuthBackground from '../components/AuthBackground';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import { 
  validateEmail, 
  validatePassword, 
  validatePasswordConfirmation, 
  validateFullName 
} from '../utils/validation';


const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    // Validate name
    const nameValidation = validateFullName(formData.name);
    if (!nameValidation.isValid) {
      setError(nameValidation.error!);
      return false;
    }

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error!);
      return false;
    }

    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error!);
      return false;
    }

    // Validate password confirmation
    const confirmPasswordValidation = validatePasswordConfirmation(
      formData.password, 
      formData.confirmPassword
    );
    if (!confirmPasswordValidation.isValid) {
      setError(confirmPasswordValidation.error!);
      return false;
    }

    // Validate terms agreement
    if (!formData.agreeTerms) {
      setError('You must agree to the terms and conditions');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await signup(formData.email, formData.password, formData.name);
      navigate('/upload');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };


  return (
    <AuthBackground>
      <div className="w-full max-w-md">

        {/* Logo - Responsive */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <NavbarLogo className="h-16 w-16 sm:h-20 sm:w-20" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white dark:text-white drop-shadow-lg">MedAIx</h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-200 dark:text-gray-300">AI-Powered Medical Image Analysis</p>
        </div>

        {/* Form Card - Responsive */}
        <div className="rounded-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md p-4 sm:p-6 lg:p-8 shadow-lg border border-white/20 dark:border-gray-700/50">
          <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Create Account</h2>

          {/* Error Alert - Responsive */}
          {error && (
            <div className="mb-4 sm:mb-6 flex items-start gap-3 rounded-lg border border-danger-200 bg-danger-50 p-3 sm:p-4">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-danger mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs sm:text-sm text-danger">{error}</p>
            </div>
          )}

          {/* Form - Responsive */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Name Input - Responsive */}
            <div>
              <label htmlFor="name" className="mb-2 block text-xs sm:text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 text-xs sm:text-sm"
              />
            </div>

            {/* Email Input - Responsive */}
            <div>
              <label htmlFor="email" className="mb-2 block text-xs sm:text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 text-xs sm:text-sm"
              />
            </div>


            {/* Password Input - Responsive */}
            <div>
              <label htmlFor="password" className="mb-2 block text-xs sm:text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 text-xs sm:text-sm"
              />
              <PasswordStrengthMeter 
                password={formData.password}
                confirmPassword={formData.confirmPassword}
              />
            </div>

            {/* Confirm Password Input - Responsive */}
            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-xs sm:text-sm font-semibold text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 text-xs sm:text-sm"
              />
            </div>

            {/* Terms Agreement - Responsive */}
            <div>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="h-3 w-3 sm:h-4 sm:w-4 rounded border-gray-300 text-primary focus:ring-primary mt-0.5"
                />
                <span className="text-xs sm:text-sm text-gray-600 leading-tight">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Submit Button - Responsive */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-primary px-4 py-2 sm:py-3 font-semibold text-white transition duration-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-xs sm:text-sm">Creating account...</span>
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link - Responsive */}
          <p className="mt-4 sm:mt-6 text-center text-gray-600">
            <span className="text-xs sm:text-sm">Already have an account? </span>
            <Link to="/login" className="font-semibold text-primary hover:underline text-xs sm:text-sm">
              Sign in
            </Link>
          </p>
        </div>


        {/* Demo Notice - Responsive */}
        <div className="mt-4 sm:mt-6 rounded-lg bg-green-50/80 dark:bg-green-900/50 p-3 sm:p-4 text-center backdrop-blur-sm">
          <p className="text-xs text-gray-700 dark:text-gray-300">
            <strong>Demo:</strong> No email verification required for demo purposes
          </p>
        </div>
      </div>
    </AuthBackground>
  );
};

export default SignUp;
