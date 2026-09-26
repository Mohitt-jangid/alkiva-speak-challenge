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
        background: '#0D0F16',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderLeft: '3px solid #6366F1',
        borderRadius: '8px',
        padding: '1.4rem 1.6rem',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)',
        marginTop: '1.2rem',
        color: '#FFFFFF',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
        <span
          style={{
            fontSize: '0.82rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#818CF8',
          }}
        >
          100-Day Speaking Challenge
        </span>
      </div>

      {/* Progress Bar & Day Stats */}
      <div style={{ marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          <span style={{ color: '#FFFFFF' }}>Day {stats.currentUnlockedDay} / 100</span>
          <span style={{ color: '#818CF8' }}>{stats.completionPercentage}% Completed</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '6px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '3px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${stats.completionPercentage}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #6366F1, #818CF8)',
              borderRadius: '3px',
              transition: 'width 0.6s ease',
            }}
          />
        </div>
      </div>

      {/* Streaks & Button Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div style={{ display: 'flex', gap: '1.2rem', fontSize: '0.8rem', color: '#8E95A5' }}>
          <span>Streak: <strong style={{ color: '#FFFFFF' }}>{stats.currentStreak} Days</strong></span>
          <span>Best: <strong style={{ color: '#FFFFFF' }}>{stats.longestStreak} Days</strong></span>
          <span>Remaining: <strong style={{ color: '#FFFFFF' }}>{stats.remainingDays} Days</strong></span>
        </div>

        <button
          onClick={onOpenChallenge}
          style={{
            background: 'rgba(99, 102, 241, 0.12)',
            color: '#818CF8',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            borderRadius: '4px',
            padding: '0.6rem 1.2rem',
            fontFamily: 'var(--t-font-mono, monospace)',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textTransform: 'uppercase',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#6366F1';
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.12)';
            e.currentTarget.style.color = '#818CF8';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Continue Day {stats.currentUnlockedDay} →
        </button>
      </div>
    </motion.div>
  );
}

