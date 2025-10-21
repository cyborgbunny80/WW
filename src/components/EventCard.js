import React from 'react';
import { formatDate, formatTime } from '../utils/dateFormatting';

const EventCard = ({ event, showPastLabel = false, favoriteEvents, toggleFavoriteEvent }) => {
  return (
    <div className="event-card">
      <div className="image-container">
        <img src={event.image} alt={event.title} className="event-image" />
        {showPastLabel && (
          <div className="past-label">
            <span className="past-label-text">Past Event</span>
          </div>
        )}
        <button
          className="action-button"
          onClick={() => toggleFavoriteEvent(event.id)}
        >
          <span className="heart-icon">
            {favoriteEvents.has(event.id) ? '❤️' : '🤍'}
          </span>
        </button>
      </div>

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
            <span className="detail-text">{event.attendees} interested</span>
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

        {!showPastLabel && (
          <button className="calendar-button">
            <span className="calendar-button-text">📅 Add to Calendar</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
