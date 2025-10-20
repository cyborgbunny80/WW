import React from 'react';

const CreateScreen = ({ isLoggedIn, setShowLoginModal, setShowBulkCreate }) => {
  return (
    <div className="screen-container">
      <div className="page-header">
        <h1 className="page-title">Create Events</h1>
      </div>
      <div className="create-screen-content">
        {!isLoggedIn ? (
          <div className="login-prompt">
            <span className="login-prompt-icon">➕</span>
            <h2 className="login-prompt-title">Create Events</h2>
            <p className="login-prompt-text">
              Sign up to create events and share them with your community!
            </p>
            <button
              className="login-prompt-button"
              onClick={() => setShowLoginModal(true)}
            >
              <span className="login-prompt-button-text">Sign Up / Log In</span>
            </button>
          </div>
        ) : (
          <>
            <button
              className="create-option"
              onClick={() => setShowBulkCreate(true)}
            >
              <span className="create-option-icon">📋</span>
              <h3 className="create-option-title">Bulk Add Events</h3>
              <p className="create-option-description">Perfect for offices & organizations</p>
            </button>

            <button className="create-option">
              <span className="create-option-icon">➕</span>
              <h3 className="create-option-title">Single Event</h3>
              <p className="create-option-description">Add one event at a time</p>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateScreen;