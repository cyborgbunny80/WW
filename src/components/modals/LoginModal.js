import React from 'react';

const LoginModal = ({
  showLoginModal,
  setShowLoginModal,
  loginForm,
  setLoginForm,
  currentLocation,
  handleLogin,
  handleSignUp,
  isSignUp,
  setIsSignUp
}) => {
  if (!showLoginModal) return null;

  return (
    <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
      <div className="login-container" onClick={(e) => e.stopPropagation()}>
        <div className="login-header">
          <h2 className="login-title">
            {isSignUp ? 'Create Account' : 'Login'}
          </h2>
          <button onClick={() => setShowLoginModal(false)} className="close-button">
            ✕
          </button>
        </div>

        <div className="login-form">
          {isSignUp && (
            <>
              <label className="login-label">Name *</label>
              <input
                className="login-input"
                value={loginForm.name}
                onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                placeholder="Your full name"
              />

              <label className="login-label">Home City (Optional)</label>
              <input
                className="login-input"
                value={loginForm.city}
                onChange={(e) => setLoginForm({ ...loginForm, city: e.target.value })}
                placeholder="Your home city"
              />

              <label className="login-label">State (Optional)</label>
              <input
                className="login-input"
                value={loginForm.state}
                onChange={(e) => setLoginForm({ ...loginForm, state: e.target.value })}
                placeholder="ST"
                maxLength="2"
              />
            </>
          )}

          <label className="login-label">Email *</label>
          <input
            className="login-input"
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            placeholder="your@email.com"
            type="email"
          />

          <label className="login-label">Password *</label>
          <input
            className="login-input"
            value={loginForm.password || ''}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            placeholder="••••••••"
            type="password"
          />
        </div>

        <button
          className="login-button"
          onClick={isSignUp ? handleSignUp : handleLogin}
          style={{ marginBottom: '12px' }}
        >
          <span className="login-button-text">
            {isSignUp ? 'Create Account' : 'Login'}
          </span>
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
      </div>
    </div>
  );
};

export default LoginModal;