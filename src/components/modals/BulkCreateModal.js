import React, { useState } from 'react';
import { createEvent } from '../../services/firebaseServices';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [organizerType, setOrganizerType] = useState('name'); // 'name', 'organization', 'anonymous'
  const [organizationName, setOrganizationName] = useState('');
  const [inputMode, setInputMode] = useState('csv'); // 'text' or 'csv'
  const [csvFile, setCsvFile] = useState(null);

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    // Skip header row if present
    const dataLines = lines[0].toLowerCase().includes('title') || lines[0].toLowerCase().includes('event')
      ? lines.slice(1)
      : lines;

    return dataLines.map(line => {
      // Handle CSV parsing (simple split by comma, can be enhanced)
      const parts = line.split(',').map(part => part.trim().replace(/^"|"$/g, ''));
      return parts;
    });
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      setBulkEventText(text);
      setCsvFile(file);
    };
    reader.readAsText(file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  const downloadTemplate = () => {
    const template = 'Title,Date (YYYY-MM-DD),Time (HH:MM),Location,Category,Price,Description\nSummer BBQ,2024-12-15,18:00,Central Park,Community,Free,Join us for a fun evening';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'event-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const processBulkEvents = async () => {
    if (!isLoggedIn) {
      alert('Please log in to create events');
      return;
    }

    if (organizerType === 'organization' && !organizationName.trim()) {
      alert('Please enter an organization name');
      return;
    }

    setIsProcessing(true);

    // Determine organizer name based on selection
    let organizerName;
    if (organizerType === 'anonymous') {
      organizerName = 'Anonymous';
    } else if (organizerType === 'organization') {
      organizerName = organizationName.trim();
    } else {
      organizerName = currentUser.name;
    }

    let parsedLines;
    if (inputMode === 'csv') {
      parsedLines = parseCSV(bulkEventText);
    } else {
      const lines = bulkEventText.split('\n').filter(line => line.trim());
      parsedLines = lines.map(line => line.split('|').map(part => part.trim()));
    }

    const newEvents = [];
    const errors = [];

    for (let index = 0; index < parsedLines.length; index++) {
      const parts = parsedLines[index];

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
          attendees: 0,
          organizer: organizerName,
          createdBy: currentUser?.userId,
          createdByUid: currentUser?.userId
        };

        try {
          // Save to Firebase
          const firebaseId = await createEvent(newEvent);
          newEvents.push({ ...newEvent, firebaseId });
        } catch (error) {
          console.error(`Error creating event ${index + 1}:`, error);
          errors.push(`Line ${index + 1}: ${newEvent.title}`);
        }
      }
    }

    if (newEvents.length > 0) {
      setEvents([...events, ...newEvents]);
      setBulkEventText('');
      setShowBulkCreate(false);

      if (errors.length > 0) {
        alert(`Added ${newEvents.length} events successfully!\n\nFailed to create ${errors.length} events:\n${errors.join('\n')}`);
      } else {
        alert(`Success! Added ${newEvents.length} events successfully!`);
      }
    } else {
      alert('No valid events to create. Please check your input format.');
    }

    setIsProcessing(false);
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

        <div className="bulk-organizer-section">
          <label className="bulk-organizer-label">Organizer (all events)</label>
          <div className="organizer-options">
            <label className="radio-option">
              <input
                type="radio"
                name="bulkOrganizerType"
                value="name"
                checked={organizerType === 'name'}
                onChange={(e) => setOrganizerType(e.target.value)}
              />
              <span>Your Name ({currentUser?.name || 'Not logged in'})</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="bulkOrganizerType"
                value="organization"
                checked={organizerType === 'organization'}
                onChange={(e) => setOrganizerType(e.target.value)}
              />
              <span>Organization</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="bulkOrganizerType"
                value="anonymous"
                checked={organizerType === 'anonymous'}
                onChange={(e) => setOrganizerType(e.target.value)}
              />
              <span>Anonymous</span>
            </label>
          </div>
          {organizerType === 'organization' && (
            <input
              type="text"
              className="bulk-organization-input"
              placeholder="Enter organization name"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
            />
          )}
        </div>

        <div className="bulk-mode-toggle">
          <button
            className={`mode-toggle-button ${inputMode === 'csv' ? 'active' : ''}`}
            onClick={() => setInputMode('csv')}
          >
            📄 Upload CSV
          </button>
          <button
            className={`mode-toggle-button ${inputMode === 'text' ? 'active' : ''}`}
            onClick={() => setInputMode('text')}
          >
            📝 Paste Text
          </button>
        </div>

        <p className="bulk-location-info">
          📍 Events will be added to: {currentLocation.city}, {currentLocation.state}
        </p>

        {inputMode === 'csv' ? (
          <>
            <div
              className="csv-drop-zone"
              onDrop={handleFileDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById('csv-file-input').click()}
            >
              {csvFile ? (
                <div className="csv-file-selected">
                  <span className="file-icon">📄</span>
                  <span className="file-name">{csvFile.name}</span>
                  <button
                    className="file-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCsvFile(null);
                      setBulkEventText('');
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="csv-drop-prompt">
                  <span className="drop-icon">📁</span>
                  <p className="drop-text">Drop CSV file here or click to browse</p>
                  <p className="drop-hint">Title, Date, Time, Location, Category, Price, Description</p>
                </div>
              )}
            </div>
            <input
              id="csv-file-input"
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
            <button className="download-template-button" onClick={downloadTemplate}>
              ⬇️ Download Template CSV
            </button>
          </>
        ) : (
          <>
            <p className="bulk-create-instructions">
              One event per line, separated by | (pipe):<br />
              <code>Event Name | Date (YYYY-MM-DD) | Time (HH:MM) | Location | Category | Price | Description</code>
            </p>
            <textarea
              className="bulk-create-input"
              placeholder="Team Meeting | 2024-11-15 | 09:00 | Conference Room A | Business | Free | Weekly team sync"
              value={bulkEventText}
              onChange={(e) => setBulkEventText(e.target.value)}
            />
          </>
        )}

        <div className="bulk-create-buttons">
          <button
            className="bulk-create-cancel"
            onClick={() => setShowBulkCreate(false)}
            disabled={isProcessing}
          >
            <span className="bulk-create-cancel-text">Cancel</span>
          </button>
          <button
            className="bulk-create-submit"
            onClick={processBulkEvents}
            disabled={isProcessing}
          >
            <span className="bulk-create-submit-text">
              {isProcessing ? 'Creating Events...' : 'Add Events'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkCreateModal;