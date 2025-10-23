import React from 'react';
import EventCard from '../components/EventCard';
import { categories } from '../constants/categories';
import {
  filterEventsByLocation,
  filterEventsBySearchAndCategory
} from '../utils/eventFiltering';

const HomeScreen = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  favoriteEvents,
  setFavoriteEvents,
  isLoggedIn,
  setShowLoginModal,
  setShowBulkCreate,
  setShowLocationPicker,
  currentLocation,
  events,
  showCategoryDropdown,
  setShowCategoryDropdown
}) => {
  const locationFilteredEvents = filterEventsByLocation(
    events,
    currentLocation.city,
    currentLocation.state
  );

  const filteredEvents = filterEventsBySearchAndCategory(
    locationFilteredEvents,
    searchQuery,
    selectedCategory
  );

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  const toggleFavoriteEvent = (eventId) => {
    if (!isLoggedIn) {
      alert('Please log in to favorite events');
      return;
    }

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
      <div className="header">
        <div className="header-top">
          <div>
            <h1 className="app-title">When? Win!</h1>
            <button
              className="location-row"
              onClick={() => setShowLocationPicker(true)}
            >
              <span className="location-icon">📍</span>
              <span className="location-text">
                {currentLocation.city}, {currentLocation.state}
              </span>
              <span className="location-chevron">▼</span>
            </button>
          </div>
          <div className="header-buttons">
            <button
              className="create-button"
              onClick={() => {
                if (!isLoggedIn) {
                  alert('Please log in to create events');
                  return;
                }
                setShowBulkCreate(true);
              }}
            >
              <span className="create-button-text">+</span>
            </button>
            <button className="header-button">
              <span className="header-button-text">🔔</span>
            </button>
          </div>
        </div>

        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="When are you free? Let's find you a win!"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          className="category-selector"
          onClick={() => setShowCategoryDropdown(true)}
        >
          <span className="category-emoji">{selectedCategoryData?.emoji}</span>
          <span className="category-selector-text">{selectedCategoryData?.name}</span>
          <span className="chevron">▼</span>
        </button>
      </div>

      <div className="events-container">
        <div className="events-header">
          <h2 className="events-title">
            {selectedCategory === 'all' ? 'All Events' : selectedCategoryData?.name}
          </h2>
          <div className="event-count">
            <span className="event-count-text">{filteredEvents.length} events</span>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🎪</span>
            <h3 className="empty-state-title">No events found in {currentLocation.city}</h3>
            <p className="empty-state-text">
              Try changing your location or check back later for new events!
            </p>
            <button
              className="change-location-button"
              onClick={() => setShowLocationPicker(true)}
            >
              <span className="change-location-button-text">Change Location</span>
            </button>
          </div>
        ) : (
          filteredEvents.map(event => (
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

export default HomeScreen;
