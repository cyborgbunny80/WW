import React, { useState } from 'react';
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

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favoriteEvents, setFavoriteEvents] = useState(new Set());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({
    city: 'Evansville',
    state: 'IN',
    isManual: false
  });
  const [events, setEvents] = useState(defaultEvents);
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