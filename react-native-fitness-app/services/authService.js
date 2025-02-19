import { auth } from '../firebase/config';
import { signInAnonymously } from 'firebase/auth';

export const initializeAuth = async () => {
  try {
    // Check if there's already a user
    if (!auth.currentUser) {
      // Sign in anonymously if no user
      const userCredential = await signInAnonymously(auth);
      console.log('Anonymous auth successful:', userCredential.user.uid);
      return userCredential.user;
    }
    
    console.log('User already signed in:', auth.currentUser.uid);
    return auth.currentUser;
  } catch (error) {
    console.error('Auth initialization error:', error);
    throw error;
  }
};
