import React from 'react';
import { formatDate, formatTime } from '../../utils/dateFormatting';

const NotificationsModal = ({ isOpen, onClose, events, favoriteEvents, calendarEvents }) => {
  if (!isOpen) return null;

  // Get upcoming events that are either favorited or in calendar
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      const isUpcoming = eventDate >= today;
      const isFavorite = favoriteEvents.has(event.id);
      const isInCalendar = calendarEvents.has(String(event.id));
      return isUpcoming && (isFavorite || isInCalendar);
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Convert to notification format
  const notifications = upcomingEvents.map(event => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    const daysUntil = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

    const isFavorite = favoriteEvents.has(event.id);
    const isInCalendar = calendarEvents.has(String(event.id));

    let type, icon, title;
    if (isInCalendar && isFavorite) {
      type = 'both';
      icon = '📅❤️';
      title = 'In Calendar & Favorited';
    } else if (isInCalendar) {
      type = 'calendar';
      icon = '📅';
      title = 'In Your Calendar';
    } else {
      type = 'favorite';
      icon = '❤️';
      title = 'Favorited Event';
    }

    let timeMessage;
    if (daysUntil === 0) {
      timeMessage = 'Today!';
    } else if (daysUntil === 1) {
      timeMessage = 'Tomorrow';
    } else if (daysUntil <= 7) {
      timeMessage = `In ${daysUntil} days`;
    } else {
      timeMessage = formatDate(event.date);
    }

    return {
      id: event.id,
      type,
      title,
      message: `${event.title} • ${timeMessage} at ${formatTime(event.time)}`,
      time: event.location,
      icon,
      event
    };
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="notifications-modal" onClick={(e) => e.stopPropagation()}>
        <div className="notifications-header">
          <h2 className="notifications-title">Notifications</h2>
          <button onClick={onClose} className="close-button">
            ✕
          </button>
        </div>

        <div className="notifications-content">
          {notifications.length === 0 ? (
            <div className="empty-notifications">
              <span className="empty-icon">🔔</span>
              <h3 className="empty-title">No upcoming events</h3>
              <p className="empty-text">
                Favorite events or add them to your calendar to get reminders about upcoming dates!
              </p>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item notification-item-${notification.type}`}
                >
                  <span className="notification-icon">{notification.icon}</span>
                  <div className="notification-content">
                    <h4 className="notification-title">{notification.title}</h4>
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-time">📍 {notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="notifications-footer">
          <button className="mark-read-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
