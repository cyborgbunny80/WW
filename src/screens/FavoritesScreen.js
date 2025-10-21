import React from 'react';
import EventCard from '../components/EventCard';

const FavoritesScreen = ({
  isLoggedIn,
  setShowLoginModal,
  events,
  favoriteEvents,
  setFavoriteEvents
}) => {
  const favoriteEventsList = events.filter(event => favoriteEvents.has(event.id));

  const toggleFavoriteEvent = (eventId) => {
    const newFavoriteEvents = new Set(favoriteEvents);
    if (newFavoriteEvents.has(eventId)) {
      newFavoriteEvents.delete(eventId);
    } else {
      newFavoriteEvents.add(eventId);
    }
    setFavoriteEvents(newFavoriteEvents);
  };

  return (
    <div className="screen-container">
      <div className="page-header">
        <h1 className="page-title">Favorite Events</h1>
      </div>
      <div className="events-container">
        {!isLoggedIn ? (
          <div className="empty-state">
            <span className="empty-state-icon">❤️</span>
            <h3 className="empty-state-title">Login to save favorites</h3>
            <p className="empty-state-text">Sign up to save your favorite events!</p>
            <button
              className="change-location-button"
              onClick={() => setShowLoginModal(true)}
            >
              <span className="change-location-button-text">Sign Up / Log In</span>
            </button>
          </div>
        ) : favoriteEventsList.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">❤️</span>
            <h3 className="empty-state-title">No favorite events yet</h3>
            <p className="empty-state-text">Heart the events you love!</p>
          </div>
        ) : (
          favoriteEventsList.map(event => (
            <EventCard
              key={event.id}
              event={event}
              favoriteEvents={favoriteEvents}
              toggleFavoriteEvent={toggleFavoriteEvent}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FavoritesScreen;