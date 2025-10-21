import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { createUserProfile, getUserProfile } from './firebaseServices';

export const signUp = async (email, password, name, city, state) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    const userData = {
      name,
      email,
      homeCity: city,
      homeState: state,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=32a86b&color=fff`
    };

    await createUserProfile(userId, userData);
    return { userId, ...userData };
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

export const logIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;
    const userData = await getUserProfile(userId);
    return { userId, ...userData };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userData = await getUserProfile(user.uid);
      callback({ userId: user.uid, ...userData });
    } else {
      callback(null);
    }
  });
};