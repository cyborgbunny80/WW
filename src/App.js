import React, { useState, useEffect } from 'react';
import './App.css';
import HomeScreen from './screens/HomeScreen';
import CalendarScreen from './screens/CalendarScreen';
import CreateScreen from './screens/CreateScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import ProfileScreen from './screens/ProfileScreen';
import BottomNavigation from './components/BottomNavigation';
import CategoryDropdown from './components/modals/CategoryDropdown';
import SortDropdown from './components/modals/SortDropdown';
import BulkCreateModal from './components/modals/BulkCreateModal';
import LocationPickerModal from './components/modals/LocationPickerModal';
import LoginModal from './components/modals/LoginModal';
import { defaultEvents } from './constants/defaultEvents';
import { signUp, logIn, logOut, onAuthChange, resetPassword } from './services/authService';
import { getFirebaseErrorMessage } from './utils/validation';
import { getUserFavorites, saveFavorite, removeFavorite, getAllEvents, getUserCalendar, saveToCalendar, removeFromCalendar } from './services/firebaseServices';
import { loadFromLocalStorage, saveToLocalStorage } from './utils/localStorage';

function App() {
  // UI state
  const [currentScreen, setCurrentScreen] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
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
  const [calendarEvents, setCalendarEvents] = useState(new Set());

  // Modal states
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
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
    // Safety timeout - if auth doesn't respond in 3 seconds, continue anyway
    const timeoutId = setTimeout(() => {
      console.warn('Auth initialization timeout - continuing without auth');
      setAuthLoading(false);
    }, 3000);

    const unsubscribe = onAuthChange(async (user) => {
      clearTimeout(timeoutId); // Clear the timeout since auth responded

      if (user) {
        // User is logged in
        setIsLoggedIn(true);
        setCurrentUser(user);
        setUserId(user.userId);

        // Load user's favorites from Firebase
        try {
          const userFavorites = await getUserFavorites(user.userId);
          console.log('Loaded favorites from Firebase:', userFavorites);

          // Ensure userFavorites is an array
          if (Array.isArray(userFavorites)) {
            setFavoriteEvents(new Set(userFavorites));
          } else {
            console.error('getUserFavorites did not return an array:', userFavorites);
            setFavoriteEvents(new Set());
          }
        } catch (error) {
          console.error('Error loading favorites:', error);
          setFavoriteEvents(new Set());
        }

        // Load user's calendar events from Firebase
        try {
          const userCalendar = await getUserCalendar(user.userId);
          console.log('Loaded calendar events from Firebase:', userCalendar);

          // Ensure userCalendar is an array
          if (Array.isArray(userCalendar)) {
            setCalendarEvents(new Set(userCalendar));
          } else {
            console.error('getUserCalendar did not return an array:', userCalendar);
            setCalendarEvents(new Set());
          }
        } catch (error) {
          console.error('Error loading calendar events:', error);
          setCalendarEvents(new Set());
        }
      } else {
        // User is logged out
        setIsLoggedIn(false);
        setCurrentUser(null);
        setUserId(null);
        setFavoriteEvents(new Set());
        setCalendarEvents(new Set());
      }
      setAuthLoading(false);
    });

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  // Save location to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage('whenwin_location', currentLocation);
  }, [currentLocation]);

  // Load events from Firebase on app startup
  useEffect(() => {
    const loadEvents = async () => {
      try {
        console.log('Loading events from Firebase...');
        const firebaseEvents = await getAllEvents();
        console.log('Loaded Firebase events:', firebaseEvents.length);

        if (firebaseEvents.length > 0) {
          // Ensure all Firebase event IDs are strings
          const normalizedFirebaseEvents = firebaseEvents.map(event => ({
            ...event,
            id: String(event.id)
          }));

          // Ensure all default event IDs are strings
          const normalizedDefaultEvents = defaultEvents.map(event => ({
            ...event,
            id: String(event.id)
          }));

          // Merge Firebase events with default events (Firebase events take priority)
          const mergedEvents = [...normalizedFirebaseEvents, ...normalizedDefaultEvents];
          // Remove duplicates based on ID
          const uniqueEvents = mergedEvents.filter((event, index, self) =>
            index === self.findIndex((e) => e.id === event.id)
          );
          setEvents(uniqueEvents);
          console.log('Total events loaded:', uniqueEvents.length);
        } else {
          // If no Firebase events, use default events with normalized IDs
          console.log('No Firebase events found, using default events');
          const normalizedDefaultEvents = defaultEvents.map(event => ({
            ...event,
            id: String(event.id)
          }));
          setEvents(normalizedDefaultEvents);
        }
      } catch (error) {
        console.error('Error loading events from Firebase:', error);
        // Fall back to default events if there's an error
        const normalizedDefaultEvents = defaultEvents.map(event => ({
          ...event,
          id: String(event.id)
        }));
        setEvents(normalizedDefaultEvents);
      }
    };

    loadEvents();
  }, []); // Run once on mount

  // Handle signup
  const handleSignUp = async () => {
    try {
      await signUp(
        loginForm.email,
        loginForm.password,
        loginForm.name,
        loginForm.city || currentLocation.city,
        loginForm.state || currentLocation.state
      );

      // Show success message
      alert('Account created successfully! Please check your email to verify your account.');

      // Clear form
      setLoginForm({ name: '', email: '', city: '', state: '', password: '', confirmPassword: '' });
      setIsSignUp(false);
      setShowLoginModal(false);
    } catch (error) {
      const errorMessage = getFirebaseErrorMessage(error.code);
      alert(errorMessage);
      // Don't re-throw - let the modal handle the error state
    }
  };

  // Handle login
  const handleLogin = async (rememberMe = false) => {
    try {
      const userData = await logIn(loginForm.email, loginForm.password, rememberMe);

      // Show warning if email not verified
      if (!userData.emailVerified) {
        alert('Welcome! Please verify your email address to access all features.');
      }

      setLoginForm({ name: '', email: '', city: '', state: '', password: '', confirmPassword: '' });
      setShowLoginModal(false);
      setIsSignUp(false);
    } catch (error) {
      const errorMessage = getFirebaseErrorMessage(error.code);
      alert(errorMessage);
      // Don't re-throw - let the modal handle the error state
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logOut();
      setLoginForm({ name: '', email: '', city: '', state: '', password: '', confirmPassword: '' });
      alert('You have been logged out successfully.');
    } catch (error) {
      const errorMessage = getFirebaseErrorMessage(error.code);
      alert(errorMessage);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (email) => {
    try {
      await resetPassword(email);
    } catch (error) {
      const errorMessage = getFirebaseErrorMessage(error.code);
      alert(errorMessage);
      throw error; // Re-throw to stop loading state in modal
    }
  };

  // Toggle favorite - syncs with Firebase
  const toggleFavoriteEvent = async (eventId) => {
    console.log('toggleFavoriteEvent called with:', eventId);
    console.log('Current favoriteEvents:', favoriteEvents);
    console.log('favoriteEvents is Set?', favoriteEvents instanceof Set);

    if (!isLoggedIn) {
      alert('Please log in to favorite events');
      setShowLoginModal(true);
      return;
    }

    // Optimistically update UI first
    const newFavoriteEvents = new Set(favoriteEvents);
    const wasAlreadyFavorited = newFavoriteEvents.has(eventId);

    if (wasAlreadyFavorited) {
      newFavoriteEvents.delete(eventId);
    } else {
      newFavoriteEvents.add(eventId);
    }
    console.log('Setting new favorites:', newFavoriteEvents);
    setFavoriteEvents(newFavoriteEvents);

    // Then sync with Firebase
    try {
      if (wasAlreadyFavorited) {
        await removeFavorite(userId, eventId);
      } else {
        await saveFavorite(userId, eventId);
      }
    } catch (error) {
      console.error('Error syncing favorite with Firebase:', error);

      // Revert the optimistic update on error
      const revertedFavorites = new Set(favoriteEvents);
      if (wasAlreadyFavorited) {
        revertedFavorites.add(eventId);
      } else {
        revertedFavorites.delete(eventId);
      }
      setFavoriteEvents(revertedFavorites);

      // Show user-friendly error message
      const errorMessage = error.message || 'Failed to sync favorite. Please try again.';
      alert(errorMessage);
    }
  };

  // Toggle calendar event - syncs with Firebase and downloads .ics file
  const toggleCalendarEvent = async (event) => {
    if (!isLoggedIn) {
      alert('Please log in to add events to your calendar');
      setShowLoginModal(true);
      return;
    }

    const eventId = String(event.id);
    const isAlreadyAdded = calendarEvents.has(eventId);

    // Optimistically update UI
    const newCalendarEvents = new Set(calendarEvents);
    if (isAlreadyAdded) {
      newCalendarEvents.delete(eventId);
    } else {
      newCalendarEvents.add(eventId);
    }
    setCalendarEvents(newCalendarEvents);

    // Sync with Firebase
    try {
      if (isAlreadyAdded) {
        await removeFromCalendar(userId, eventId);
        alert('Event removed from your calendar');
      } else {
        await saveToCalendar(userId, eventId);
        // Generate and download .ics file for device calendar
        downloadICSFile(event);
        alert('Event added to your calendar! An .ics file has been downloaded to add to your device calendar.');
      }
    } catch (error) {
      console.error('Error syncing calendar event with Firebase:', error);

      // Revert the optimistic update on error
      const revertedCalendar = new Set(calendarEvents);
      if (isAlreadyAdded) {
        revertedCalendar.add(eventId);
      } else {
        revertedCalendar.delete(eventId);
      }
      setCalendarEvents(revertedCalendar);

      const errorMessage = error.message || 'Failed to sync calendar event. Please try again.';
      alert(errorMessage);
    }
  };

  // Generate and download .ics file for adding to device calendar
  const downloadICSFile = (event) => {
    // Format date and time for .ics format (YYYYMMDDTHHMMSS)
    const eventDate = new Date(event.date + 'T' + event.time);
    const formatICSDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}${month}${day}T${hours}${minutes}00`;
    };

    // End time is 2 hours after start (or can be customized)
    const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//When? Win! App//Event Calendar//EN
BEGIN:VEVENT
UID:${event.id}@whenwin.app
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(eventDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${event.title}
DESCRIPTION:${event.description || 'Event from When? Win! App'}
LOCATION:${event.location}, ${event.city}, ${event.state}
ORGANIZER:${event.organizer}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    // Create blob and download
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const sharedProps = {
    currentScreen,
    setCurrentScreen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    favoriteEvents,
    toggleFavoriteEvent, // Use firebase-synced function for toggling
    calendarEvents,
    toggleCalendarEvent,
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
    showSortDropdown,
    setShowSortDropdown,
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
    authLoading,
    handlePasswordReset
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
      <SortDropdown {...sharedProps} />
      <BulkCreateModal {...sharedProps} />
      <LocationPickerModal {...sharedProps} />
      <LoginModal {...sharedProps} />
    </div>
  );
}

export default App;