import React, { useState } from 'react';
import SingleEventModal from '../components/modals/SingleEventModal';
import { createEvent } from '../services/firebaseServices';

const CreateScreen = ({
  isLoggedIn,
  setShowLoginModal,
  setShowBulkCreate,
  currentLocation,
  currentUser,
  events,
  setEvents
}) => {
  const [showSingleEvent, setShowSingleEvent] = useState(false);

  const handleCreateEvent = async (newEvent) => {
    try {
      // Save to Firebase
      const eventId = await createEvent(newEvent);

      // Add the Firebase ID to the event
      const eventWithFirebaseId = { ...newEvent, firebaseId: eventId };

      // Update local state
      setEvents([...events, eventWithFirebaseId]);

      alert('Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    }
  };

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
              onClick={() => setShowSingleEvent(true)}
            >
              <span className="create-option-icon">➕</span>
              <h3 className="create-option-title">Single Event</h3>
              <p className="create-option-description">Add one event at a time</p>
            </button>

            <button
              className="create-option"
              onClick={() => setShowBulkCreate(true)}
            >
              <span className="create-option-icon">📋</span>
              <h3 className="create-option-title">Bulk Add Events</h3>
              <p className="create-option-description">Perfect for offices & organizations</p>
            </button>
          </>
        )}
      </div>

      <SingleEventModal
        isOpen={showSingleEvent}
        onClose={() => setShowSingleEvent(false)}
        currentLocation={currentLocation}
        currentUser={currentUser}
        onCreateEvent={handleCreateEvent}
      />
    </div>
  );
};

export default CreateScreen;