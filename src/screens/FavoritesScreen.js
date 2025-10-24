import React, { useState } from 'react';
import EventCard from '../components/EventCard';
import EventDetailsModal from '../components/modals/EventDetailsModal';

const FavoritesScreen = ({
  isLoggedIn,
  setShowLoginModal,
  events,
  favoriteEvents,
  toggleFavoriteEvent,
  calendarEvents,
  toggleCalendarEvent
}) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  const favoriteEventsList = events.filter(event => favoriteEvents.has(event.id));

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
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
          <div className="favorites-compact">
            {favoriteEventsList.map(event => (
              <EventCard
                key={event.id}
                event={event}
                favoriteEvents={favoriteEvents}
                toggleFavoriteEvent={toggleFavoriteEvent}
                calendarEvents={calendarEvents}
                onClick={handleEventClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      <EventDetailsModal
        event={selectedEvent}
        isOpen={showEventDetails}
        onClose={() => setShowEventDetails(false)}
        toggleFavorite={toggleFavoriteEvent}
        isFavorite={selectedEvent ? favoriteEvents.has(selectedEvent.id) : false}
        toggleCalendar={toggleCalendarEvent}
        isInCalendar={selectedEvent ? calendarEvents.has(String(selectedEvent.id)) : false}
        isLoggedIn={isLoggedIn}
        setShowLoginModal={setShowLoginModal}
        favoriteEvents={favoriteEvents}
        calendarEvents={calendarEvents}
      />
    </div>
  );
};

export default FavoritesScreen;