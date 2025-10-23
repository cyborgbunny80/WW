import React, { useState, useEffect, useMemo } from 'react';
import EventCard from '../components/EventCard';
import EventDetailsModal from '../components/modals/EventDetailsModal';
import NotificationsModal from '../components/modals/NotificationsModal';
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
  sortBy,
  setSortBy,
  favoriteEvents,
  toggleFavoriteEvent,
  calendarEvents,
  toggleCalendarEvent,
  isLoggedIn,
  setShowLoginModal,
  setShowBulkCreate,
  setShowLocationPicker,
  currentLocation,
  events,
  showCategoryDropdown,
  setShowCategoryDropdown,
  showSortDropdown,
  setShowSortDropdown
}) => {
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [isLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    let result = filterEventsByLocation(
      events,
      currentLocation.city,
      currentLocation.state
    );

    result = filterEventsBySearchAndCategory(
      result,
      debouncedSearchQuery,
      selectedCategory
    );

    // Sort events
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date) - new Date(b.date);
        case 'popularity':
          return b.attendees - a.attendees;
        case 'price':
          // Free events first, then by price
          const aIsFree = a.price.toLowerCase().includes('free');
          const bIsFree = b.price.toLowerCase().includes('free');
          if (aIsFree && !bIsFree) return -1;
          if (!aIsFree && bIsFree) return 1;
          return 0;
        default:
          return 0;
      }
    });

    return result;
  }, [events, currentLocation, debouncedSearchQuery, selectedCategory, sortBy]);

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  const handleToggleFavorite = (eventId) => {
    if (!isLoggedIn) {
      alert('Please log in to favorite events');
      return;
    }
    toggleFavoriteEvent(eventId);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const sortOptions = [
    { id: 'date', label: 'Date', icon: '📅' },
    { id: 'popularity', label: 'Popularity', icon: '🔥' },
    { id: 'price', label: 'Price', icon: '💰' }
  ];

  const selectedSortOption = sortOptions.find(opt => opt.id === sortBy);

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
              className="header-button"
              onClick={() => {
                if (!isLoggedIn) {
                  alert('Please log in to view notifications');
                  setShowLoginModal(true);
                  return;
                }
                setShowNotifications(true);
              }}
            >
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

        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <button
            className="category-selector"
            style={{ flex: 1 }}
            onClick={() => setShowCategoryDropdown(true)}
          >
            <span className="category-emoji">{selectedCategoryData?.emoji}</span>
            <span className="category-selector-text">{selectedCategoryData?.name}</span>
            <span className="chevron">▼</span>
          </button>

          <button
            className="category-selector"
            style={{ minWidth: '120px' }}
            onClick={() => setShowSortDropdown(true)}
          >
            <span className="category-emoji">{selectedSortOption?.icon}</span>
            <span className="category-selector-text">{selectedSortOption?.label}</span>
            <span className="chevron">▼</span>
          </button>
        </div>
      </div>

      <div className="events-container">
        <div className="events-header">
          <h2 className="events-title">
            {selectedCategory === 'all' ? 'All Events' : selectedCategoryData?.name}
          </h2>
          <div className="event-count">
            <span className="event-count-text">{filteredAndSortedEvents.length} events</span>
          </div>
        </div>

        {isLoading ? (
          // Loading skeleton
          <>
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-image skeleton" />
                <div className="skeleton-content">
                  <div className="skeleton-title skeleton" />
                  <div className="skeleton-text skeleton medium" />
                  <div className="skeleton-text skeleton short" />
                  <div className="skeleton-text skeleton long" />
                </div>
              </div>
            ))}
          </>
        ) : filteredAndSortedEvents.length === 0 ? (
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
          filteredAndSortedEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              favoriteEvents={favoriteEvents}
              toggleFavoriteEvent={handleToggleFavorite}
              calendarEvents={calendarEvents}
              onClick={handleEventClick}
            />
          ))
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

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        events={events}
        favoriteEvents={favoriteEvents}
        calendarEvents={calendarEvents}
      />
    </div>
  );
};

export default HomeScreen;
