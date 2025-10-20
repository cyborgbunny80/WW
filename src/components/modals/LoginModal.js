import React from 'react';

const LoginModal = ({
  showLoginModal,
  setShowLoginModal,
  loginForm,
  setLoginForm,
  currentLocation,
  setCurrentLocation,
  setCurrentUser,
  setIsLoggedIn
}) => {
  const handleLogin = () => {
    if (!loginForm.name || !loginForm.email) {
      alert('Please fill in your name and email');
      return;
    }

    const user = {
      name: loginForm.name,
      email: loginForm.email,
      homeCity: loginForm.city || currentLocation.city,
      homeState: loginForm.state || currentLocation.state,
      joinedDate: new Date().toISOString(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        loginForm.name
      )}&background=32a86b&color=fff`
    };

    setCurrentUser(user);
    setIsLoggedIn(true);
    setShowLoginModal(false);

    if (loginForm.city && loginForm.state) {
      setCurrentLocation({
        city: loginForm.city,
        state: loginForm.state,
        isManual: true
      });
    }

    alert(`Welcome to When? Win!, ${user.name}!`);
  };

  if (!showLoginModal) return null;

  return (
    <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
      <div className="login-container" onClick={(e) => e.stopPropagation()}>
        <div className="login-header">
          <h2 className="login-title">Join When? Win!</h2>
          <button onClick={() => setShowLoginModal(false)} className="close-button">
            ✕
          </button>
        </div>

        <div className="login-form">
          <label className="login-label">Name *</label>
          <input
            className="login-input"
            value={loginForm.name}
            onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
            placeholder="Your full name"
          />

          <label className="login-label">Email *</label>
          <input
            className="login-input"
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            placeholder="your@email.com"
            type="email"
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
        </div>

        <button className="login-button" onClick={handleLogin}>
          <span className="login-button-text">Join the Community!</span>
        </button>
      </div>
    </div>
  );
};

export default LoginModal;