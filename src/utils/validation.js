// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  return { isValid: true, error: '' };
};

// Password validation
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters' };
  }
  if (password.length > 128) {
    return { isValid: false, error: 'Password is too long' };
  }

  // Check for at least one number
  const hasNumber = /\d/.test(password);
  // Check for at least one letter
  const hasLetter = /[a-zA-Z]/.test(password);

  if (!hasNumber || !hasLetter) {
    return { isValid: false, error: 'Password must contain both letters and numbers' };
  }

  return { isValid: true, error: '' };
};

// Get password strength
export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: '', color: '' };

  let strength = 0;

  // Length criteria
  if (password.length >= 6) strength += 1;
  if (password.length >= 10) strength += 1;

  // Character variety
  if (/[a-z]/.test(password)) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/\d/.test(password)) strength += 1;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

  // Map strength to label and color
  if (strength <= 2) {
    return { strength, label: 'Weak', color: '#ff4444' };
  } else if (strength <= 4) {
    return { strength, label: 'Medium', color: '#ffaa00' };
  } else {
    return { strength, label: 'Strong', color: '#32a86b' };
  }
};

// Name validation
export const validateName = (name) => {
  if (!name || name.trim() === '') {
    return { isValid: false, error: 'Name is required' };
  }
  if (name.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }
  if (name.length > 50) {
    return { isValid: false, error: 'Name is too long' };
  }
  return { isValid: true, error: '' };
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  return { isValid: true, error: '' };
};

// Get user-friendly Firebase error messages
export const getFirebaseErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered. Please log in instead.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact support.',
    'auth/weak-password': 'Password is too weak. Please use a stronger password.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/user-not-found': 'No account found with this email. Please sign up.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password. Please try again.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed before completing.',
    'auth/cancelled-popup-request': 'Only one popup request is allowed at a time.',
    'auth/requires-recent-login': 'Please log in again to complete this action.'
  };

  return errorMessages[errorCode] || 'An error occurred. Please try again.';
};
