import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * AuthContext — Manages authentication for 3 hardcoded users.
 * No sign-up. Credentials stored client-side. Sessions persist via localStorage.
 */

const USERS = [
  { id: 'Mohit', password: 'mohit@8858' },
  { id: 'Aashish', password: 'aashish@123' },
  { id: 'Ajay', password: 'ajay@123' },
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('challenge_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Verify the saved user is still valid
        const valid = USERS.find((u) => u.id === parsed.id);
        if (valid) {
          setCurrentUser({ id: valid.id });
        } else {
          localStorage.removeItem('challenge_user');
        }
      }
    } catch {
      localStorage.removeItem('challenge_user');
    }
    setIsLoading(false);
  }, []);

  const login = (userId, password) => {
    const trimmedId = userId.trim();
    const trimmedPw = password.trim();

    const user = USERS.find(
      (u) =>
        u.id.toLowerCase() === trimmedId.toLowerCase() &&
        u.password === trimmedPw
    );

    if (user) {
      const userData = { id: user.id };
      setCurrentUser(userData);
      localStorage.setItem('challenge_user', JSON.stringify(userData));
      return { success: true };
    }

    return { success: false, message: 'Invalid User ID or Password' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('challenge_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

export default AuthContext;
