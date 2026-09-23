import React from 'react';
import { motion } from 'framer-motion';
import { getChallenge100Stats } from '../../utils/challenge100Storage';

/**
 * Challenge100Card — Dashboard Card for user 'mohit'.
 * Rendered on main landing page.
 */
export default function Challenge100Card({ onOpenChallenge }) {
  const stats = getChallenge100Stats();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.22) 0%, rgba(139, 92, 246, 0.18) 100%)',
        border: '1.5px solid rgba(255, 255, 255, 0.35)',
        borderRadius: '24px',
        padding: '1.6rem 1.8rem',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 16px 48px rgba(79, 70, 229, 0.18)',
        marginTop: '1.5rem',
        color: '#FFFFFF',
      }}
    >
      {/* Top Header Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.4rem' }}>🔥</span>
          <span
            style={{
              fontFamily: 'var(--t-font-heading, "Plus Jakarta Sans", sans-serif)',
              fontSize: '0.95rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
            }}
          >
            100-DAY ARTICULATION CHALLENGE
          </span>
        </div>
        <span
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '0.06em',
          }}
        >
          PRIVATE MEMBER
        </span>
      </div>

      <p style={{ fontFamily: 'var(--t-font-body)', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '1.2rem' }}>
        Articulation • Pronunciation • Controlled Speed • Speaking & Running Endurance
      </p>

      {/* Progress Bar & Day Stats */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          <span>Day {stats.currentUnlockedDay} of 100</span>
          <span>{stats.completionPercentage}% Complete ({stats.totalVerified}/100 Verified)</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '8px',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${stats.completionPercentage}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #EC4899)',
              borderRadius: '4px',
              transition: 'width 0.6s ease',
            }}
          />
        </div>
      </div>

      {/* Streaks & Button Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div style={{ display: 'flex', gap: '1.2rem', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.9)' }}>
          <span>⚡ Streak: <strong>{stats.currentStreak} Days</strong></span>
          <span>🏆 Best: <strong>{stats.longestStreak} Days</strong></span>
          <span>⏳ Remaining: <strong>{stats.remainingDays} Days</strong></span>
        </div>

        <button
          onClick={onOpenChallenge}
          style={{
            background: '#FFFFFF',
            color: '#2D1B69',
            border: 'none',
            borderRadius: '9999px',
            padding: '0.65rem 1.6rem',
            fontFamily: 'var(--t-font-body)',
            fontSize: '0.82rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
          }}
        >
          Continue Day {stats.currentUnlockedDay} →
        </button>
      </div>
    </motion.div>
  );
}
