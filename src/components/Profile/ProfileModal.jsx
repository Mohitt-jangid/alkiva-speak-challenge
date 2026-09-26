import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { fetchInstagramOverview } from '../../services/instagramService';
import './ProfileModal.css';

export default function ProfileModal({ isOpen, onClose }) {
  const { currentUser, usersList, updateProfile, logout, addUser, removeUser } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [streak, setStreak] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef(null);

  // Mohit Exclusive: Add & Remove User state
  const [newUserId, setNewUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [addUserFeedback, setAddUserFeedback] = useState(null);
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);

  const [selectedRemoveUser, setSelectedRemoveUser] = useState('');
  const [removePin, setRemovePin] = useState('');
  const [removeUserFeedback, setRemoveUserFeedback] = useState(null);
  const [isRemovingUser, setIsRemovingUser] = useState(false);

  const isMohit = currentUser?.id?.toLowerCase() === 'mohit';

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.name || currentUser.id || '');
      setAvatarUrl(currentUser.avatar || '');

      fetchInstagramOverview()
        .then((data) => {
          if (data) {
            const userKey = Object.keys(data).find(
              (k) => k.toLowerCase() === currentUser.id.toLowerCase()
            );
            if (userKey && data[userKey]) {
              setStreak(data[userKey].streak || 0);
            }
          }
        })
        .catch((err) => console.error(err));
    }
  }, [currentUser, isOpen]);

  // Lock body scroll when profile modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  if (!isOpen || !currentUser) return null;

  // Handle Gallery Image Pick
  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please choose an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    updateProfile({
      name: displayName.trim(),
      avatar: avatarUrl,
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl('');
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setAddUserFeedback(null);

    if (!newUserId.trim() || !newPassword.trim()) {
      setAddUserFeedback({ type: 'error', text: 'Please fill in both User ID and Password.' });
      return;
    }

    if (adminPin.trim() !== '2707') {
      setAddUserFeedback({ type: 'error', text: 'Invalid 4-digit PIN! Required PIN is 2707.' });
      return;
    }

    setIsSubmittingUser(true);
    const res = await addUser({
      newUserId: newUserId.trim(),
      newPassword: newPassword.trim(),
      adminPin: adminPin.trim(),
    });
    setIsSubmittingUser(false);

    if (res.success) {
      setAddUserFeedback({ type: 'success', text: res.message });
      setNewUserId('');
      setNewPassword('');
      setAdminPin('');
    } else {
      setAddUserFeedback({ type: 'error', text: res.message });
    }
  };

  const handleRemoveChallenger = async (e) => {
    e.preventDefault();
    setRemoveUserFeedback(null);

    if (!selectedRemoveUser) {
      setRemoveUserFeedback({ type: 'error', text: 'Please select a challenger to remove.' });
      return;
    }

    if (removePin.trim() !== '2707') {
      setRemoveUserFeedback({ type: 'error', text: 'Invalid 4-digit PIN! Required PIN is 2707.' });
      return;
    }

    setIsRemovingUser(true);
    const res = await removeUser({
      userIdToRemove: selectedRemoveUser,
      adminPin: removePin.trim(),
    });
    setIsRemovingUser(false);

    if (res.success) {
      setRemoveUserFeedback({ type: 'success', text: res.message });
      setSelectedRemoveUser('');
      setRemovePin('');
    } else {
      setRemoveUserFeedback({ type: 'error', text: res.message });
    }
  };

  const removableUsers = (usersList || []).filter(
    (u) => u.id.toLowerCase() !== 'mohit'
  );

  return (
    <AnimatePresence>
      <div className="profile-backdrop" onClick={onClose}>
        <motion.div
          className="profile-modal glass-panel--solid"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div className="profile-modal__header">
            <h3 className="profile-modal__title">User Profile 👤</h3>
            <button className="profile-close-btn" onClick={onClose}>✕</button>
          </div>

          <form onSubmit={handleSave} className="profile-modal__body">
            {/* Avatar Circle with Gallery Upload */}
            <div className="profile-avatar-section">
              <div className="profile-avatar-preview">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="profile-avatar-img" />
                ) : (
                  <span className="profile-avatar-fallback">
                    {displayName ? displayName[0].toUpperCase() : '👤'}
                  </span>
                )}
                
                <button
                  type="button"
                  className="profile-avatar-upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                  title="Pick picture from gallery"
                >
                  📷
                </button>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImagePick}
                style={{ display: 'none' }}
              />

              <div className="profile-avatar-actions">
                <button
                  type="button"
                  className="profile-btn-secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  🖼️ Choose Photo from Gallery
                </button>

                {avatarUrl && (
                  <button
                    type="button"
                    className="profile-btn-danger-link"
                    onClick={handleRemovePhoto}
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>

            {/* Display Name Input */}
            <div className="profile-field-group">
              <label className="profile-field-label">Display Name</label>
              <input
                type="text"
                className="profile-field-input"
                placeholder="Enter your name..."
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={30}
                required
              />
            </div>

            {/* Daily Drop Streak Badge */}
            <div
              style={{
                background: 'rgba(255, 85, 0, 0.1)',
                border: '1px solid rgba(255, 85, 0, 0.3)',
                borderRadius: '8px',
                padding: '0.8rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 600 }}>
                <span>⚡ Daily Drop Streak:</span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FF5500', fontFamily: 'var(--t-font-mono, monospace)' }}>
                {streak} Day{streak !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Account Info */}
            <div className="profile-info-row">
              <span className="profile-info-label">Account ID:</span>
              <span className="profile-info-value">{currentUser.id}</span>
            </div>

            {/* ── MOHIT EXCLUSIVE: ADD NEW USER ADMIN PANEL ── */}
            {isMohit && (
              <div
                style={{
                  marginTop: '1.2rem',
                  padding: '1.2rem',
                  background: '#0D0F16',
                  border: '1px solid rgba(255, 85, 0, 0.4)',
                  borderRadius: '8px',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FF5500', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--t-font-mono, monospace)', marginBottom: '0.6rem' }}>
                  // ADMIN CONTROL: CREATE NEW CHALLENGER USER
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#A0A6B5', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--t-font-mono, monospace)' }}>
                      New User ID
                    </label>
                    <input
                      type="text"
                      className="profile-field-input"
                      placeholder="e.g. Rahul"
                      value={newUserId}
                      onChange={(e) => setNewUserId(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#A0A6B5', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--t-font-mono, monospace)' }}>
                      New User Password
                    </label>
                    <input
                      type="text"
                      className="profile-field-input"
                      placeholder="e.g. rahul@123"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#FF5500', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--t-font-mono, monospace)' }}>
                      4-Digit Admin Security PIN (2707 Required)
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      className="profile-field-input"
                      placeholder="Enter 4-digit PIN"
                      value={adminPin}
                      onChange={(e) => setAdminPin(e.target.value)}
                      style={{ letterSpacing: '0.2em', fontFamily: 'var(--t-font-mono, monospace)', fontWeight: 800 }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleCreateUser}
                    disabled={isSubmittingUser}
                    style={{
                      background: 'rgba(255, 85, 0, 0.15)',
                      border: '1px solid #FF5500',
                      color: '#FF6611',
                      padding: '0.6rem',
                      borderRadius: '4px',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      fontFamily: 'var(--t-font-mono, monospace)',
                      textTransform: 'uppercase',
                      marginTop: '0.4rem',
                    }}
                  >
                    {isSubmittingUser ? 'Creating User...' : '+ Create Challenger Account →'}
                  </button>

                  {addUserFeedback && (
                    <div
                      style={{
                        padding: '0.5rem 0.8rem',
                        borderRadius: '4px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: addUserFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        border: addUserFeedback.type === 'success' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
                        color: addUserFeedback.type === 'success' ? '#34D399' : '#FCA5A5',
                      }}
                    >
                      {addUserFeedback.text}
                    </div>
                  )}

                  {/* ── REMOVE CHALLENGER SUB-PANEL ── */}
                  <div style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#EF4444', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--t-font-mono, monospace)', marginBottom: '0.6rem' }}>
                      // REMOVE EXISTING CHALLENGER
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      <div>
                        <label style={{ fontSize: '0.72rem', color: '#A0A6B5', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--t-font-mono, monospace)' }}>
                          Select User to Remove
                        </label>
                        <select
                          className="profile-field-input"
                          value={selectedRemoveUser}
                          onChange={(e) => setSelectedRemoveUser(e.target.value)}
                          style={{ background: '#07080B', color: '#FFFFFF' }}
                        >
                          <option value="">-- Select Challenger --</option>
                          {removableUsers.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.id}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.72rem', color: '#EF4444', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--t-font-mono, monospace)' }}>
                          4-Digit Security PIN (2707 Required)
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          className="profile-field-input"
                          placeholder="Enter 4-digit PIN"
                          value={removePin}
                          onChange={(e) => setRemovePin(e.target.value)}
                          style={{ letterSpacing: '0.2em', fontFamily: 'var(--t-font-mono, monospace)', fontWeight: 800 }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveChallenger}
                        disabled={isRemovingUser || !selectedRemoveUser}
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.5)',
                          color: '#FCA5A5',
                          padding: '0.6rem',
                          borderRadius: '4px',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          fontFamily: 'var(--t-font-mono, monospace)',
                          textTransform: 'uppercase',
                        }}
                      >
                        {isRemovingUser ? 'Removing User...' : '🗑️ Delete Challenger Account'}
                      </button>

                      {removeUserFeedback && (
                        <div
                          style={{
                            padding: '0.5rem 0.8rem',
                            borderRadius: '4px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            background: removeUserFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            border: removeUserFeedback.type === 'success' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
                            color: removeUserFeedback.type === 'success' ? '#34D399' : '#FCA5A5',
                          }}
                        >
                          {removeUserFeedback.text}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Success Banner */}
            {isSaved && (
              <motion.div
                className="profile-success-badge"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                ✓ Profile Updated Successfully!
              </motion.div>
            )}

            {/* Footer Actions */}
            <div className="profile-modal__footer">
              <button type="submit" className="profile-btn-primary">
                Save Changes 💾
              </button>

              <button
                type="button"
                className="profile-btn-logout"
                onClick={() => {
                  onClose();
                  logout();
                }}
              >
                Logout 🚪
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
