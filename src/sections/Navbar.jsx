import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Navbar — Clean Header
 * Logo "Talkiva" on left.
 * If user is 'mohit', displays private '🔥 100-Day Challenge' link.
 * Logout button on right.
 */

export default function Navbar({ onOpenChallenge }) {
  const { currentUser, logout } = useAuth();
  const isMohit = currentUser?.id?.toLowerCase() === 'mohit';

  return (
    <header
      className="talkiva-navbar"
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '1.2rem',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontFamily: 'var(--t-font-heading, "Plus Jakarta Sans", sans-serif)',
          fontSize: '1.4rem',
          fontWeight: 800,
          letterSpacing: '0.05em',
          cursor: 'pointer',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}
      >
        Talkiva
      </div>

      {/* Right side: Private Challenge (mohit ONLY) + Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        {/* Private 100-Day Challenge Access — STRICT GATING FOR 'mohit' ONLY */}
        {isMohit && onOpenChallenge && (
          <button
            onClick={onOpenChallenge}
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(139, 92, 246, 0.4) 100%)',
              border: '1.5px solid rgba(255, 255, 255, 0.6)',
              borderRadius: '9999px',
              fontFamily: 'var(--t-font-body, "Inter", sans-serif)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '0.42rem 1.2rem',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(99, 102, 241, 0.3)';
            }}
          >
            🔥 100-Day Challenge
          </button>
        )}

        {currentUser && (
          <button
            onClick={logout}
            style={{
              background: 'rgba(255, 255, 255, 0.18)',
              border: '1.5px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '9999px',
              fontFamily: 'var(--t-font-body, "Inter", sans-serif)',
              fontSize: '0.82rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '0.42rem 1.4rem',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.color = '#2D1B69';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
