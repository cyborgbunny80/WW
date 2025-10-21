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
import { signUp, logIn, logOut, onAuthChange } from './services/authService';
import { getUserFavorites, saveFavorite, removeFavorite } from './services/firebaseServices';
import { loadFromLocalStorage, saveToLocalStorage, arrayToSet, setToArray } from './utils/localStorage';

function App() {
  // UI state
  const [currentScreen, setCurrentScreen] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [profileTab, setProfileTab] = useState('upcoming');

  // Firebase auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Location state
  const [currentLocation, setCurrentLocation] = useState(() =>
    loadFromLocalStorage('whenwin_location', {
      city: 'Evansville',
      state: 'IN',
      isManual: false
    })
  );

  // Events and favorites state
  const [events, setEvents] = useState(defaultEvents);
  const [favoriteEvents, setFavoriteEvents] = useState(new Set());

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
  const [isSignUp, setIsSignUp] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setAuthLoading(true);
      if (user) {
        // User is logged in
        setIsLoggedIn(true);
        setCurrentUser(user);
        setUserId(user.userId);
        
        // Load user's favorites from Firebase
        try {
          const userFavorites = await getUserFavorites(user.userId);
          setFavoriteEvents(new Set(userFavorites));
        } catch (error) {
          console.error('Error loading favorites:', error);
        }
      } else {
        // User is logged out
        setIsLoggedIn(false);
        setCurrentUser(null);
        setUserId(null);
        setFavoriteEvents(new Set());
      }
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  // Save location to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage('whenwin_location', currentLocation);
  }, [currentLocation]);

  // Handle signup
  const handleSignUp = async () => {
    if (!loginForm.name || !loginForm.email || !loginForm.password) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await signUp(
        loginForm.email,
        loginForm.password,
        loginForm.name,
        loginForm.city || currentLocation.city,
        loginForm.state || currentLocation.state
      );
      
      // Clear form
      setLoginForm({ name: '', email: '', city: '', state: '', password: '' });
      setIsSignUp(false);
      setShowLoginModal(false);
    } catch (error) {
      alert('Sign up failed: ' + error.message);
    }
  };

  // Handle login
  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      alert('Please enter email and password');
      return;
    }

    try {
      await logIn(loginForm.email, loginForm.password);
      setLoginForm({ name: '', email: '', city: '', state: '', password: '' });
      setShowLoginModal(false);
      setIsSignUp(false);
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logOut();
      setLoginForm({ name: '', email: '', city: '', state: '', password: '' });
      alert('You have been logged out successfully.');
    } catch (error) {
      alert('Logout failed: ' + error.message);
    }
  };

  // Toggle favorite - syncs with Firebase
  const toggleFavoriteEvent = async (eventId) => {
    if (!isLoggedIn) {
      alert('Please log in to favorite events');
      return;
    }

    try {
      const newFavoriteEvents = new Set(favoriteEvents);
      
      if (newFavoriteEvents.has(eventId)) {
        // Remove favorite
        newFavoriteEvents.delete(eventId);
        await removeFavorite(userId, eventId);
      } else {
        // Add favorite
        newFavoriteEvents.add(eventId);
        await saveFavorite(userId, eventId);
      }
      
      setFavoriteEvents(newFavoriteEvents);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorite');
    }
  };

  const sharedProps = {
    currentScreen,
    setCurrentScreen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    favoriteEvents,
    setFavoriteEvents: toggleFavoriteEvent, // Use firebase-synced function
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
    setLoginForm,
    handleLogin,
    handleLogout,
    handleSignUp,
    isSignUp,
    setIsSignUp,
    authLoading
  };

  if (authLoading) {
    return (
      <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

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