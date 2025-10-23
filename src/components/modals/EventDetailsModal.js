import React from 'react';
import { formatDate, formatTime } from '../../utils/dateFormatting';
import { getDisplayAttendeeCount } from '../../utils/attendeeCalculation';

const EventDetailsModal = ({ event, isOpen, onClose, toggleFavorite, isFavorite, isLoggedIn, setShowLoginModal, toggleCalendar, isInCalendar, favoriteEvents, calendarEvents }) => {
  if (!isOpen || !event) return null;

  const attendeeCount = getDisplayAttendeeCount(event, favoriteEvents, calendarEvents);

  const handleAddToCalendar = () => {
    toggleCalendar(event);
  };

  const handleShare = async () => {
    const shareData = {
      title: event.title,
      text: `Check out ${event.title} by ${event.organizer}!`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${event.title} - ${window.location.href}`);
        alert('Event link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleGetDirections = () => {
    const query = encodeURIComponent(event.location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="event-details-modal" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="close-button" style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
          ✕
        </button>

        <div className="event-details-image-container">
          <img src={event.image} alt={event.title} className="event-details-image" />
          <div className="event-details-gradient" />
          <button
            className="event-details-favorite"
            onClick={() => toggleFavorite(event.id)}
          >
            <span className="heart-icon">
              {isFavorite ? '❤️' : '🤍'}
            </span>
          </button>
        </div>

        <div className="event-details-content">
          <div className="event-details-header">
            <h2 className="event-details-title">{event.title}</h2>
            <p className="event-details-organizer">{event.organizer}</p>
          </div>

          <div className="event-details-info">
            <div className="detail-row">
              <span className="detail-icon">📅</span>
              <div>
                <div className="detail-label">Date & Time</div>
                <div className="detail-value">
                  {formatDate(event.date)} at {formatTime(event.time)}
                </div>
              </div>
            </div>

            <div className="detail-row">
              <span className="detail-icon">📍</span>
              <div>
                <div className="detail-label">Location</div>
                <div className="detail-value">{event.location}</div>
              </div>
            </div>

            <div className="detail-row">
              <span className="detail-icon">👥</span>
              <div>
                <div className="detail-label">Attendees</div>
                <div className="detail-value">{attendeeCount} people interested</div>
              </div>
            </div>

            <div className="detail-row">
              <span className="detail-icon">💰</span>
              <div>
                <div className="detail-label">Price</div>
                <div className="detail-value">{event.price}</div>
              </div>
            </div>
          </div>

          <div className="event-details-description">
            <h3 className="section-title">About this event</h3>
            <p className="description-text">{event.description}</p>
          </div>

          <div className="event-details-tags">
            <div className="category-tag">
              <span className="category-tag-text">{event.category}</span>
            </div>
          </div>

          <div className="event-details-actions">
            <button
              className={`action-btn ${isInCalendar ? 'action-btn-secondary' : 'action-btn-primary'} calendar-button`}
              onClick={handleAddToCalendar}
            >
              <span className="calendar-button-text">
                {isInCalendar ? '✓ In Calendar' : '📅 Add to Calendar'}
              </span>
            </button>
            <button className="action-btn action-btn-secondary" onClick={handleGetDirections}>
              <span className="action-btn-text">🗺️ Get Directions</span>
            </button>
            <button className="action-btn action-btn-secondary" onClick={handleShare}>
              <span className="action-btn-text">📤 Share Event</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
