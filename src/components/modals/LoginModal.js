import React, { useState, useEffect } from 'react';
import {
  validateEmail,
  validatePassword,
  validateName,
  validateConfirmPassword,
  getPasswordStrength
} from '../../utils/validation';

const LoginModal = ({
  showLoginModal,
  setShowLoginModal,
  loginForm,
  setLoginForm,
  currentLocation,
  handleLogin,
  handleSignUp,
  isSignUp,
  setIsSignUp,
  handlePasswordReset
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Reset state when modal closes or mode changes
  useEffect(() => {
    if (!showLoginModal) {
      setErrors({});
      setTouched({});
      setShowPassword(false);
      setShowConfirmPassword(false);
      setShowForgotPassword(false);
      setResetEmailSent(false);
      setIsLoading(false);
    }
  }, [showLoginModal]);

  useEffect(() => {
    setErrors({});
    setTouched({});
    setShowForgotPassword(false);
    setResetEmailSent(false);
  }, [isSignUp]);

  if (!showLoginModal) return null;

  // Real-time validation
  const validateField = (fieldName, value) => {
    let validation = { isValid: true, error: '' };

    switch (fieldName) {
      case 'email':
        validation = validateEmail(value);
        break;
      case 'password':
        validation = validatePassword(value);
        break;
      case 'name':
        validation = validateName(value);
        break;
      case 'confirmPassword':
        validation = validateConfirmPassword(loginForm.password, value);
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: validation.error
    }));

    return validation.isValid;
  };

  const handleBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, loginForm[fieldName]);
  };

  const handleChange = (fieldName, value) => {
    setLoginForm({ ...loginForm, [fieldName]: value });
    if (touched[fieldName]) {
      validateField(fieldName, value);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (isSignUp) {
      const nameValidation = validateName(loginForm.name);
      if (!nameValidation.isValid) {
        newErrors.name = nameValidation.error;
        isValid = false;
      }

      const confirmValidation = validateConfirmPassword(
        loginForm.password,
        loginForm.confirmPassword
      );
      if (!confirmValidation.isValid) {
        newErrors.confirmPassword = confirmValidation.error;
        isValid = false;
      }
    }

    const emailValidation = validateEmail(loginForm.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
      isValid = false;
    }

    const passwordValidation = validatePassword(loginForm.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const onSubmit = async () => {
    // Mark all fields as touched
    const allFields = isSignUp
      ? ['name', 'email', 'password', 'confirmPassword']
      : ['email', 'password'];

    const newTouched = {};
    allFields.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        await handleSignUp();
      } else {
        await handleLogin(rememberMe);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordReset = async () => {
    const emailValidation = validateEmail(loginForm.email);
    if (!emailValidation.isValid) {
      setErrors({ email: emailValidation.error });
      setTouched({ email: true });
      return;
    }

    setIsLoading(true);
    try {
      await handlePasswordReset(loginForm.email);
      setResetEmailSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (showForgotPassword) {
        onPasswordReset();
      } else {
        onSubmit();
      }
    }
  };

  const passwordStrength = isSignUp ? getPasswordStrength(loginForm.password) : null;

  return (
    <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
      <div className="login-container" onClick={(e) => e.stopPropagation()}>
        <div className="login-header">
          <h2 className="login-title">
            {showForgotPassword
              ? 'Reset Password'
              : isSignUp
              ? 'Create Account'
              : 'Login'}
          </h2>
          <button onClick={() => setShowLoginModal(false)} className="close-button">
            ✕
          </button>
        </div>

        {showForgotPassword ? (
          // Forgot Password Form
          <div className="login-form">
            {resetEmailSent ? (
              <div style={{
                padding: '16px',
                backgroundColor: '#e8f5e9',
                borderRadius: '6px',
                marginBottom: '16px',
                color: '#2e7d32'
              }}>
                Password reset email sent! Check your inbox and follow the instructions.
              </div>
            ) : (
              <>
                <p style={{ marginBottom: '16px', color: '#666', fontSize: '14px' }}>
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                <label className="login-label">Email *</label>
                <input
                  className="login-input"
                  value={loginForm.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  onKeyPress={handleKeyPress}
                  placeholder="your@email.com"
                  type="email"
                  disabled={isLoading}
                  style={{
                    borderColor: touched.email && errors.email ? '#ff4444' : undefined
                  }}
                />
                {touched.email && errors.email && (
                  <div className="error-message">{errors.email}</div>
                )}
              </>
            )}

            {!resetEmailSent && (
              <button
                className="login-button"
                onClick={onPasswordReset}
                disabled={isLoading}
                style={{ marginTop: '16px' }}
              >
                {isLoading ? (
                  <span className="login-button-text">Sending...</span>
                ) : (
                  <span className="login-button-text">Send Reset Link</span>
                )}
              </button>
            )}

            <button
              onClick={() => {
                setShowForgotPassword(false);
                setResetEmailSent(false);
                setErrors({});
                setTouched({});
              }}
              style={{
                marginTop: '12px',
                background: 'none',
                border: 'none',
                color: '#32a86b',
                cursor: 'pointer',
                fontWeight: 'bold',
                textDecoration: 'underline',
                width: '100%'
              }}
            >
              Back to Login
            </button>
          </div>
        ) : (
          // Login/Signup Form
          <>
            <div className="login-form">
              {isSignUp && (
                <>
                  <label className="login-label">Name *</label>
                  <input
                    className="login-input"
                    value={loginForm.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    onKeyPress={handleKeyPress}
                    placeholder="Your full name"
                    disabled={isLoading}
                    style={{
                      borderColor: touched.name && errors.name ? '#ff4444' : undefined
                    }}
                  />
                  {touched.name && errors.name && (
                    <div className="error-message">{errors.name}</div>
                  )}

                  <label className="login-label">Home City (Optional)</label>
                  <input
                    className="login-input"
                    value={loginForm.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Your home city"
                    disabled={isLoading}
                  />

                  <label className="login-label">State (Optional)</label>
                  <input
                    className="login-input"
                    value={loginForm.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="ST"
                    maxLength="2"
                    disabled={isLoading}
                  />
                </>
              )}

              <label className="login-label">Email *</label>
              <input
                className="login-input"
                value={loginForm.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                onKeyPress={handleKeyPress}
                placeholder="your@email.com"
                type="email"
                disabled={isLoading}
                style={{
                  borderColor: touched.email && errors.email ? '#ff4444' : undefined
                }}
              />
              {touched.email && errors.email && (
                <div className="error-message">{errors.email}</div>
              )}

              <label className="login-label">Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="login-input"
                  value={loginForm.password || ''}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  onKeyPress={handleKeyPress}
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  disabled={isLoading}
                  style={{
                    borderColor: touched.password && errors.password ? '#ff4444' : undefined,
                    paddingRight: '40px'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#666'
                  }}
                  tabIndex="-1"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {touched.password && errors.password && (
                <div className="error-message">{errors.password}</div>
              )}

              {isSignUp && passwordStrength && loginForm.password && (
                <div style={{ marginTop: '8px', marginBottom: '8px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px'
                  }}>
                    <div style={{
                      flex: 1,
                      height: '4px',
                      backgroundColor: '#e0e0e0',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${(passwordStrength.strength / 6) * 100}%`,
                        backgroundColor: passwordStrength.color,
                        transition: 'width 0.3s, background-color 0.3s'
                      }} />
                    </div>
                    <span style={{ color: passwordStrength.color, fontWeight: 'bold' }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}

              {isSignUp && (
                <>
                  <label className="login-label">Confirm Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="login-input"
                      value={loginForm.confirmPassword || ''}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      onBlur={() => handleBlur('confirmPassword')}
                      onKeyPress={handleKeyPress}
                      placeholder="••••••••"
                      type={showConfirmPassword ? 'text' : 'password'}
                      disabled={isLoading}
                      style={{
                        borderColor: touched.confirmPassword && errors.confirmPassword ? '#ff4444' : undefined,
                        paddingRight: '40px'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '18px',
                        color: '#666'
                      }}
                      tabIndex="-1"
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <div className="error-message">{errors.confirmPassword}</div>
                  )}
                </>
              )}

              {!isSignUp && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '12px',
                  marginBottom: '12px'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '14px' }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ marginRight: '6px' }}
                    />
                    Remember me
                  </label>
                  <button
                    onClick={() => setShowForgotPassword(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#32a86b',
                      cursor: 'pointer',
                      fontSize: '14px',
                      textDecoration: 'underline'
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>

            <button
              className="login-button"
              onClick={onSubmit}
              disabled={isLoading}
              style={{ marginBottom: '12px' }}
            >
              {isLoading ? (
                <span className="login-button-text">
                  {isSignUp ? 'Creating Account...' : 'Logging in...'}
                </span>
              ) : (
                <span className="login-button-text">
                  {isSignUp ? 'Create Account' : 'Login'}
                </span>
              )}
            </button>

            <div style={{
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '6px',
              textAlign: 'center',
              fontSize: '14px'
            }}>
              {isSignUp ? (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsSignUp(false)}
                    disabled={isLoading}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#32a86b',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      textDecoration: 'underline'
                    }}
                  >
                    Login here
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setIsSignUp(true)}
                    disabled={isLoading}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#32a86b',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      textDecoration: 'underline'
                    }}
                  >
                    Sign up here
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
