import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getDayChallenge, getPhaseForDay, RESCUE_PHRASES } from '../utils/challengeData';
import './MissionSection.css';

/**
 * MissionSection — Shows the actual 100-day challenge content
 * for the user's current day based on their streak progress.
 *
 * If the day is locked (streak broken), shows Day 1.
 * Each day has 5 core challenges + warmup + tip.
 *
 * ALL LOGIC PRESERVED — only visual styling changed.
 */

export default function MissionSection() {
  const { currentUser } = useAuth();
  const storageKey = `streak_v2_${currentUser.id}`;

  // Read streak data to determine current day
  const currentDay = useMemo(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return 1;
      const data = JSON.parse(saved);

      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      if (data.verifiedDays?.[today]) {
        // Today is done — count streak backwards
        let streak = 0;
        let d = new Date(today);
        while (data.verifiedDays[d.toISOString().split('T')[0]]) {
          streak++;
          d.setDate(d.getDate() - 1);
        }
        return streak; // Show their completed day
      }

      if (data.verifiedDays?.[yesterday]) {
        let streak = 0;
        let d = new Date(yesterday);
        while (data.verifiedDays[d.toISOString().split('T')[0]]) {
          streak++;
          d.setDate(d.getDate() - 1);
        }
        return streak + 1; // Next day
      }

      return 1; // Streak broken → Day 1
    } catch {
      return 1;
    }
  }, [storageKey]);

  const challenge = getDayChallenge(currentDay);
  const phase = getPhaseForDay(currentDay);
  const [completedChallenges, setCompletedChallenges] = useState(new Set());
  const [showRescue, setShowRescue] = useState(false);

  const toggleChallenge = (id) => {
    setCompletedChallenges((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allCompleted = completedChallenges.size === challenge.challenges.length;
  const progress = (completedChallenges.size / challenge.challenges.length) * 100;

  const typeColors = {
    Speaking: { bg: 'rgba(79, 70, 229, 0.1)', border: 'rgba(79, 70, 229, 0.25)', text: '#818CF8' },
    Pronunciation: { bg: 'rgba(244, 63, 94, 0.1)', border: 'rgba(244, 63, 94, 0.25)', text: '#FB7185' },
    Articulation: { bg: 'rgba(124, 58, 237, 0.1)', border: 'rgba(124, 58, 237, 0.25)', text: '#A78BFA' },
    Vocabulary: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.25)', text: '#FBBF24' },
    Shadowing: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.25)', text: '#34D399' },
    'Rescue Phrases': { bg: 'rgba(196, 181, 253, 0.1)', border: 'rgba(196, 181, 253, 0.25)', text: '#C4B5FD' },
    Confidence: { bg: 'rgba(255, 122, 89, 0.1)', border: 'rgba(255, 122, 89, 0.25)', text: '#FF7A59' },
    Thinking: { bg: 'rgba(34, 211, 238, 0.1)', border: 'rgba(34, 211, 238, 0.25)', text: '#22D3EE' },
    Debate: { bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.25)', text: '#A855F7' },
    Spontaneous: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.25)', text: '#EF4444' },
  };

  const getTypeStyle = (type) => typeColors[type] || typeColors.Speaking;

  return (
    <section id="mission" className="mission">
      {/* Phase Banner */}
      <motion.div
        className="mission__phase"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="mission__phase-icon">{phase.icon}</span>
        <div>
          <div className="mission__phase-label">
            PHASE: DAYS {phase.range[0]}–{phase.range[1]}
          </div>
          <div className="mission__phase-desc">
            {phase.label} — {phase.goal}
          </div>
        </div>
      </motion.div>

      {/* Day Header */}
      <motion.div
        className="mission__header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="mission__header-label">DAILY MISSION</div>
        <h1 className="mission__header-title">
          <span>Day {currentDay}</span> — {challenge.title}
        </h1>
        <div className="mission__header-meta">
          <span>⏱ {challenge.duration}</span>
          <span>📋 {challenge.challenges.length} challenges</span>
          <span>✅ {completedChallenges.size}/{challenge.challenges.length} done</span>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        className="mission__progress"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className={`mission__progress-fill ${allCompleted ? 'mission__progress-fill--complete' : 'mission__progress-fill--active'}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>

      {/* Warmup */}
      <motion.div
        className="mission__warmup"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <span className="mission__warmup-icon">🔥</span>
        <div>
          <div className="mission__warmup-label">WARM UP</div>
          <div className="mission__warmup-text">{challenge.warmup}</div>
        </div>
      </motion.div>

      {/* 5 Core Challenges */}
      <div className="mission__challenges">
        {challenge.challenges.map((ch, idx) => {
          const isDone = completedChallenges.has(ch.id);
          const style = getTypeStyle(ch.type);

          return (
            <motion.div
              key={ch.id}
              className={`mission__challenge ${isDone ? 'mission__challenge--done' : ''}`}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.08 }}
            >
              <div className="mission__challenge-layout">
                {/* Challenge number */}
                <div className={`mission__challenge-num ${isDone ? 'mission__challenge-num--done' : 'mission__challenge-num--pending'}`}>
                  {isDone ? '✓' : ch.icon}
                </div>

                <div className="mission__challenge-body">
                  {/* Meta row */}
                  <div className="mission__challenge-meta">
                    <span
                      className="mission__challenge-type"
                      style={{
                        color: style.text,
                        background: style.bg,
                        border: `1px solid ${style.border}`,
                      }}
                    >
                      {ch.type}
                    </span>
                    <span className="mission__challenge-duration">⏱ {ch.duration}</span>
                  </div>

                  {/* Title */}
                  <h3 className={`mission__challenge-title ${isDone ? 'mission__challenge-title--done' : 'mission__challenge-title--pending'}`}>
                    Challenge {ch.id}: {ch.title}
                  </h3>

                  {/* Description */}
                  <p className="mission__challenge-desc">{ch.description}</p>
                </div>

                {/* Done toggle */}
                <button
                  className={`mission__challenge-toggle ${isDone ? 'mission__challenge-toggle--done' : 'mission__challenge-toggle--pending'}`}
                  onClick={() => toggleChallenge(ch.id)}
                  title={isDone ? 'Mark incomplete' : 'Mark complete'}
                >
                  {isDone ? '✓' : ''}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tip of the Day */}
      <motion.div
        className="mission__tip"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <span className="mission__tip-icon">💡</span>
        <div>
          <div className="mission__tip-label">TIP OF THE DAY</div>
          <div className="mission__tip-text">{challenge.tip}</div>
        </div>
      </motion.div>

      {/* Rescue Phrases Quick Reference */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <button
          className="mission__rescue-btn"
          onClick={() => setShowRescue(!showRescue)}
        >
          <span>🛟 Rescue Phrases — When Your Mind Goes Blank</span>
          <span className={`mission__rescue-arrow ${showRescue ? 'mission__rescue-arrow--open' : ''}`}>▼</span>
        </button>

        <AnimatePresence>
          {showRescue && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <div className="mission__rescue-body">
                {RESCUE_PHRASES.map((phrase, i) => (
                  <div key={i} className="mission__rescue-phrase">
                    <span className="mission__rescue-dot">•</span>
                    "{phrase}"
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* All Done Banner */}
      <AnimatePresence>
        {allCompleted && (
          <motion.div
            className="mission__complete"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <div className="mission__complete-emoji">🎉</div>
            <div className="mission__complete-title">
              Day {currentDay} Challenges Complete!
            </div>
            <div className="mission__complete-sub">
              Now go to <strong>My Progress</strong> to verify and mark this day as completed.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
