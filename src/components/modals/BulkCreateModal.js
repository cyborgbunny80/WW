import React, { useState } from 'react';

const BulkCreateModal = ({
  showBulkCreate,
  setShowBulkCreate,
  currentLocation,
  currentUser,
  events,
  setEvents,
  isLoggedIn
}) => {
  const [bulkEventText, setBulkEventText] = useState('');

  const processBulkEvents = () => {
    if (!isLoggedIn) {
      alert('Please log in to create events');
      return;
    }

    const lines = bulkEventText.split('\n').filter(line => line.trim());
    const newEvents = [];

    lines.forEach((line, index) => {
      const parts = line.split('|').map(part => part.trim());
      if (parts.length >= 4) {
        const newEvent = {
          id: Date.now() + index,
          title: parts[0] || `Event ${index + 1}`,
          date: parts[1] || '2024-12-01',
          time: parts[2] || '18:00',
          location: parts[3] || 'TBD',
          city: currentLocation.city,
          state: currentLocation.state,
          category: parts[4] || 'Community',
          price: parts[5] || 'Free',
          description: parts[6] || 'Event details to be announced.',
          image: `https://picsum.photos/400/200?random=${Date.now() + index}`,
          attendees: Math.floor(Math.random() * 100),
          organizer: currentUser.name
        };
        newEvents.push(newEvent);
      }
    });

    if (newEvents.length > 0) {
      setEvents([...events, ...newEvents]);
      setBulkEventText('');
      setShowBulkCreate(false);
      alert(`Success! Added ${newEvents.length} events successfully!`);
    }
  };

  if (!showBulkCreate) return null;

  return (
    <div className="modal-overlay" onClick={() => setShowBulkCreate(false)}>
      <div
        className="bulk-create-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bulk-create-header">
          <h2 className="bulk-create-title">Bulk Add Events</h2>
          <button onClick={() => setShowBulkCreate(false)} className="close-button">
            ✕
          </button>
        </div>

        <p className="bulk-create-instructions">
          Enter one event per line in this format:<br />
          Event Name | Date (YYYY-MM-DD) | Time (HH:MM) | Location | Category | Price | Description
        </p>

        <p className="bulk-create-example">
          Example:<br />
          Team Meeting | 2024-11-15 | 09:00 | Conference Room A | Business | Free | Weekly team sync
        </p>

        <p className="bulk-create-location">
          Events will be added to: {currentLocation.city}, {currentLocation.state}
        </p>

        <textarea
          className="bulk-create-input"
          placeholder="Paste your events here..."
          value={bulkEventText}
          onChange={(e) => setBulkEventText(e.target.value)}
        />

        <div className="bulk-create-buttons">
          <button
            className="bulk-create-cancel"
            onClick={() => setShowBulkCreate(false)}
          >
            <span className="bulk-create-cancel-text">Cancel</span>
          </button>
          <button
            className="bulk-create-submit"
            onClick={processBulkEvents}
          >
            <span className="bulk-create-submit-text">Add Events</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkCreateModal;