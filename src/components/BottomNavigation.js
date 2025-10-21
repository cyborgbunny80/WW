import React from 'react';

const BottomNavigation = ({ currentScreen, setCurrentScreen }) => (
  <div className="bottom-nav">
    <button
      className="nav-item"
      onClick={() => setCurrentScreen('home')}
    >
      <span className={`nav-icon ${currentScreen === 'home' ? 'nav-icon-active' : ''}`}>
        🏠
      </span>
      <span className={`nav-label ${currentScreen === 'home' ? 'nav-label-active' : ''}`}>
        Home
      </span>
    </button>

    <button
      className="nav-item"
      onClick={() => setCurrentScreen('calendar')}
    >
      <span className={`nav-icon ${currentScreen === 'calendar' ? 'nav-icon-active' : ''}`}>
        📅
      </span>
      <span className={`nav-label ${currentScreen === 'calendar' ? 'nav-label-active' : ''}`}>
        Calendar
      </span>
    </button>

    <button
      className="nav-item"
      onClick={() => setCurrentScreen('create')}
    >
      <span className={`nav-icon ${currentScreen === 'create' ? 'nav-icon-active' : ''}`}>
        ➕
      </span>
      <span className={`nav-label ${currentScreen === 'create' ? 'nav-label-active' : ''}`}>
        Create
      </span>
    </button>

    <button
      className="nav-item"
      onClick={() => setCurrentScreen('favorites')}
    >
      <span className={`nav-icon ${currentScreen === 'favorites' ? 'nav-icon-active' : ''}`}>
        ❤️
      </span>
      <span className={`nav-label ${currentScreen === 'favorites' ? 'nav-label-active' : ''}`}>
        Favorites
      </span>
    </button>

    <button
      className="nav-item"
      onClick={() => setCurrentScreen('profile')}
    >
      <span className={`nav-icon ${currentScreen === 'profile' ? 'nav-icon-active' : ''}`}>
        👤
      </span>
      <span className={`nav-label ${currentScreen === 'profile' ? 'nav-label-active' : ''}`}>
        Profile
      </span>
    </button>
  </div>
);

export default BottomNavigation;