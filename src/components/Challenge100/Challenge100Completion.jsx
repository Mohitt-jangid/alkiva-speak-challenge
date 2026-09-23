import React from 'react';
import { motion } from 'framer-motion';
import { getChallenge100State, getChallenge100Stats } from '../../utils/challenge100Storage';

/**
 * Challenge100Completion — Animated Celebration Screen for Day 100.
 */
export default function Challenge100Completion({ onBackToChecklist }) {
  const stats = getChallenge100Stats();
  const state = getChallenge100State();

  // Compute average scores across all verified days
  let totalArt = 0, totalPron = 0, totalSpeak = 0, count = 0;
  Object.values(state.days).forEach((d) => {
    if (d.status === 'VERIFIED' && d.review?.scores) {
      totalArt += d.review.scores.articulation || 8;
      totalPron += d.review.scores.pronunciation || 8;
      totalSpeak += d.review.scores.fluency || 8;
      count++;
    }
  });

  const avgArt = count > 0 ? (totalArt / count).toFixed(1) : '9.0';
  const avgPron = count > 0 ? (totalPron / count).toFixed(1) : '9.0';
  const avgSpeak = count > 0 ? (totalSpeak / count).toFixed(1) : '8.8';

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', color: '#FFFFFF', padding: '1rem', textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(236, 72, 153, 0.3) 50%, rgba(245, 158, 11, 0.3) 100%)',
          border: '2px solid rgba(255, 255, 255, 0.5)',
          borderRadius: '36px',
          padding: '3rem 2rem',
          backdropFilter: 'blur(30px)',
          boxShadow: '0 30px 100px rgba(79, 70, 229, 0.3)',
        }}
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
          style={{ fontSize: '5rem', marginBottom: '1rem' }}
        >
          🏆
        </motion.div>

        <h1 style={{ fontFamily: 'var(--t-font-heading)', fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 0.5rem' }}>
          100 DAYS COMPLETE
        </h1>

        <p style={{ fontFamily: 'var(--t-font-body)', fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.95)', maxWidth: '520px', margin: '0 auto 2rem', lineHeight: 1.6, fontStyle: 'italic' }}>
          "You built the habit.<br />
          You trained your articulation.<br />
          You strengthened your speaking control."
        </p>

        {/* Stats Summary Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '18px', padding: '1.2rem', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10B981' }}>100 / 100</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginTop: '0.3rem' }}>Days Completed</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '18px', padding: '1.2rem', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#F59E0B' }}>{stats.longestStreak}</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginTop: '0.3rem' }}>Longest Streak</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '18px', padding: '1.2rem', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#818CF8' }}>{avgArt} / 10</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginTop: '0.3rem' }}>Avg Articulation</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '18px', padding: '1.2rem', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#EC4899' }}>{avgPron} / 10</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginTop: '0.3rem' }}>Avg Pronunciation</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '18px', padding: '1.2rem', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#34D399' }}>{avgSpeak} / 10</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginTop: '0.3rem' }}>Avg Fluency</div>
          </div>
        </div>

        <button
          onClick={onBackToChecklist}
          style={{
            background: '#FFFFFF', color: '#2D1B69', border: 'none',
            borderRadius: '9999px', padding: '1rem 2.5rem',
            fontFamily: 'var(--t-font-body)', fontSize: '0.95rem', fontWeight: 800,
            cursor: 'pointer', boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          }}
        >
          View Complete 100-Day Program Archive →
        </button>
      </motion.div>
    </div>
  );
}
