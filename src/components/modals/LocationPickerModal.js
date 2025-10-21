import React from 'react';
import { popularCities } from '../../constants/locations';

const LocationPickerModal = ({
  showLocationPicker,
  setShowLocationPicker,
  currentLocation,
  setCurrentLocation,
  currentUser
}) => {
  const changeLocation = (city, state) => {
    setCurrentLocation({
      city,
      state,
      isManual: true
    });
    setShowLocationPicker(false);
  };

  const resetToHomeLocation = () => {
    if (currentUser) {
      setCurrentLocation({
        city: currentUser.homeCity,
        state: currentUser.homeState,
        isManual: true
      });
    }
  };

  if (!showLocationPicker) return null;

  return (
    <div className="modal-overlay" onClick={() => setShowLocationPicker(false)}>
      <div
        className="location-picker-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="location-picker-header">
          <h2 className="location-picker-title">Choose Location</h2>
          <button onClick={() => setShowLocationPicker(false)} className="close-button">
            ✕
          </button>
        </div>

        {currentUser && (
          <button className="home-location-button" onClick={resetToHomeLocation}>
            <span className="home-location-icon">🏠</span>
            <span className="home-location-text">
              Return to {currentUser.homeCity}, {currentUser.homeState}
            </span>
          </button>
        )}

        <h3 className="location-picker-subtitle">Popular Cities</h3>
        <div className="city-list">
          {popularCities.map((location, index) => (
            <button
              key={index}
              className={`city-item ${
                currentLocation.city === location.city &&
                currentLocation.state === location.state
                  ? 'city-item-active'
                  : ''
              }`}
              onClick={() => changeLocation(location.city, location.state)}
            >
              <span className="city-name">
                {location.city}, {location.state}
              </span>
              {currentLocation.city === location.city &&
                currentLocation.state === location.state && (
                  <span className="city-checkmark">✓</span>
                )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationPickerModal;