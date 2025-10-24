import React, { useState } from 'react';
import { formatTime } from '../utils/dateFormatting';
import { filterEventsByLocation } from '../utils/eventFiltering';
import EventDetailsModal from '../components/modals/EventDetailsModal';
import { categories } from '../constants/categories';

const CalendarScreen = ({
  currentLocation,
  setShowLocationPicker,
  events,
  favoriteEvents,
  toggleFavoriteEvent,
  calendarEvents,
  toggleCalendarEvent,
  isLoggedIn,
  setShowLoginModal,
  sortBy,
  showSortDropdown,
  setShowSortDropdown
}) => {
  const locationFilteredEvents = filterEventsByLocation(
    events,
    currentLocation.city,
    currentLocation.state
  );

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const eventDates = locationFilteredEvents.reduce((acc, event) => {
    const eventDate = new Date(event.date);
    if (eventDate.getMonth() === selectedMonth && eventDate.getFullYear() === selectedYear) {
      const day = eventDate.getDate();
      if (!acc[day]) acc[day] = [];
      acc[day].push(event);
    }
    return acc;
  }, {});

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
    setSelectedDay(null);
  };

  const handleDayClick = (day) => {
    console.log('Day clicked:', day, 'Has events:', !!eventDates[day], 'Events:', eventDates[day]);
    if (eventDates[day]) {
      setSelectedDay(day);
    }
  };

  const handleEventClick = (event) => {
    console.log('Event clicked:', event);
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  // Use categories for sorting
  const selectedCategory = categories.find(cat => cat.id === sortBy) || categories[0];

  // Check if we're viewing the current month
  const isCurrentMonth = selectedMonth === today.getMonth() && selectedYear === today.getFullYear();

  let displayedEvents = selectedDay
    ? eventDates[selectedDay] || []
    : isCurrentMonth
      ? eventDates[today.getDate()] || []
      : [];

  // Filter by category
  if (sortBy && sortBy !== 'all') {
    displayedEvents = displayedEvents.filter(event => {
      const categoryMatch = categories.find(cat => cat.name === event.category);
      return categoryMatch && categoryMatch.id === sortBy;
    });
  }

  const displayTitle = selectedDay
    ? `Events on ${monthNames[selectedMonth]} ${selectedDay}, ${selectedYear}`
    : isCurrentMonth
      ? "Today's Events"
      : `Events in ${monthNames[selectedMonth]} ${selectedYear}`;

  console.log('Calendar Debug:', {
    selectedMonth,
    selectedYear,
    selectedDay,
    eventDates,
    locationFilteredEvents: locationFilteredEvents.length,
    displayedEvents: displayedEvents?.length || 0,
    isCurrentMonth
  });

  return (
    <div className="screen-container">
      <div className="page-header">
        <h1 className="page-title">Calendar</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
          <button
            className="calendar-category-selector"
            onClick={() => setShowSortDropdown(true)}
          >
            <span className="category-emoji">{selectedCategory?.emoji}</span>
            <span className="category-selector-text">{selectedCategory?.name}</span>
            <span className="chevron">▼</span>
          </button>
        </div>
      </div>

      <div className="calendar-container">
        <div className="calendar-card">
          <div className="calendar-header">
            <button className="calendar-nav-button" onClick={handlePreviousMonth}>
              ←
            </button>
            <h2 className="calendar-month">
              {monthNames[selectedMonth]} {selectedYear}
            </h2>
            <button className="calendar-nav-button" onClick={handleNextMonth}>
              →
            </button>
          </div>

          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="calendar-day-header">
                <span className="calendar-day-header-text">{day}</span>
              </div>
            ))}

            {Array.from({ length: firstDayOfMonth }, (_, i) => (
              <div key={`empty-${i}`} className="calendar-day"></div>
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const hasEvents = eventDates[day];
              const isToday =
                today.getDate() === day &&
                today.getMonth() === selectedMonth &&
                today.getFullYear() === selectedYear;
              const isSelected = selectedDay === day;

              return (
                <div
                  key={day}
                  className={`calendar-day ${isToday ? 'calendar-day-today' : ''} ${
                    hasEvents ? 'calendar-day-with-events' : ''
                  } ${isSelected ? 'calendar-day-selected' : ''}`}
                  onClick={() => handleDayClick(day)}
                  style={{ cursor: hasEvents ? 'pointer' : 'default' }}
                >
                  <span className={`calendar-day-text ${isToday ? 'calendar-day-text-today' : ''}`}>
                    {day}
                  </span>
                  {hasEvents && hasEvents.length > 0 && (
                    <div className="event-dots">
                      {hasEvents.slice(0, 3).map((event, index) => {
                        const isInCalendar = calendarEvents.has(String(event.id));
                        return (
                          <div
                            key={index}
                            className={`event-dot ${isInCalendar ? 'event-dot-in-calendar' : ''}`}
                          />
                        );
                      })}
                      {hasEvents.length > 3 && <span className="event-dot-more">+</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="today-events-card">
          <h3 className="today-events-title">{displayTitle}</h3>
          {displayedEvents && displayedEvents.length > 0 ? (
            <div className="today-events-list">
              {displayedEvents.map(event => {
                const isInCalendar = calendarEvents.has(String(event.id));
                return (
                  <div
                    key={event.id}
                    className={`today-event-item ${isInCalendar ? 'today-event-item-in-calendar' : ''}`}
                    onClick={() => handleEventClick(event)}
                    style={{ cursor: 'pointer' }}
                  >
                  <img src={event.image} alt={event.title} className="today-event-image" />
                  <div className="today-event-info">
                    <h4 className="today-event-title">{event.title}</h4>
                    <p className="today-event-time">
                      {formatTime(event.time)} • {event.location}
                    </p>
                  </div>
                  <div className="today-event-chevron">→</div>
                </div>
                );
              })}
            </div>
          ) : (
            <p className="no-events-text">
              {selectedDay
                ? `No events on ${monthNames[selectedMonth]} ${selectedDay}`
                : isCurrentMonth
                  ? `No events today in ${currentLocation.city}`
                  : `No events in ${monthNames[selectedMonth]} ${selectedYear} for ${currentLocation.city}`}
            </p>
          )}
        </div>
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

export default CalendarScreen;