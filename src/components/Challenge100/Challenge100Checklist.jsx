import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getAll100DaysSummary } from '../../data/challenge100Data';
import { getChallenge100State, getChallenge100Stats } from '../../utils/challenge100Storage';

/**
 * Challenge100Checklist — Visual Checklist of all 100 Days.
 */
export default function Challenge100Checklist({ onSelectDay }) {
  const [filterPhase, setFilterPhase] = useState('ALL');
  const allDays = getAll100DaysSummary();
  const state = getChallenge100State();
  const stats = getChallenge100Stats();

  const getStatusBadge = (dayState) => {
    switch (dayState.status) {
      case 'VERIFIED':
        return { label: '✓ Verified', bg: 'rgba(16, 185, 129, 0.25)', border: '#10B981', color: '#34D399' };
      case 'AWAITING_VERIFICATION':
        return { label: '🟡 Awaiting Review', bg: 'rgba(245, 158, 11, 0.25)', border: '#F59E0B', color: '#FBBF24' };
      case 'REPEAT_REQUIRED':
        return { label: '🔁 Repeat Required', bg: 'rgba(239, 68, 68, 0.25)', border: '#EF4444', color: '#FCA5A5' };
      case 'IN_PROGRESS':
        return { label: '🟡 In Progress', bg: 'rgba(99, 102, 241, 0.25)', border: '#6366F1', color: '#818CF8' };
      case 'NOT_STARTED':
        return { label: '○ Unlocked', bg: 'rgba(255, 255, 255, 0.15)', border: '#FFFFFF', color: '#FFFFFF' };
      case 'LOCKED':
      default:
        return { label: '🔒 Locked', bg: 'rgba(255, 255, 255, 0.05)', border: 'rgba(255, 255, 255, 0.15)', color: 'rgba(255, 255, 255, 0.4)' };
    }
  };

  const filteredDays = allDays.filter((d) => {
    if (filterPhase === 'ALL') return true;
    return d.phase === filterPhase;
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', color: '#FFFFFF', padding: '1rem' }}>
      {/* Top Banner & Overall Metrics */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.12)',
          border: '1.5px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '28px',
          padding: '2rem 2.5rem',
          backdropFilter: 'blur(24px)',
          marginBottom: '2rem',
          boxShadow: '0 20px 60px rgba(45, 27, 105, 0.2)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.7)' }}>
              100-DAY PRIVATE PROGRAM
            </span>
            <h1 style={{ fontFamily: 'var(--t-font-heading)', fontSize: '2.2rem', fontWeight: 800, marginTop: '0.2rem' }}>
              100-Day Progress Checklist
            </h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'var(--t-font-heading)' }}>
              {stats.completionPercentage}%
            </div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)' }}>
              {stats.totalVerified} / 100 DAYS VERIFIED
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '12px', background: 'rgba(255, 255, 255, 0.12)', borderRadius: '6px', overflow: 'hidden', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: `${stats.completionPercentage}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #EC4899, #10B981)',
              borderRadius: '6px',
              transition: 'width 0.8s ease',
            }}
          />
        </div>

        {/* Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', textAlign: 'center' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>⚡ {stats.currentStreak}</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', marginTop: '0.2rem' }}>Current Streak</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>🏆 {stats.longestStreak}</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', marginTop: '0.2rem' }}>Longest Streak</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>⏳ {stats.remainingDays}</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', marginTop: '0.2rem' }}>Remaining Days</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>🎯 Day {stats.currentUnlockedDay}</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', marginTop: '0.2rem' }}>Active Unlocked</div>
          </div>
        </div>
      </div>

      {/* Phase Filter Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        {['ALL', 'HARD ARTICULATION FOUNDATION', 'ADVANCED PRONUNCIATION', 'SPEED + PRECISION', 'ADVANCED SPEAKING CONTROL', 'PERFORMANCE COMMUNICATION'].map((ph) => (
          <button
            key={ph}
            onClick={() => setFilterPhase(ph)}
            style={{
              background: filterPhase === ph ? '#FFFFFF' : 'rgba(255, 255, 255, 0.1)',
              color: filterPhase === ph ? '#2D1B69' : 'rgba(255, 255, 255, 0.85)',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.45rem 1.1rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s ease',
            }}
          >
            {ph}
          </button>
        ))}
      </div>

      {/* Days Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.2rem' }}>
        {filteredDays.map((d) => {
          const dayState = state.days[d.day] || { status: d.day === 1 ? 'NOT_STARTED' : 'LOCKED' };
          const badge = getStatusBadge(dayState);
          const isLocked = dayState.status === 'LOCKED';

          return (
            <motion.div
              key={d.day}
              whileHover={!isLocked ? { y: -4, scale: 1.01 } : {}}
              onClick={() => {
                if (!isLocked && onSelectDay) {
                  onSelectDay(d.day);
                }
              }}
              style={{
                background: isLocked ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.14)',
                border: `1.5px solid ${isLocked ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.35)'}`,
                borderRadius: '20px',
                padding: '1.2rem 1.4rem',
                backdropFilter: 'blur(16px)',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                opacity: isLocked ? 0.55 : 1,
                transition: 'all 0.3s ease',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: d.phaseColor, letterSpacing: '0.08em' }}>
                  DAY {d.day.toString().padStart(2, '0')}
                </span>
                <span
                  style={{
                    background: badge.bg,
                    border: `1px solid ${badge.border}`,
                    color: badge.color,
                    padding: '0.2rem 0.65rem',
                    borderRadius: '9999px',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                  }}
                >
                  {badge.label}
                </span>
              </div>

              <h4 style={{ fontFamily: 'var(--t-font-heading)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem', color: '#FFFFFF' }}>
                {d.title.split('—')[1] || d.title}
              </h4>

              <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.4, margin: 0 }}>
                {d.topic}
              </p>

              {dayState.review?.scores && (
                <div style={{ marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.72rem', color: '#34D399', fontWeight: 700 }}>
                  Verified Score: {Math.round((Object.values(dayState.review.scores).reduce((a, b) => a + b, 0) / 7) * 10) / 10} / 10
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
