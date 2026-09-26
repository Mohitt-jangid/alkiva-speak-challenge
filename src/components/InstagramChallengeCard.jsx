import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { fetchInstagramOverview } from '../services/instagramService';

export default function InstagramChallengeCard({ onOpenInstagram }) {
  const { currentUser } = useAuth();
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetchInstagramOverview()
      .then((data) => {
        if (isMounted) setOverview(data);
      })
      .catch((err) => console.error(err));
    return () => {
      isMounted = false;
    };
  }, []);

  const userId = currentUser?.id || 'Mohit';
  const userData = overview ? overview[userId] : null;
  const streak = userData ? userData.streak : 0;
  const hasSubmittedToday = userData ? userData.hasSubmittedToday : false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="ig-home-card"
      style={{
        marginTop: '1.2rem',
        background: '#0D0F16',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderLeft: '3px solid #FF5500',
        borderRadius: '8px',
        padding: '1.4rem 1.6rem',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.2rem',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      onClick={() => onOpenInstagram && onOpenInstagram()}
      whileHover={{ translateY: -2, borderColor: 'rgba(255, 85, 0, 0.4)' }}
      whileTap={{ scale: 0.99 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
        <div
          style={{
            fontSize: '1.2rem',
            background: 'rgba(255, 85, 0, 0.12)',
            border: '1px solid rgba(255, 85, 0, 0.3)',
            color: '#FF6611',
            width: '46px',
            height: '46px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--t-font-mono, monospace)',
            fontWeight: 800,
          }}
        >
          ⚡
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FF5500', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Daily Drop
            </span>
          </div>

          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
            Current Streak: <span style={{ color: '#FF5500', fontFamily: 'var(--t-font-mono, monospace)', fontWeight: 800 }}>{streak} Day{streak !== 1 ? 's' : ''}</span>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#8E95A5', marginTop: '0.25rem' }}>
            {hasSubmittedToday ? '✓ Submitted Today' : '⚡ Pending Today'}
          </div>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          if (onOpenInstagram) onOpenInstagram();
        }}
        style={{
          background: 'rgba(255, 85, 0, 0.12)',
          color: '#FF6611',
          border: '1px solid rgba(255, 85, 0, 0.4)',
          borderRadius: '4px',
          padding: '0.6rem 1.2rem',
          fontSize: '0.8rem',
          fontWeight: 700,
          fontFamily: 'var(--t-font-mono, monospace)',
          letterSpacing: '0.06em',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap',
          textTransform: 'uppercase',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#FF5500';
          e.currentTarget.style.color = '#FFFFFF';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 85, 0, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 85, 0, 0.12)';
          e.currentTarget.style.color = '#FF6611';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        Open Daily Drop →
      </button>
    </motion.div>
  );
}

