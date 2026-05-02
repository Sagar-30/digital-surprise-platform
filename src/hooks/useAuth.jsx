import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError(error.message);
      throw error;
      // return { success: false, error: error.message };
    }
  };

  // Sign in with Email/Password
  const signInWithEmail = async (email, password) => {
    setError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Error signing in with email:', error);
      let errorMessage = 'Failed to sign in';
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Incorrect email/password';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);

      let err = {message:errorMessage}
      throw err;
    }
  };

  // Sign up with Email/Password
  const signUpWithEmail = async (email, password, displayName = null) => {
    setError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      if (displayName && result.user) {
        // You can update the profile here if needed
        // await updateProfile(result.user, { displayName });
      }
      
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Error signing up with email:', error);
      let errorMessage = 'Failed to create account';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account already exists with this email';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw error;
      // return { success: false, error: errorMessage };
    }
  };

  // Send password reset email
  const sendPasswordReset = async (email) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Password reset email sent successfully' };
    } catch (error) {
      console.error('Error sending password reset:', error);
      let errorMessage = 'Failed to send reset email';
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw error;
      // return { success: false, error: errorMessage };
    }
  };

  // Sign out
  const signOut = async () => {
    setError(null);
    try {
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      setError(error.message);
      throw error;
      // return { success: false, error: error.message };
    }
  };

  // Clear error
  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    signOut,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};