import React from 'react';

interface PasswordStrengthMeterProps {
  password: string;
  confirmPassword?: string;
}

interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
  bgColor: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ 
  password, 
  confirmPassword = '' 
}) => {
  // Calculate password strength
  const calculateStrength = (pwd: string): PasswordStrength => {
    if (!pwd) {
      return {
        score: 0,
        label: '',
        color: 'text-gray-400',
        bgColor: 'bg-gray-200'
      };
    }

    let score = 0;
    
    // Length check
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    
    // Character variety checks
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    
    // Normalize score to 0-4 range
    const normalizedScore = Math.min(Math.floor(score / 2), 4);
    
    if (normalizedScore === 0) {
      return {
        score: 0,
        label: 'Very Weak',
        color: 'text-red-600',
        bgColor: 'bg-red-200'
      };
    } else if (normalizedScore === 1) {
      return {
        score: 1,
        label: 'Weak',
        color: 'text-orange-600',
        bgColor: 'bg-orange-200'
      };
    } else if (normalizedScore === 2) {
      return {
        score: 2,
        label: 'Medium',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-200'
      };
    } else if (normalizedScore === 3) {
      return {
        score: 3,
        label: 'Strong',
        color: 'text-blue-600',
        bgColor: 'bg-blue-200'
      };
    } else {
      return {
        score: 4,
        label: 'Very Strong',
        color: 'text-green-600',
        bgColor: 'bg-green-200'
      };
    }
  };

  const strength = calculateStrength(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  // Get password feedback
  const getPasswordFeedback = () => {
    const feedback = [];
    
    if (password.length < 8) {
      feedback.push('At least 8 characters');
    }
    if (!/[a-z]/.test(password)) {
      feedback.push('Lowercase letter');
    }
    if (!/[A-Z]/.test(password)) {
      feedback.push('Uppercase letter');
    }
    if (!/[0-9]/.test(password)) {
      feedback.push('Number');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      feedback.push('Special character');
    }
    
    return feedback;
  };

  const feedback = getPasswordFeedback();

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Password Strength
          </span>
          {strength.score > 0 && (
            <span className={`text-sm font-medium ${strength.color}`}>
              {strength.label}
            </span>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="flex space-x-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`h-2 flex-1 rounded-full transition-colors duration-200 ${
                level <= strength.score
                  ? strength.bgColor
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Password Requirements */}
      {password && (
        <div className="text-xs space-y-1">
          <div className="font-medium text-gray-600 dark:text-gray-400">
            Requirements:
          </div>
          <div className="grid grid-cols-1 gap-1">
            {feedback.map((requirement, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-gray-500 dark:text-gray-400"
              >
                <svg
                  className="w-3 h-3 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {requirement}
              </div>
            ))}
            {feedback.length === 0 && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                All requirements met!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirm Password Match */}
      {confirmPassword && (
        <div className="text-xs">
          {passwordsMatch ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <svg
                className="w-3 h-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Passwords match
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <svg
                className="w-3 h-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              Passwords do not match
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
