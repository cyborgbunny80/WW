import React from 'react';
import EventCard from '../components/EventCard';
import { getUpcomingAndPastEvents, filterEventsByLocation } from '../utils/eventFiltering';

const ProfileScreen = ({
  isLoggedIn,
  setShowLoginModal,
  currentUser,
  currentLocation,
  events,
  profileTab,
  setProfileTab,
  favoriteEvents,
  setFavoriteEvents
}) => {
  const locationFilteredEvents = filterEventsByLocation(
    events,
    currentLocation.city,
    currentLocation.state
  );

  const { upcoming: upcomingEvents, past: pastEvents } = getUpcomingAndPastEvents(
    locationFilteredEvents
  );

  const eventsToShow = profileTab === 'upcoming' ? upcomingEvents : pastEvents;

  const toggleFavoriteEvent = (eventId) => {
    const newFavoriteEvents = new Set(favoriteEvents);
    if (newFavoriteEvents.has(eventId)) {
      newFavoriteEvents.delete(eventId);
    } else {
      newFavoriteEvents.add(eventId);
    }
    setFavoriteEvents(newFavoriteEvents);
  };

  const handleLogout = () => {
    // TODO: Add logout logic here
    alert('Logged out successfully');
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
                <p className="profile-location">
                  📍 {currentUser.homeCity}, {currentUser.homeState}
                </p>
              </div>
              <button className="logout-button" onClick={handleLogout}>
                <span className="logout-button-text">Logout</span>
              </button>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">
                  {events.filter(e => e.organizer === currentUser.name).length}
                </span>
                <span className="stat-label">Events Created</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{upcomingEvents.length}</span>
                <span className="stat-label">Upcoming Events</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{favoriteEvents.size}</span>
                <span className="stat-label">Events Loved</span>
              </div>
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
            </div>

            <div className="profile-events">
              {eventsToShow.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-state-icon">
                    {profileTab === 'upcoming' ? '📅' : '📋'}
                  </span>
                  <h3 className="empty-state-title">
                    No {profileTab} events in {currentLocation.city}
                  </h3>
                  <p className="empty-state-text">
                    {profileTab === 'upcoming'
                      ? 'Create some events to see them here!'
                      : 'Past events will appear here.'}
                  </p>
                </div>
              ) : (
                eventsToShow.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    showPastLabel={profileTab === 'past'}
                    favoriteEvents={favoriteEvents}
                    toggleFavoriteEvent={toggleFavoriteEvent}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;