import React from 'react';
import { formatTime } from '../utils/dateFormatting';
import { filterEventsByLocation } from '../utils/eventFiltering';

const CalendarScreen = ({
  currentLocation,
  setShowLocationPicker,
  events
}) => {
  const locationFilteredEvents = filterEventsByLocation(
    events,
    currentLocation.city,
    currentLocation.state
  );

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const eventDates = locationFilteredEvents.reduce((acc, event) => {
    const eventDate = new Date(event.date);
    if (eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear) {
      const day = eventDate.getDate();
      if (!acc[day]) acc[day] = [];
      acc[day].push(event);
    }
    return acc;
  }, {});

  return (
    <div className="screen-container">
      <div className="page-header">
        <h1 className="page-title">Calendar</h1>
        <button
          className="location-row"
          onClick={() => setShowLocationPicker(true)}
        >
          <span className="location-icon">📍</span>
          <span className="page-subtitle">
            {currentLocation.city}, {currentLocation.state}
          </span>
          <span className="location-chevron">▼</span>
        </button>
      </div>

      <div className="calendar-container">
        <div className="calendar-card">
          <h2 className="calendar-month">
            {monthNames[currentMonth]} {currentYear}
          </h2>

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
              const isToday = today.getDate() === day;

              return (
                <div
                  key={day}
                  className={`calendar-day ${isToday ? 'calendar-day-today' : ''} ${
                    hasEvents ? 'calendar-day-with-events' : ''
                  }`}
                >
                  <span className={`calendar-day-text ${isToday ? 'calendar-day-text-today' : ''}`}>
                    {day}
                  </span>
                  {hasEvents && hasEvents.length > 0 && (
                    <div className="event-dots">
                      {hasEvents.slice(0, 3).map((_, index) => (
                        <div key={index} className="event-dot" />
                      ))}
                      {hasEvents.length > 3 && <span className="event-dot-more">+</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="today-events-card">
          <h3 className="today-events-title">Today's Events</h3>
          {eventDates[today.getDate()] && eventDates[today.getDate()].length > 0 ? (
            <div className="today-events-list">
              {eventDates[today.getDate()].map(event => (
                <div key={event.id} className="today-event-item">
                  <img src={event.image} alt={event.title} className="today-event-image" />
                  <div className="today-event-info">
                    <h4 className="today-event-title">{event.title}</h4>
                    <p className="today-event-time">
                      {formatTime(event.time)} • {event.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-events-text">No events today in {currentLocation.city}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarScreen;