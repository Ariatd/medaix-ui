/**
 * Shared validation utilities for authentication forms
 */

// Modern, flexible email regex (case-insensitive)
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface PasswordValidationResult extends ValidationResult {
  score: number;
  label: string;
  feedback: string[];
}


/**
 * Validate email format
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }

  // Simple test first
  const trimmedEmail = email.trim();
  
  // Basic structure check
  if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
    return {
      isValid: false,
      error: 'Invalid email format. Please enter a valid email address.'
    };
  }

  // Use regex validation
  if (!emailRegex.test(trimmedEmail)) {
    return {
      isValid: false,
      error: 'Invalid email format. Please enter a valid email address.'
    };
  }

  return {
    isValid: true
  };
};

/**
 * Validate password strength and requirements
 */

export const validatePassword = (password: string): PasswordValidationResult => {
  if (!password) {
    return {
      isValid: false,
      score: 0,
      label: '',
      feedback: ['Password is required'],
      error: 'Password is required'
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      score: 0,
      label: 'Too Short',
      feedback: ['At least 6 characters'],
      error: 'Password must be at least 6 characters'
    };
  }

  // SIMPLIFIED: Only check length for validation, no strict requirements
  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  
  // Character variety checks (for strength indicator only, not validation)
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  // Normalize score to 0-4 range
  const normalizedScore = Math.min(Math.floor(score / 2), 4);
  
  let label: string;

  if (normalizedScore === 0) {
    label = 'Weak';
  } else if (normalizedScore === 1) {
    label = 'Fair';
  } else if (normalizedScore === 2) {
    label = 'Good';
  } else if (normalizedScore === 3) {
    label = 'Strong';
  } else {
    label = 'Very Strong';
  }

  // Simple feedback - only show length requirement
  if (password.length < 8) {
    feedback.push('Consider using 8+ characters for better security');
  } else {
    feedback.push('Good password length');
  }

  return {
    isValid: true, // Always valid if 6+ characters
    score: normalizedScore,
    label,
    feedback
  };
};

/**
 * Validate password confirmation
 */
export const validatePasswordConfirmation = (
  password: string, 
  confirmPassword: string
): ValidationResult => {
  if (!confirmPassword) {
    return {
      isValid: false,
      error: 'Please confirm your password'
    };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Passwords do not match.'
    };
  }

  return {
    isValid: true
  };
};

/**
 * Validate full name
 */
export const validateFullName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return {
      isValid: false,
      error: 'Name is required'
    };
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      error: 'Name must be at least 2 characters'
    };
  }

  return {
    isValid: true
  };
};

/**
 * Sanitize email for display/logging
 */
export const sanitizeEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  
  // Show only first and last character of local part for privacy
  if (local.length <= 2) {
    return `*@${domain}`;
  }
  
  return `${local.charAt(0)}***${local.charAt(local.length - 1)}@${domain}`;
};
