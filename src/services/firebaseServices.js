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
import { db } from '../firebase/config';

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

// FAVORITES
export const saveFavorite = async (userId, eventId) => {
  try {
    const favRef = doc(db, 'users', userId, 'favorites', eventId);
    await setDoc(favRef, { eventId, savedAt: new Date() });
  } catch (error) {
    console.error('Error saving favorite:', error);
    throw error;
  }
};

export const removeFavorite = async (userId, eventId) => {
  try {
    await deleteDoc(doc(db, 'users', userId, 'favorites', eventId));
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

export const getUserFavorites = async (userId) => {
  try {
    const snapshot = await getDocs(collection(db, 'users', userId, 'favorites'));
    return snapshot.docs.map(doc => doc.data().eventId);
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};