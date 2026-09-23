import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

/**
 * ProfilePage — Strict 100-Day English Speaking Challenge Tracker.
 *
 * STRICT RULES ENFORCED:
 * - Miss one day → streak = 0, restart from Day 1
 * - One calendar day = one challenge day (no catch-ups)
 * - Days must be sequential (no skipping)
 * - Same-day check-in required
 * - Only 2 statuses: ⏳ NOT VERIFIED or ✅ VERIFIED & COMPLETED
 *
 * Each user's data is stored separately in localStorage.
 */

const TOTAL_DAYS = 100;

const PRACTICE_SKILLS = [
  { id: 'pronunciation', label: 'Pronunciation', icon: '🗣️' },
  { id: 'fluency', label: 'Fluency Practice', icon: '💬' },
  { id: 'articulation', label: 'Articulation', icon: '👄' },
  { id: 'vocabulary', label: 'Vocabulary', icon: '📖' },
  { id: 'shadowing', label: 'Shadowing', icon: '🎧' },
  { id: 'impromptu', label: 'Impromptu Speech', icon: '⏱️' },
];

const SCORE_SKILLS = [
  { id: 'fluency', label: 'Fluency', icon: '💬', color: 'cyan' },
  { id: 'pronunciation', label: 'Pronunciation', icon: '🗣️', color: 'magenta' },
  { id: 'articulation', label: 'Articulation', icon: '👄', color: 'violet' },
  { id: 'grammar', label: 'Grammar', icon: '📝', color: 'gold' },
  { id: 'vocabulary', label: 'Vocabulary Retrieval', icon: '📖', color: 'green' },
  { id: 'confidence', label: 'Confidence', icon: '💪', color: 'pink' },
  { id: 'spontaneous', label: 'Spontaneous Speaking', icon: '⚡', color: 'blue' },
];

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function dateDiffDays(dateStr1, dateStr2) {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const storageKey = `streak_v2_${currentUser.id}`;

  // Initialize or load data
  const loadData = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return {
      verifiedDays: {},     // { "2026-09-21": { dayNumber: 1, skills: [...], note: "..." } }
      currentStreak: 0,
      highestStreak: 0,
      lastVerifiedDate: null,
      totalVerified: 0,
      scores: {
        fluency: 1, pronunciation: 1, articulation: 1,
        grammar: 1, vocabulary: 1, confidence: 1, spontaneous: 1,
      },
    };
  };

  const [data, setData] = useState(loadData);
  const [checkinSkills, setCheckinSkills] = useState([]);
  const [checkinNote, setCheckinNote] = useState('');

  // Persist
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }, [data, storageKey]);

  const today = getToday();
  const yesterday = getYesterday();

  // ─── STRICT STREAK LOGIC ───────────────────────────────────
  // Compute the LIVE current day & streak based on strict rules

  const liveState = useMemo(() => {
    const { verifiedDays, lastVerifiedDate, scores } = data;

    const todayVerified = !!verifiedDays[today];
    const yesterdayVerified = !!verifiedDays[yesterday];

    // If verified today → streak is alive
    if (todayVerified) {
      // Count consecutive days backwards from today
      let streak = 0;
      let d = new Date(today);
      while (true) {
        const key = d.toISOString().split('T')[0];
        if (verifiedDays[key]) {
          streak++;
          d.setDate(d.getDate() - 1);
        } else {
          break;
        }
      }
      const currentDay = streak; // They're on day = streak count
      return {
        currentDay,
        currentStreak: streak,
        isTodayVerified: true,
        isStreakAlive: true,
        needsRestart: false,
      };
    }

    // If yesterday was verified → streak alive, today is next day
    if (yesterdayVerified) {
      let streak = 0;
      let d = new Date(yesterday);
      while (true) {
        const key = d.toISOString().split('T')[0];
        if (verifiedDays[key]) {
          streak++;
          d.setDate(d.getDate() - 1);
        } else {
          break;
        }
      }
      return {
        currentDay: streak + 1, // next day to complete
        currentStreak: streak,
        isTodayVerified: false,
        isStreakAlive: true,
        needsRestart: false,
      };
    }

    // Neither today nor yesterday verified → STREAK IS DEAD
    // Must restart from Day 1
    return {
      currentDay: 1,
      currentStreak: 0,
      isTodayVerified: false,
      isStreakAlive: lastVerifiedDate === null, // alive if never started (first time)
      needsRestart: lastVerifiedDate !== null,  // reset if they had previous progress
    };
  }, [data, today, yesterday]);

  const isTodayVerified = liveState.isTodayVerified;
  const totalVerified = Object.keys(data.verifiedDays).length;

  // ─── CHECK-IN HANDLER ──────────────────────────────────────
  const handleCheckin = () => {
    if (isTodayVerified) return;
    if (checkinSkills.length === 0) return;

    const newVerifiedDays = { ...data.verifiedDays };

    // If streak was dead (restart), clear old data for a fresh start
    if (liveState.needsRestart) {
      // Keep old entries for historical count but they don't count for current streak
    }

    newVerifiedDays[today] = {
      dayNumber: liveState.currentDay,
      skills: checkinSkills,
      note: checkinNote.trim(),
      timestamp: Date.now(),
    };

    const newStreak = liveState.currentStreak + 1;
    const newHighest = Math.max(data.highestStreak, newStreak);

    setData({
      ...data,
      verifiedDays: newVerifiedDays,
      currentStreak: newStreak,
      highestStreak: newHighest,
      lastVerifiedDate: today,
      totalVerified: Object.keys(newVerifiedDays).length,
    });

    setCheckinSkills([]);
    setCheckinNote('');
  };

  const toggleCheckinSkill = (skillId) => {
    setCheckinSkills((prev) =>
      prev.includes(skillId) ? prev.filter((s) => s !== skillId) : [...prev, skillId]
    );
  };

  // ─── DAY GRID STATUS ───────────────────────────────────────
  const getDayCellStatus = (dayNum) => {
    if (dayNum < liveState.currentDay) {
      // Check if this day was actually completed in the current streak
      // Look backwards from the last verified day
      return 'completed';
    }
    if (dayNum === liveState.currentDay) return 'current';
    return 'locked';
  };

  // For the grid, show which days in the CURRENT streak are completed
  const completedDaysInStreak = useMemo(() => {
    const completed = new Set();
    if (liveState.isTodayVerified) {
      let d = new Date(today);
      let dayNum = liveState.currentDay;
      while (dayNum >= 1) {
        const key = d.toISOString().split('T')[0];
        if (data.verifiedDays[key]) {
          completed.add(dayNum);
          d.setDate(d.getDate() - 1);
          dayNum--;
        } else {
          break;
        }
      }
    } else if (liveState.isStreakAlive && !liveState.needsRestart) {
      // Yesterday chain
      let d = new Date(yesterday);
      let dayNum = liveState.currentDay - 1;
      while (dayNum >= 1) {
        const key = d.toISOString().split('T')[0];
        if (data.verifiedDays[key]) {
          completed.add(dayNum);
          d.setDate(d.getDate() - 1);
          dayNum--;
        } else {
          break;
        }
      }
    }
    return completed;
  }, [data.verifiedDays, liveState, today, yesterday]);

  const initial = currentUser.id.charAt(0).toUpperCase();
  const completionPercent = Math.round((liveState.currentStreak / TOTAL_DAYS) * 100);

  return (
    <motion.div
      className="profile-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Welcome */}
      <div className="profile-welcome">
        <motion.div
          className="profile-avatar"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          {initial}
        </motion.div>
        <h1>
          Welcome, <span>{currentUser.id}</span>
        </h1>
        <p>100 Days English Speaking Transformation • Strict Accountability</p>
      </div>

      {/* STREAK RESET ALERT */}
      {liveState.needsRestart && !isTodayVerified && (
        <motion.div
          className="streak-reset-alert"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="alert-icon">💀</div>
          <div className="alert-text">
            <div className="alert-title">STREAK BROKEN — Restarting from Day 1</div>
            <div className="alert-sub">
              You missed a day. No exceptions. No catch-ups. Rules are rules.
              Complete Day 1 today to start fresh.
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="progress-stats">
        <motion.div className="progress-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="stat-icon">📅</div>
          <div className="stat-value stat-value--cyan">Day {liveState.currentDay}</div>
          <div className="stat-label">Current Day</div>
        </motion.div>

        <motion.div className="progress-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="stat-icon">🔥</div>
          <div className={`stat-value ${liveState.currentStreak > 0 ? 'stat-value--gold' : ''}`}>
            {liveState.currentStreak}
          </div>
          <div className="stat-label">Current Streak</div>
        </motion.div>

        <motion.div className="progress-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="stat-icon">✅</div>
          <div className="stat-value stat-value--green">{totalVerified}</div>
          <div className="stat-label">Total Verified</div>
        </motion.div>

        <motion.div className="progress-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="stat-icon">🏆</div>
          <div className="stat-value stat-value--magenta">{data.highestStreak}</div>
          <div className="stat-label">Best Streak</div>
        </motion.div>
      </div>

      {/* Streak Bar */}
      <motion.div className="streak-bar" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="streak-fire">{liveState.currentStreak > 0 ? '🔥' : '❄️'}</div>
        <div className="streak-info">
          <div className={`streak-title ${liveState.currentStreak === 0 ? 'streak-dead' : ''}`}>
            {liveState.currentStreak > 0
              ? `${liveState.currentStreak} Day Streak!`
              : 'No Active Streak'}
          </div>
          <div className="streak-sub">
            {liveState.currentStreak > 0
              ? 'Keep going — miss one day and it all resets to zero'
              : 'Complete today\'s challenge to start your streak'}
          </div>
        </div>
        <div className="streak-progress-bar">
          <div className="streak-progress-fill" style={{ width: `${completionPercent}%` }} />
        </div>
      </motion.div>

      {/* Current Status */}
      <motion.div className="status-section" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
        <div className="status-left">
          <span style={{ fontSize: '1.2rem' }}>
            {isTodayVerified ? '✅' : '⏳'}
          </span>
          <span className={`status-badge ${isTodayVerified ? 'status-badge--verified' : 'status-badge--pending'}`}>
            {isTodayVerified ? 'VERIFIED & COMPLETED' : 'NOT VERIFIED'}
          </span>
        </div>
        <div className="status-meta">
          Day {liveState.currentDay} • {today}
          {data.lastVerifiedDate && (
            <> • Last verified: <strong>{data.lastVerifiedDate}</strong></>
          )}
        </div>
      </motion.div>

      {/* Daily Check-In */}
      <motion.div className="checkin-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <h2>📝 Daily Check-In — Day {liveState.currentDay}</h2>
        <p className="section-sub">
          Select the skills you practiced today and mark your day as complete.
          You must verify on the same calendar day — no backdating.
        </p>

        {isTodayVerified ? (
          <div className="checkin-done">
            <span style={{ fontSize: '1.5rem' }}>🎉</span>
            <div>
              <strong>Day {liveState.currentDay} — ✅ VERIFIED & COMPLETED</strong>
              <br />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Practiced: {(data.verifiedDays[today]?.skills || []).map(
                  (sid) => PRACTICE_SKILLS.find((s) => s.id === sid)?.label || sid
                ).join(', ')}
                {data.verifiedDays[today]?.note && ` • "${data.verifiedDays[today].note}"`}
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="checkin-skills">
              {PRACTICE_SKILLS.map((skill) => (
                <button
                  key={skill.id}
                  className={`checkin-skill-chip ${checkinSkills.includes(skill.id) ? 'checkin-skill-chip--selected' : ''}`}
                  onClick={() => toggleCheckinSkill(skill.id)}
                  type="button"
                >
                  <span>{skill.icon}</span>
                  <span>{skill.label}</span>
                </button>
              ))}
            </div>
            <textarea
              className="checkin-note"
              placeholder="What did you practice? Any reflections on today's speaking session..."
              value={checkinNote}
              onChange={(e) => setCheckinNote(e.target.value)}
            />
            <button
              className="checkin-btn"
              onClick={handleCheckin}
              disabled={checkinSkills.length === 0}
            >
              ✓ Verify & Complete Day {liveState.currentDay}
            </button>
          </>
        )}
      </motion.div>

      {/* 100 Day Grid */}
      <motion.div className="day-grid-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2>📆 100 Day Journey</h2>
        <p className="section-sub">
          Sequential progress — Day 1 → Day 100. No skipping. No catching up.
        </p>

        <div className="day-grid">
          {Array.from({ length: TOTAL_DAYS }, (_, i) => {
            const dayNum = i + 1;
            let status = 'locked';
            if (completedDaysInStreak.has(dayNum)) {
              status = 'completed';
            } else if (dayNum === liveState.currentDay) {
              status = 'current';
            }
            return (
              <motion.div
                key={dayNum}
                className={`day-cell day-cell--${status}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.003 }}
                title={`Day ${dayNum} — ${status === 'completed' ? '✅ Verified' : status === 'current' ? '⏳ Current' : '🔒 Locked'}`}
              >
                {status === 'completed' ? '✓' : dayNum}
              </motion.div>
            );
          })}
        </div>

        <div className="day-legend">
          <div className="day-legend-item">
            <div className="day-legend-dot day-legend-dot--completed" />
            <span>Verified</span>
          </div>
          <div className="day-legend-item">
            <div className="day-legend-dot day-legend-dot--current" />
            <span>Current Day</span>
          </div>
          <div className="day-legend-item">
            <div className="day-legend-dot day-legend-dot--locked" />
            <span>Locked</span>
          </div>
        </div>
      </motion.div>

      {/* Skills Score Board */}
      <motion.div className="skills-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <h2>📊 Skills Score Board</h2>

        {SCORE_SKILLS.map((skill) => {
          const score = data.scores[skill.id] || 1;
          return (
            <div className="skill-row" key={skill.id}>
              <div className="skill-icon">{skill.icon}</div>
              <div className="skill-info">
                <div className="skill-name">{skill.label}</div>
                <div className="skill-bar-wrapper">
                  <motion.div
                    className={`skill-bar-fill skill-bar-fill--${skill.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${score * 10}%` }}
                    transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
              <div className="skill-score">
                {score}<span>/10</span>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Locked Rules Reminder */}
      <motion.div className="rules-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h2>🔒 Locked Rules</h2>

        <div className="rule-item">
          <span className="rule-icon">⛔</span>
          <span className="rule-text">
            <strong>Miss one day = streak resets to 0.</strong> No exceptions. No excuses.
          </span>
        </div>
        <div className="rule-item">
          <span className="rule-icon">📅</span>
          <span className="rule-text">
            One calendar day = one challenge day. <strong>No catch-ups.</strong> No combining days.
          </span>
        </div>
        <div className="rule-item">
          <span className="rule-icon">🔗</span>
          <span className="rule-text">
            Days are sequential: Day 1 → Day 2 → Day 3. <strong>No skipping.</strong>
          </span>
        </div>
        <div className="rule-item">
          <span className="rule-icon">⏰</span>
          <span className="rule-text">
            <strong>Same-day verification required.</strong> Can't mark yesterday's challenge today.
          </span>
        </div>
        <div className="rule-item">
          <span className="rule-icon">✅</span>
          <span className="rule-text">
            Only two statuses: <strong>⏳ NOT VERIFIED</strong> or <strong>✅ VERIFIED & COMPLETED</strong>
          </span>
        </div>
        <div className="rule-item">
          <span className="rule-icon">🚫</span>
          <span className="rule-text">
            Self-report never counts. <strong>No "trust me" completions.</strong>
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
