import React from 'react';
import { formatDate, formatTime } from '../utils/dateFormatting';
import { getDisplayAttendeeCount } from '../utils/attendeeCalculation';

const EventCard = ({ event, showPastLabel = false, favoriteEvents, toggleFavoriteEvent, onClick, calendarEvents }) => {
  const isInCalendar = calendarEvents && calendarEvents.has(String(event.id));
  const attendeeCount = getDisplayAttendeeCount(event, favoriteEvents, calendarEvents);

  return (
    <div className={`event-card ${isInCalendar ? 'event-card-in-calendar' : ''}`} onClick={() => onClick && onClick(event)}>
      {event.image && (
        <div className="image-container">
          <img src={event.image} alt={event.title} className="event-image" />
          {showPastLabel && (
            <div className="past-label">
              <span className="past-label-text">Past Event</span>
            </div>
          )}
          <button
            className="action-button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavoriteEvent(event.id);
            }}
          >
            <span className="heart-icon">
              {favoriteEvents.has(event.id) ? '❤️' : '🤍'}
            </span>
          </button>
        </div>
      )}

      <div className="event-content">
        <h3 className="event-title">{event.title}</h3>
        <p className="organizer">{event.organizer}</p>

        <div className="event-details">
          <div className="detail-row">
            <span className="detail-icon">📅</span>
            <span className="detail-text">
              {formatDate(event.date)} at {formatTime(event.time)}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-icon">📍</span>
            <span className="detail-text">{event.location}</span>
          </div>
          <div className="detail-row">
            <span className="detail-icon">👥</span>
            <span className="detail-text">{attendeeCount} interested</span>
          </div>
        </div>

        <p className="description">{event.description}</p>

        <div className="tag-container">
          <div className="category-tag">
            <span className="category-tag-text">{event.category}</span>
          </div>
          <div className="price-tag">
            <span className="price-tag-text">{event.price}</span>
          </div>
        </div>

        {!showPastLabel && onClick && (
          <button
            className="calendar-button"
            onClick={(e) => {
              e.stopPropagation();
              onClick(event);
            }}
          >
            <span className="calendar-button-text">View Details</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
