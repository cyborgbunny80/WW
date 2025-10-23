import React from 'react';

const BottomNavigation = ({ currentScreen, setCurrentScreen }) => (
  <div className="bottom-nav">
    <button
      className={`nav-item ${currentScreen === 'home' ? 'nav-item-active' : ''}`}
      onClick={() => setCurrentScreen('home')}
    >
      <span className="nav-icon">
        🏠
      </span>
      <span className="nav-label">
        Home
      </span>
    </button>

    <button
      className={`nav-item ${currentScreen === 'calendar' ? 'nav-item-active' : ''}`}
      onClick={() => setCurrentScreen('calendar')}
    >
      <span className="nav-icon">
        📅
      </span>
      <span className="nav-label">
        Calendar
      </span>
    </button>

    <button
      className={`nav-item ${currentScreen === 'create' ? 'nav-item-active' : ''}`}
      onClick={() => setCurrentScreen('create')}
    >
      <span className="nav-icon">
        ➕
      </span>
      <span className="nav-label">
        Create
      </span>
    </button>

    <button
      className={`nav-item ${currentScreen === 'favorites' ? 'nav-item-active' : ''}`}
      onClick={() => setCurrentScreen('favorites')}
    >
      <span className="nav-icon">
        ❤️
      </span>
      <span className="nav-label">
        Favorites
      </span>
    </button>

    <button
      className={`nav-item ${currentScreen === 'profile' ? 'nav-item-active' : ''}`}
      onClick={() => setCurrentScreen('profile')}
    >
      <span className="nav-icon">
        👤
      </span>
      <span className="nav-label">
        Profile
      </span>
    </button>
  </div>
);

export default BottomNavigation;