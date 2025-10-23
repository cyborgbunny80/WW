import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  getDoc
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';

// USERS
export const createUserProfile = async (userId, userData) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      name: userData.name,
      email: userData.email,
      homeCity: userData.homeCity,
      homeState: userData.homeState,
      avatar: userData.avatar,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// EVENTS
export const createEvent = async (eventData) => {
  try {
    const docRef = await addDoc(collection(db, 'events'), {
      ...eventData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const getEventsByLocation = async (city, state) => {
  try {
    const q = query(
      collection(db, 'events'),
      where('city', '==', city),
      where('state', '==', state)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting events:', error);
    return [];
  }
};

export const getAllEvents = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'events'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting all events:', error);
    return [];
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await setDoc(eventRef, {
      ...eventData,
      updatedAt: new Date()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    await deleteDoc(doc(db, 'events', eventId));
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// FAVORITES
export const saveFavorite = async (userId, eventId) => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase is not configured. Please add Firebase environment variables to enable favorites.');
  }
  try {
    // Convert eventId to string for Firestore document path
    const eventIdStr = String(eventId);
    const favRef = doc(db, 'users', userId, 'favorites', eventIdStr);
    await setDoc(favRef, { eventId: eventIdStr, savedAt: new Date() });
  } catch (error) {
    console.error('Error saving favorite:', error);
    throw error;
  }
};

export const removeFavorite = async (userId, eventId) => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase is not configured. Please add Firebase environment variables to enable favorites.');
  }
  try {
    // Convert eventId to string for Firestore document path
    const eventIdStr = String(eventId);
    await deleteDoc(doc(db, 'users', userId, 'favorites', eventIdStr));
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

export const getUserFavorites = async (userId) => {
  if (!isFirebaseConfigured() || !db) {
    console.warn('Firebase is not configured. Favorites are disabled.');
    return [];
  }
  try {
    const snapshot = await getDocs(collection(db, 'users', userId, 'favorites'));
    return snapshot.docs.map(doc => doc.data().eventId);
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

// CALENDAR EVENTS (user's personal calendar)
export const saveToCalendar = async (userId, eventId) => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase is not configured. Please add Firebase environment variables to enable calendar.');
  }
  try {
    // Convert eventId to string for Firestore document path
    const eventIdStr = String(eventId);
    const calendarRef = doc(db, 'users', userId, 'calendar', eventIdStr);
    await setDoc(calendarRef, { eventId: eventIdStr, addedAt: new Date() });
  } catch (error) {
    console.error('Error saving to calendar:', error);
    throw error;
  }
};

export const removeFromCalendar = async (userId, eventId) => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase is not configured. Please add Firebase environment variables to enable calendar.');
  }
  try {
    // Convert eventId to string for Firestore document path
    const eventIdStr = String(eventId);
    await deleteDoc(doc(db, 'users', userId, 'calendar', eventIdStr));
  } catch (error) {
    console.error('Error removing from calendar:', error);
    throw error;
  }
};

export const getUserCalendar = async (userId) => {
  if (!isFirebaseConfigured() || !db) {
    console.warn('Firebase is not configured. Calendar is disabled.');
    return [];
  }
  try {
    const snapshot = await getDocs(collection(db, 'users', userId, 'calendar'));
    return snapshot.docs.map(doc => doc.data().eventId);
  } catch (error) {
    console.error('Error getting calendar events:', error);
    return [];
  }
};