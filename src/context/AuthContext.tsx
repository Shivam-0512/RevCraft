import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebaseConfig';

// Define the shape of your context data
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({ currentUser: null, loading: true });

// Create a custom hook to easily access the context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Create the provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This listener fires whenever the user's login state changes.
    // It runs once on initial load, and then again on login/logout.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // Auth check is complete
    });

    // Cleanup the listener on component unmount
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
  };

  // We don't render the rest of the app until the initial auth check is finished
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
