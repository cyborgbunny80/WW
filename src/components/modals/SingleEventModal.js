import React, { useState, useEffect } from 'react';
import { categories } from '../../constants/categories';

const SingleEventModal = ({
  isOpen,
  onClose,
  currentLocation,
  currentUser,
  onCreateEvent,
  existingEvent = null,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    category: 'community',
    price: 'Free',
    description: '',
    imageUrl: '',
    organizerType: 'name', // 'name', 'organization', 'anonymous'
    organizationName: ''
  });

  const [errors, setErrors] = useState({});

  // Pre-fill form when editing
  useEffect(() => {
    if (isEditing && existingEvent) {
      // Determine organizer type from existing event
      let organizerType = 'name';
      let organizationName = '';

      if (existingEvent.organizer === 'Anonymous') {
        organizerType = 'anonymous';
      } else if (existingEvent.organizer !== currentUser?.name) {
        organizerType = 'organization';
        organizationName = existingEvent.organizer;
      }

      // Find matching category ID
      const matchingCategory = categories.find(cat => cat.name === existingEvent.category);

      setFormData({
        title: existingEvent.title || '',
        date: existingEvent.date || '',
        time: existingEvent.time || '',
        location: existingEvent.location || '',
        category: matchingCategory?.id || 'community',
        price: existingEvent.price || 'Free',
        description: existingEvent.description || '',
        imageUrl: existingEvent.image || '',
        organizerType,
        organizationName
      });
    } else if (!isEditing) {
      // Reset form when not editing
      setFormData({
        title: '',
        date: '',
        time: '',
        location: '',
        category: 'community',
        price: 'Free',
        description: '',
        imageUrl: '',
        organizerType: 'name',
        organizationName: ''
      });
    }
  }, [isEditing, existingEvent, currentUser]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const eventDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today) {
        newErrors.date = 'Event date cannot be in the past';
      }
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (formData.organizerType === 'organization' && !formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Determine organizer name based on selection
    let organizerName;
    if (formData.organizerType === 'anonymous') {
      organizerName = 'Anonymous';
    } else if (formData.organizerType === 'organization') {
      organizerName = formData.organizationName.trim();
    } else {
      organizerName = currentUser?.name || 'Anonymous';
    }

    const eventData = {
      title: formData.title.trim(),
      date: formData.date,
      time: formData.time,
      location: formData.location.trim(),
      city: currentLocation.city,
      state: currentLocation.state,
      category: categories.find(cat => cat.id === formData.category)?.name || 'Community',
      price: formData.price.trim() || 'Free',
      description: formData.description.trim(),
      image: formData.imageUrl.trim() || `https://picsum.photos/400/200?random=${Date.now()}`,
      organizer: organizerName
    };

    // If editing, preserve existing event properties
    const newEvent = isEditing && existingEvent
      ? {
          ...existingEvent,
          ...eventData
        }
      : {
          id: Date.now(),
          attendees: 0,
          createdBy: currentUser?.userId,
          createdByUid: currentUser?.userId, // Store for reliability
          ...eventData
        };

    console.log('Creating event with currentUser:', currentUser);
    console.log('New event data:', newEvent);

    await onCreateEvent(newEvent);

    // Reset form
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      category: 'community',
      price: 'Free',
      description: '',
      imageUrl: '',
      organizerType: 'name',
      organizationName: ''
    });
    setErrors({});
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="single-event-modal" onClick={(e) => e.stopPropagation()}>
        <div className="single-event-header">
          <h2 className="single-event-title">{isEditing ? 'Edit Event' : 'Create New Event'}</h2>
          <button onClick={onClose} className="close-button">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="single-event-form">
          <div className="form-section">
            <label className="form-label">
              Event Title *
              <input
                type="text"
                className={`form-input ${errors.title ? 'form-input-error' : ''}`}
                placeholder="Summer Music Festival"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </label>
          </div>

          <div className="form-row">
            <div className="form-section">
              <label className="form-label">
                Date *
                <input
                  type="date"
                  className={`form-input ${errors.date ? 'form-input-error' : ''}`}
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                />
                {errors.date && <span className="form-error">{errors.date}</span>}
              </label>
            </div>

            <div className="form-section">
              <label className="form-label">
                Time *
                <input
                  type="time"
                  className={`form-input ${errors.time ? 'form-input-error' : ''}`}
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                />
                {errors.time && <span className="form-error">{errors.time}</span>}
              </label>
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">
              Location *
              <input
                type="text"
                className={`form-input ${errors.location ? 'form-input-error' : ''}`}
                placeholder="123 Main St, Downtown"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
              />
              {errors.location && <span className="form-error">{errors.location}</span>}
              <span className="form-hint">
                Event will be listed in: {currentLocation.city}, {currentLocation.state}
              </span>
            </label>
          </div>

          <div className="form-row">
            <div className="form-section">
              <label className="form-label">
                Category *
                <select
                  className="form-input"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                >
                  {categories
                    .filter(cat => cat.id !== 'all')
                    .map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.emoji} {cat.name}
                      </option>
                    ))}
                </select>
              </label>
            </div>

            <div className="form-section">
              <label className="form-label">
                Price
                <input
                  type="text"
                  className="form-input"
                  placeholder="Free or $10"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">
              Description *
              <textarea
                className={`form-textarea ${errors.description ? 'form-input-error' : ''}`}
                placeholder="Tell people about your event..."
                rows="4"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
              {errors.description && <span className="form-error">{errors.description}</span>}
              <span className="form-hint">{formData.description.length} characters</span>
            </label>
          </div>

          <div className="form-section">
            <label className="form-label">
              Organizer *
            </label>
            <div className="organizer-options">
              <label className="radio-option">
                <input
                  type="radio"
                  name="organizerType"
                  value="name"
                  checked={formData.organizerType === 'name'}
                  onChange={(e) => handleChange('organizerType', e.target.value)}
                />
                <span>Your Name ({currentUser?.name || 'Not logged in'})</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="organizerType"
                  value="organization"
                  checked={formData.organizerType === 'organization'}
                  onChange={(e) => handleChange('organizerType', e.target.value)}
                />
                <span>Organization</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="organizerType"
                  value="anonymous"
                  checked={formData.organizerType === 'anonymous'}
                  onChange={(e) => handleChange('organizerType', e.target.value)}
                />
                <span>Anonymous</span>
              </label>
            </div>
            {formData.organizerType === 'organization' && (
              <div style={{ marginTop: '12px' }}>
                <input
                  type="text"
                  className={`form-input ${errors.organizationName ? 'form-input-error' : ''}`}
                  placeholder="Enter organization name"
                  value={formData.organizationName}
                  onChange={(e) => handleChange('organizationName', e.target.value)}
                />
                {errors.organizationName && <span className="form-error">{errors.organizationName}</span>}
              </div>
            )}
          </div>

          <div className="form-section">
            <label className="form-label">
              Image URL (optional)
              <input
                type="url"
                className="form-input"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
              />
              <span className="form-hint">
                Leave blank to use a random placeholder image
              </span>
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="form-button form-button-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="form-button form-button-submit"
            >
              {isEditing ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SingleEventModal;
