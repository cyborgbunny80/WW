import React, { useState, useEffect } from 'react';
import './App.css';
import HomeScreen from './screens/HomeScreen';
import CalendarScreen from './screens/CalendarScreen';
import CreateScreen from './screens/CreateScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import ProfileScreen from './screens/ProfileScreen';
import BottomNavigation from './components/BottomNavigation';
import CategoryDropdown from './components/modals/CategoryDropdown';
import BulkCreateModal from './components/modals/BulkCreateModal';
import LocationPickerModal from './components/modals/LocationPickerModal';
import LoginModal from './components/modals/LoginModal';
import { defaultEvents } from './constants/defaultEvents';
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  setToArray,
  arrayToSet
} from './utils/localStorage';

function App() {
  // Load initial state from localStorage or use defaults
  const [currentScreen, setCurrentScreen] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Load user data from localStorage
  const [favoriteEvents, setFavoriteEvents] = useState(() =>
    arrayToSet(loadFromLocalStorage('whenwin_favorites', []))
  );
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    loadFromLocalStorage('whenwin_isLoggedIn', false)
  );
  const [currentUser, setCurrentUser] = useState(() =>
    loadFromLocalStorage('whenwin_user', null)
  );
  const [currentLocation, setCurrentLocation] = useState(() =>
    loadFromLocalStorage('whenwin_location', {
      city: 'Evansville',
      state: 'IN',
      isManual: false
    })
  );
  
  // Load events from localStorage, include user-created events
  const [events, setEvents] = useState(() => {
    const savedEvents = loadFromLocalStorage('whenwin_events', null);
    if (savedEvents) {
      return savedEvents;
    }
    return defaultEvents;
  });
  
  const [profileTab, setProfileTab] = useState('upcoming');

  // Modal states
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showBulkCreate, setShowBulkCreate] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    name: '',
    email: '',
    city: '',
    state: ''
  });

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    saveToLocalStorage('whenwin_favorites', setToArray(favoriteEvents));
  }, [favoriteEvents]);

  // Save user data to localStorage whenever they change
  useEffect(() => {
    saveToLocalStorage('whenwin_user', currentUser);
    saveToLocalStorage('whenwin_isLoggedIn', isLoggedIn);
  }, [currentUser, isLoggedIn]);

  // Save location to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage('whenwin_location', currentLocation);
  }, [currentLocation]);

  // Save events to localStorage whenever they change
  useEffect(() => {
    saveToLocalStorage('whenwin_events', events);
  }, [events]);

  const sharedProps = {
    currentScreen,
    setCurrentScreen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    favoriteEvents,
    setFavoriteEvents,
    isLoggedIn,
    setIsLoggedIn,
    currentUser,
    setCurrentUser,
    currentLocation,
    setCurrentLocation,
    events,
    setEvents,
    profileTab,
    setProfileTab,
    showCategoryDropdown,
    setShowCategoryDropdown,
    showBulkCreate,
    setShowBulkCreate,
    showLocationPicker,
    setShowLocationPicker,
    showLoginModal,
    setShowLoginModal,
    loginForm,
    setLoginForm
  };

  return (
    <div className="app-container">
      {currentScreen === 'home' && <HomeScreen {...sharedProps} />}
      {currentScreen === 'calendar' && <CalendarScreen {...sharedProps} />}
      {currentScreen === 'create' && <CreateScreen {...sharedProps} />}
      {currentScreen === 'favorites' && <FavoritesScreen {...sharedProps} />}
      {currentScreen === 'profile' && <ProfileScreen {...sharedProps} />}

      <BottomNavigation {...sharedProps} />
      <CategoryDropdown {...sharedProps} />
      <BulkCreateModal {...sharedProps} />
      <LocationPickerModal {...sharedProps} />
      <LoginModal {...sharedProps} />
    </div>
  );
}

export default App;