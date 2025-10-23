import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config';
import { createUserProfile, getUserProfile } from './firebaseServices';

export const signUp = async (email, password, name, city, state) => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error('Firebase is not configured. Please contact support to enable authentication.');
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    // Send email verification
    await sendEmailVerification(userCredential.user);

    const userData = {
      name,
      email,
      homeCity: city,
      homeState: state,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=32a86b&color=fff`,
      emailVerified: false
    };

    await createUserProfile(userId, userData);
    return { userId, ...userData };
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

export const logIn = async (email, password, rememberMe = false) => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error('Firebase is not configured. Please contact support to enable authentication.');
  }
  try {
    // Set persistence based on rememberMe option
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistence);

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;
    const userData = await getUserProfile(userId);
    return {
      userId,
      ...userData,
      emailVerified: userCredential.user.emailVerified
    };
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

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

export const resendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
    } else {
      throw new Error('No user logged in or email already verified');
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    throw error;
  }
};

export const onAuthChange = (callback) => {
  if (!isFirebaseConfigured() || !auth) {
    // If Firebase is not configured, immediately call callback with null
    // This prevents the app from hanging in loading state
    setTimeout(() => callback(null), 0);
    return () => {}; // Return empty unsubscribe function
  }

  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userData = await getUserProfile(user.uid);
      callback({
        userId: user.uid,
        ...userData,
        emailVerified: user.emailVerified
      });
    } else {
      callback(null);
    }
  });
};