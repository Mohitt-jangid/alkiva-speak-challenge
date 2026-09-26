import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * AuthContext — Manages authentication with tab-close auto logout and dynamic user creation.
 * Sessions persist via sessionStorage (automatically cleared on tab close).
 */

const DEFAULT_USERS = [
  { id: 'Mohit', password: 'mohit@8858', name: 'Mohit Jangid' },
  { id: 'Aashish', password: 'aashish@123', name: 'Aashish' },
  { id: 'Ajay', password: 'ajay@123', name: 'Ajay Choudhary' },
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usersList, setUsersList] = useState(DEFAULT_USERS);

  // Load custom users + restore session from sessionStorage on mount
  useEffect(() => {
    try {
      // 1. Load custom users from localStorage
      const customRaw = localStorage.getItem('talkiva_custom_users');
      let customUsers = [];
      if (customRaw) {
        customUsers = JSON.parse(customRaw);
      }
      const combinedUsers = [...DEFAULT_USERS];
      customUsers.forEach((cu) => {
        if (!combinedUsers.some((u) => u.id.toLowerCase() === cu.id.toLowerCase())) {
          combinedUsers.push(cu);
        }
      });
      setUsersList(combinedUsers);

      // 2. Restore session from sessionStorage (cleared automatically on tab close)
      const saved = sessionStorage.getItem('challenge_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        const valid = combinedUsers.find((u) => u.id.toLowerCase() === parsed.id.toLowerCase());
        if (valid) {
          const profileSaved = localStorage.getItem(`talkiva_profile_${valid.id}`);
          const profile = profileSaved ? JSON.parse(profileSaved) : {};
          setCurrentUser({
            id: valid.id,
            name: profile.name || valid.name || valid.id,
            avatar: profile.avatar || '',
          });
        } else {
          sessionStorage.removeItem('challenge_user');
        }
      }
    } catch {
      sessionStorage.removeItem('challenge_user');
    }
    setIsLoading(false);
  }, []);

  const login = (userId, password) => {
    const trimmedId = userId.trim();
    const trimmedPw = password.trim();

    const user = usersList.find(
      (u) =>
        u.id.toLowerCase() === trimmedId.toLowerCase() &&
        u.password === trimmedPw
    );

    if (user) {
      const profileSaved = localStorage.getItem(`talkiva_profile_${user.id}`);
      const profile = profileSaved ? JSON.parse(profileSaved) : {};
      const userData = {
        id: user.id,
        name: profile.name || user.name || user.id,
        avatar: profile.avatar || '',
      };
      setCurrentUser(userData);
      // Store in sessionStorage so closing the tab automatically logs the user out
      sessionStorage.setItem('challenge_user', JSON.stringify({ id: user.id }));
      return { success: true };
    }

    return { success: false, message: 'Invalid User ID or Password' };
  };

  /**
   * Add New User Feature — Only allowed for user Mohit, requires 4-digit PIN 2707.
   */
  const addUser = async ({ newUserId, newPassword, adminPin }) => {
    if (!currentUser || currentUser.id.toLowerCase() !== 'mohit') {
      return { success: false, message: 'Only user Mohit is authorized to create new users.' };
    }

    if (adminPin !== '2707') {
      return { success: false, message: 'Invalid 4-digit security PIN! Access denied.' };
    }

    const trimmedId = newUserId.trim();
    const trimmedPw = newPassword.trim();

    if (!trimmedId || !trimmedPw) {
      return { success: false, message: 'User ID and Password cannot be empty.' };
    }

    if (usersList.some((u) => u.id.toLowerCase() === trimmedId.toLowerCase())) {
      return { success: false, message: `User ID "${trimmedId}" already exists.` };
    }

    const newUserObj = { id: trimmedId, password: trimmedPw };
    const updatedList = [...usersList, newUserObj];
    setUsersList(updatedList);

    // Save custom user to localStorage
    try {
      const customRaw = localStorage.getItem('talkiva_custom_users');
      const customArr = customRaw ? JSON.parse(customRaw) : [];
      customArr.push(newUserObj);
      localStorage.setItem('talkiva_custom_users', JSON.stringify(customArr));
    } catch (e) {
      console.error('Error saving custom user to localStorage:', e);
    }

    // Register user in backend DB
    try {
      await fetch('http://localhost:3001/api/instagram/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: trimmedId, adminPin }),
      });
    } catch (e) {
      console.warn('Backend server not reached during user add, user stored locally:', e);
    }

    return { success: true, message: `User account "${trimmedId}" created successfully!` };
  };

  /**
   * Remove User Feature — Only allowed for user Mohit, requires 4-digit PIN 2707.
   */
  const removeUser = async ({ userIdToRemove, adminPin }) => {
    if (!currentUser || currentUser.id.toLowerCase() !== 'mohit') {
      return { success: false, message: 'Only user Mohit is authorized to remove users.' };
    }

    if (adminPin !== '2707') {
      return { success: false, message: 'Invalid 4-digit security PIN! Access denied.' };
    }

    const trimmedId = userIdToRemove.trim();
    if (trimmedId.toLowerCase() === 'mohit') {
      return { success: false, message: 'Cannot remove host account Mohit.' };
    }

    const updatedList = usersList.filter((u) => u.id.toLowerCase() !== trimmedId.toLowerCase());
    setUsersList(updatedList);

    // Update custom users in localStorage
    try {
      const customRaw = localStorage.getItem('talkiva_custom_users');
      if (customRaw) {
        const customArr = JSON.parse(customRaw);
        const filteredArr = customArr.filter((u) => u.id.toLowerCase() !== trimmedId.toLowerCase());
        localStorage.setItem('talkiva_custom_users', JSON.stringify(filteredArr));
      }
    } catch (e) {
      console.error('Error removing custom user from localStorage:', e);
    }

    // Remove user from backend DB
    try {
      await fetch('http://localhost:3001/api/instagram/remove-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: trimmedId, adminPin }),
      });
    } catch (e) {
      console.warn('Backend server not reached during user remove:', e);
    }

    return { success: true, message: `User account "${trimmedId}" removed successfully!` };
  };

  const updateProfile = ({ name, avatar }) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      name: name || currentUser.id,
      avatar: avatar !== undefined ? avatar : currentUser.avatar,
    };
    setCurrentUser(updated);
    try {
      localStorage.setItem(`talkiva_profile_${currentUser.id}`, JSON.stringify({ name: updated.name, avatar: updated.avatar }));
    } catch (e) {
      console.error(e);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('challenge_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, usersList, login, logout, addUser, removeUser, updateProfile, isLoading }}>
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

