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
            {isSignUp ? 'Create Account' : 'Login to When? Win!'}
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
        >
          <span className="login-button-text">
            {isSignUp ? 'Create Account' : 'Login'}
          </span>
        </button>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{
              background: 'none',
              border: 'none',
              color: '#32a86b',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '14px'
            }}
          >
            {isSignUp
              ? 'Already have an account? Login'
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;