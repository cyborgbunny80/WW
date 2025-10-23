import React, { useState } from 'react';
import EventCard from '../components/EventCard';
import SingleEventModal from '../components/modals/SingleEventModal';
import { getUpcomingAndPastEvents, filterEventsByLocation } from '../utils/eventFiltering';
import { updateEvent, deleteEvent } from '../services/firebaseServices';

const ProfileScreen = ({
  isLoggedIn,
  setShowLoginModal,
  currentUser,
  currentLocation,
  events,
  setEvents,
  profileTab,
  setProfileTab,
  favoriteEvents,
  toggleFavoriteEvent,
  calendarEvents,
  handleLogout
}) => {
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const locationFilteredEvents = filterEventsByLocation(
    events,
    currentLocation.city,
    currentLocation.state
  );

  const { upcoming: upcomingEvents, past: pastEvents } = getUpcomingAndPastEvents(
    locationFilteredEvents
  );

  // Filter events created by current user
  const myEvents = events.filter(event => {
    if (!currentUser) return false;

    console.log('Checking event:', event.title, 'organizer:', event.organizer, 'createdBy:', event.createdBy);
    console.log('Current user:', currentUser.name, 'userId:', currentUser.userId);

    // Match by user ID (most reliable for new events)
    if (event.createdBy && event.createdBy === currentUser.userId) {
      console.log('Match by createdBy!');
      return true;
    }

    if (event.createdByUid && event.createdByUid === currentUser.userId) {
      console.log('Match by createdByUid!');
      return true;
    }

    // Match by exact organizer name
    if (event.organizer === currentUser.name) {
      console.log('Match by exact name!');
      return true;
    }

    // Match by organizer name (case-insensitive, flexible matching for legacy events)
    if (event.organizer && currentUser.name) {
      const organizerLower = event.organizer.toLowerCase().trim();
      const userNameLower = currentUser.name.toLowerCase().trim();

      // Check if names match closely
      if (organizerLower === userNameLower ||
          organizerLower.includes(userNameLower) ||
          userNameLower.includes(organizerLower)) {
        console.log('Match by flexible name matching!');
        return true;
      }
    }

    return false;
  });

  // Get favorite events list
  const favoriteEventsList = events.filter(event => favoriteEvents.has(event.id));

  const eventsToShow = profileTab === 'upcoming'
    ? upcomingEvents
    : profileTab === 'past'
    ? pastEvents
    : profileTab === 'favorites'
    ? favoriteEventsList
    : myEvents;

  const toggleFavorite = (eventId) => {
    if (typeof toggleFavoriteEvent === 'function') {
      toggleFavoriteEvent(eventId);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEditModal(true);
  };

  const handleUpdateEvent = async (updatedEvent) => {
    try {
      // Find the Firebase ID (some events have firebaseId, others use id as the Firebase ID)
      const firebaseId = updatedEvent.firebaseId || updatedEvent.id;

      // Update in Firebase
      await updateEvent(firebaseId, updatedEvent);

      // Update local state
      setEvents(events.map(e =>
        (e.id === updatedEvent.id || e.firebaseId === firebaseId)
          ? { ...updatedEvent, firebaseId }
          : e
      ));

      alert('Event updated successfully!');
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event. Please try again.');
    }
  };

  const handleDeleteEvent = async (event) => {
    if (!window.confirm(`Are you sure you want to delete "${event.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      // Find the Firebase ID
      const firebaseId = event.firebaseId || event.id;

      // Delete from Firebase
      await deleteEvent(firebaseId);

      // Update local state
      setEvents(events.filter(e =>
        e.id !== event.id && e.firebaseId !== firebaseId
      ));

      alert('Event deleted successfully!');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  return (
    <div className="screen-container">
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
      </div>

      <div className="profile-container">
        {!isLoggedIn ? (
          <div className="login-prompt">
            <span className="login-prompt-icon">👤</span>
            <h2 className="login-prompt-title">Join When? Win!</h2>
            <p className="login-prompt-text">
              Create an account to save favorites, create events, and connect with your community!
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
            <div className="profile-card">
              <img src={currentUser.avatar} alt={currentUser.name} className="profile-avatar" />
              <div className="profile-info">
                <h2 className="profile-name">{currentUser.name}</h2>
                <p className="profile-email">{currentUser.email}</p>
              </div>
              <button className="logout-button" onClick={handleLogout}>
                <span className="logout-button-text">Logout</span>
              </button>
            </div>

            <div className="profile-stats">
              <button
                className="stat-item"
                onClick={() => setProfileTab('myEvents')}
                style={{ cursor: 'pointer' }}
              >
                <span className="stat-number">{myEvents.length}</span>
                <span className="stat-label">My Events</span>
              </button>
              <button
                className="stat-item"
                onClick={() => setProfileTab('upcoming')}
                style={{ cursor: 'pointer' }}
              >
                <span className="stat-number">{upcomingEvents.length}</span>
                <span className="stat-label">Upcoming</span>
              </button>
              <button
                className="stat-item"
                onClick={() => setProfileTab('favorites')}
                style={{ cursor: 'pointer' }}
              >
                <span className="stat-number">{favoriteEvents.size}</span>
                <span className="stat-label">Favorited</span>
              </button>
            </div>

            <div className="profile-tabs">
              <button
                className={`profile-tab ${profileTab === 'upcoming' ? 'profile-tab-active' : ''}`}
                onClick={() => setProfileTab('upcoming')}
              >
                <span
                  className={`profile-tab-text ${
                    profileTab === 'upcoming' ? 'profile-tab-text-active' : ''
                  }`}
                >
                  Upcoming ({upcomingEvents.length})
                </span>
              </button>
              <button
                className={`profile-tab ${profileTab === 'past' ? 'profile-tab-active' : ''}`}
                onClick={() => setProfileTab('past')}
              >
                <span
                  className={`profile-tab-text ${
                    profileTab === 'past' ? 'profile-tab-text-active' : ''
                  }`}
                >
                  Past ({pastEvents.length})
                </span>
              </button>
              <button
                className={`profile-tab ${profileTab === 'myEvents' ? 'profile-tab-active' : ''}`}
                onClick={() => setProfileTab('myEvents')}
              >
                <span
                  className={`profile-tab-text ${
                    profileTab === 'myEvents' ? 'profile-tab-text-active' : ''
                  }`}
                >
                  My Events ({myEvents.length})
                </span>
              </button>
            </div>

            <div className="profile-events">
              {eventsToShow.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-state-icon">
                    {profileTab === 'upcoming' ? '📅'
                      : profileTab === 'past' ? '📋'
                      : profileTab === 'favorites' ? '❤️'
                      : '✏️'}
                  </span>
                  <h3 className="empty-state-title">
                    {profileTab === 'myEvents'
                      ? 'No events created yet'
                      : profileTab === 'favorites'
                      ? 'No favorited events'
                      : `No ${profileTab} events in ${currentLocation.city}`}
                  </h3>
                  <p className="empty-state-text">
                    {profileTab === 'upcoming'
                      ? 'Check back later for upcoming events!'
                      : profileTab === 'past'
                      ? 'Past events will appear here.'
                      : profileTab === 'favorites'
                      ? 'Heart events to see them here!'
                      : 'Events you create will appear here for easy management.'}
                  </p>
                </div>
              ) : (
                eventsToShow.map(event => (
                  <div key={event.id} className={profileTab === 'myEvents' ? 'manage-event-container' : ''}>
                    <EventCard
                      event={event}
                      showPastLabel={profileTab === 'past'}
                      favoriteEvents={favoriteEvents}
                      toggleFavoriteEvent={toggleFavorite}
                      calendarEvents={calendarEvents}
                    />
                    {profileTab === 'myEvents' && (
                      <div className="event-management-buttons">
                        <button
                          className="edit-event-button"
                          onClick={() => handleEditEvent(event)}
                        >
                          <span className="edit-event-button-text">✏️ Edit</span>
                        </button>
                        <button
                          className="delete-event-button"
                          onClick={() => handleDeleteEvent(event)}
                        >
                          <span className="delete-event-button-text">🗑️ Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Edit Event Modal */}
      {showEditModal && editingEvent && (
        <SingleEventModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingEvent(null);
          }}
          currentLocation={currentLocation}
          currentUser={currentUser}
          onCreateEvent={handleUpdateEvent}
          existingEvent={editingEvent}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default ProfileScreen;