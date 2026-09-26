import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchInstagramOverview } from '../services/instagramService';
import './Navbar.css';

/**
 * Navbar — Mature Dark Technical Header (DRN OS aesthetic)
 */
export default function Navbar({
  onNavigateSection,
  onOpenChallenge,
  onOpenInstagram,
  onOpenChat,
  onOpenProfile,
  unreadCount = 0
}) {
  const { currentUser, logout } = useAuth();
  const [streak, setStreak] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMohit = currentUser?.id?.toLowerCase() === 'mohit';

  const badgeText = unreadCount > 9 ? '9+' : unreadCount;

  // Load live user streak from database
  useEffect(() => {
    if (!currentUser?.id) return;
    let isMounted = true;
    fetchInstagramOverview()
      .then((data) => {
        if (isMounted && data) {
          const userKey = Object.keys(data).find(
            (k) => k.toLowerCase() === currentUser.id.toLowerCase()
          );
          if (userKey && data[userKey]) {
            setStreak(data[userKey].streak || 0);
          }
        }
      })
      .catch((err) => console.error('Navbar streak error:', err));
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="talkiva-navbar">
        {/* Brand Logo */}
        <div
          className="talkiva-nav-brand"
          onClick={() => scrollToSection('hero')}
        >
          <span className="talkiva-brand-icon">❖</span>
          <span>TALKIVA</span>
          <span className="talkiva-brand-ver">SYS.v2.4</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="talkiva-desktop-nav">
          <button className="talkiva-nav-link" onClick={onOpenInstagram}>
            Daily Drop
          </button>
        </nav>

        {/* Desktop Actions Controls */}
        <div className="talkiva-nav-actions">
          {/* Daily Drop Button */}
          {currentUser && onOpenInstagram && (
            <button className="nav-btn nav-btn--drop" onClick={onOpenInstagram}>
              ⚡ Daily Drop
            </button>
          )}

          {/* Group Chat Button */}
          {currentUser && onOpenChat && (
            <button className="nav-btn" onClick={onOpenChat}>
              💬 Chat
              {unreadCount > 0 && <span className="nav-btn-badge">{badgeText}</span>}
            </button>
          )}

          {/* Private 100-Day Module Access for Mohit */}
          {isMohit && onOpenChallenge && (
            <button className="nav-btn nav-btn--module" onClick={onOpenChallenge}>
              🔥 100-Day
            </button>
          )}

          {/* Streak Counter Badge */}
          {currentUser && (
            <div className="nav-btn nav-btn--streak" onClick={onOpenInstagram} title="Active Daily Streak">
              <span>🔥 {streak}D</span>
            </div>
          )}

          {/* Profile Button */}
          {currentUser && onOpenProfile && (
            <button className="nav-btn" onClick={onOpenProfile}>
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt="Profile"
                  style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <span>👤</span>
              )}
              <span>{currentUser.name || currentUser.id}</span>
            </button>
          )}

          {/* Logout Button */}
          {currentUser && (
            <button className="nav-btn" onClick={logout} title="Logout">
              Logout
            </button>
          )}
        </div>

        {/* Mobile Compact Controls + Hamburger Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {currentUser && onOpenChat && (
            <button
              className="nav-btn"
              onClick={onOpenChat}
              style={{ display: 'flex', padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
            >
              💬 {unreadCount > 0 && <span className="nav-btn-badge">{badgeText}</span>}
            </button>
          )}

          {currentUser && (
            <div
              className="nav-btn nav-btn--streak"
              onClick={onOpenInstagram}
              style={{ padding: '0.35rem 0.6rem', fontSize: '0.72rem' }}
            >
              🔥 {streak}D
            </div>
          )}

          <button
            className="talkiva-mobile-toggle"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Mobile Slide-Down Menu Drawer */}
      <div className={`talkiva-mobile-menu ${isMobileMenuOpen ? 'talkiva-mobile-menu--open' : ''}`}>
        {currentUser && onOpenInstagram && (
          <div
            className="mobile-menu-item"
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenInstagram();
            }}
          >
            <span>⚡ Daily Drop Challenge</span>
            <span>→</span>
          </div>
        )}

        {currentUser && onOpenChat && (
          <div
            className="mobile-menu-item"
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenChat();
            }}
          >
            <span>💬 Community Group Chat</span>
            {unreadCount > 0 && <span className="nav-btn-badge">{badgeText} UNREAD</span>}
          </div>
        )}

        {isMohit && onOpenChallenge && (
          <div
            className="mobile-menu-item"
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenChallenge();
            }}
          >
            <span>🔥 100-Day Articulation Module</span>
            <span>→</span>
          </div>
        )}

        {currentUser && onOpenProfile && (
          <div
            className="mobile-menu-item"
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenProfile();
            }}
          >
            <span>👤 User Profile ({currentUser.name || currentUser.id})</span>
            <span>⚙️</span>
          </div>
        )}

        {currentUser && (
          <div
            className="mobile-menu-item"
            style={{ color: '#EF4444', borderColor: 'rgba(239,68,68,0.3)', marginTop: '0.5rem' }}
            onClick={() => {
              setIsMobileMenuOpen(false);
              logout();
            }}
          >
            <span>🚪 Logout Session</span>
            <span>✕</span>
          </div>
        )}
      </div>
    </>
  );
}

