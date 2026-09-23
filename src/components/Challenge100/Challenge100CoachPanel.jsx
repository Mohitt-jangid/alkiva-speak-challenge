import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getChallenge100State, coachReviewDay } from '../../utils/challenge100Storage';

/**
 * Challenge100CoachPanel — Verification & Feedback Panel for Coach/Owner.
 */
export default function Challenge100CoachPanel({ initialDay = 1, onClose }) {
  const [state, setState] = useState(getChallenge100State());
  const [selectedDay, setSelectedDay] = useState(initialDay);

  const dayState = state.days[selectedDay] || {};

  // Form state for 7 scoring criteria
  const [scores, setScores] = useState(dayState.review?.scores || {
    articulation: 8,
    pronunciation: 8,
    clarity: 8,
    speedControl: 8,
    fluency: 8,
    wordEndings: 8,
    confidence: 8,
  });

  const [biggestProblem, setBiggestProblem] = useState(dayState.review?.biggestProblem || 'Consonant ending crispness');
  const [nextFocus, setNextFocus] = useState(dayState.review?.nextFocus || 'Maintain diaphragmatic breath support on final sentences');
  const [feedbackNote, setFeedbackNote] = useState(dayState.review?.feedback || '');
  const [actionSuccess, setActionSuccess] = useState('');

  const handleScoreChange = (key, val) => {
    setScores((prev) => ({ ...prev, [key]: Math.min(10, Math.max(1, parseInt(val, 10) || 1)) }));
  };

  const handleVerify = (verifiedBool) => {
    const updated = coachReviewDay(selectedDay, {
      verified: verifiedBool,
      scores,
      biggestProblem,
      nextFocus,
      feedback: feedbackNote,
    });
    setState(updated);
    const msg = verifiedBool
      ? `✓ Day ${selectedDay} Verified! Day ${selectedDay + 1} is now Unlocked!`
      : `🔁 Day ${selectedDay} marked for Repeat Required with target feedback.`;
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 4000);
  };

  const awaitingDays = Object.values(state.days).filter((d) => d.status === 'AWAITING_VERIFICATION');

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', color: '#FFFFFF', padding: '1rem' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(49, 46, 129, 0.95) 100%)',
          border: '1.5px solid rgba(139, 92, 246, 0.4)',
          borderRadius: '28px',
          padding: '2rem 2.5rem',
          backdropFilter: 'blur(30px)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#A5B4FC', letterSpacing: '0.12em' }}>
              🛡️ COACH / OWNER VERIFICATION PANEL
            </span>
            <h2 style={{ fontFamily: 'var(--t-font-heading)', fontSize: '1.8rem', fontWeight: 800, margin: '0.2rem 0 0' }}>
              Evaluation & Verification Room
            </h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '9999px',
                color: '#FFFFFF', padding: '0.4rem 1rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
              }}
            >
              Close Panel ✕
            </button>
          )}
        </div>

        {/* Day Selector */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
            Select Day to Review & Score:
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {Array.from({ length: 100 }, (_, i) => i + 1).map((dNum) => {
              const dObj = state.days[dNum] || {};
              const isSelected = selectedDay === dNum;
              const isAwaiting = dObj.status === 'AWAITING_VERIFICATION';
              const isVerified = dObj.status === 'VERIFIED';
              return (
                <button
                  key={dNum}
                  onClick={() => {
                    setSelectedDay(dNum);
                    setScores(dObj.review?.scores || { articulation: 8, pronunciation: 8, clarity: 8, speedControl: 8, fluency: 8, wordEndings: 8, confidence: 8 });
                    setBiggestProblem(dObj.review?.biggestProblem || 'Consonant ending crispness');
                    setNextFocus(dObj.review?.nextFocus || 'Maintain diaphragmatic breath support');
                    setFeedbackNote(dObj.review?.feedback || '');
                  }}
                  style={{
                    background: isSelected ? '#8B5CF6' : isAwaiting ? 'rgba(245, 158, 11, 0.3)' : isVerified ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                    border: `1px solid ${isSelected ? '#FFFFFF' : isAwaiting ? '#F59E0B' : 'rgba(255,255,255,0.15)'}`,
                    color: '#FFFFFF',
                    borderRadius: '10px',
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Day {dNum} {isAwaiting ? '🟡' : isVerified ? '✓' : ''}
                </button>
              );
            })}
          </div>

          {awaitingDays.length > 0 && (
            <div style={{ fontSize: '0.78rem', color: '#FBBF24', marginTop: '0.4rem', fontWeight: 700 }}>
              ⚡ {awaitingDays.length} Submission(s) Awaiting Review: Days {awaitingDays.map((d) => d.day).join(', ')}
            </div>
          )}
        </div>

        {/* Selected Day Overview & Evidence */}
        <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px', padding: '1.4rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Reviewing Day {selectedDay}</h3>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.8rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.15)' }}>
              Status: {dayState.status}
            </span>
          </div>

          {/* Evidence Check */}
          <div style={{ marginTop: '0.8rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.9)' }}>
            <strong>Submitted Evidence:</strong>
            {dayState.evidence ? (
              <div style={{ marginTop: '0.4rem', padding: '0.8rem', background: 'rgba(255,255,255,0.06)', borderRadius: '12px' }}>
                {dayState.evidence.audioUrl && (
                  <div style={{ color: '#34D399', fontWeight: 700, marginBottom: '0.3rem' }}>
                    🎙️ Audio File Attached: {dayState.evidence.audioUrl}
                  </div>
                )}
                {dayState.evidence.transcript ? (
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Transcript:</span>
                    <p style={{ margin: '0.2rem 0 0', fontStyle: 'italic', color: '#FFFFFF' }}>"{dayState.evidence.transcript}"</p>
                  </div>
                ) : (
                  <div style={{ color: 'rgba(255,255,255,0.6)' }}>No text transcript provided.</div>
                )}
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.4rem' }}>
                  Submitted: {new Date(dayState.evidence.submittedAt).toLocaleString()}
                </div>
              </div>
            ) : (
              <div style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.2rem' }}>No evidence submitted yet for Day {selectedDay}.</div>
            )}
          </div>
        </div>

        {/* 7 Scoring Criteria Grid */}
        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>📊 Evaluation Criteria (Scores out of 10)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { key: 'articulation', label: 'Articulation' },
            { key: 'pronunciation', label: 'Pronunciation' },
            { key: 'clarity', label: 'Clarity' },
            { key: 'speedControl', label: 'Speed Control' },
            { key: 'fluency', label: 'Speaking Fluency' },
            { key: 'wordEndings', label: 'Word Endings' },
            { key: 'confidence', label: 'Confidence' },
          ].map((item) => (
            <div key={item.key} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '14px', padding: '0.9rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                <span>{item.label}</span>
                <span style={{ color: '#818CF8' }}>{scores[item.key]} / 10</span>
              </div>
              <input
                type="range" min="1" max="10"
                value={scores[item.key]}
                onChange={(e) => handleScoreChange(item.key, e.target.value)}
                style={{ width: '100%', accentColor: '#8B5CF6', cursor: 'pointer' }}
              />
            </div>
          ))}
        </div>

        {/* Qualitative Feedback Text Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '0.4rem' }}>
              🎯 Biggest Problem Observed:
            </label>
            <input
              type="text" value={biggestProblem} onChange={(e) => setBiggestProblem(e.target.value)}
              style={{ width: '100%', padding: '0.7rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#FFF', outline: 'none', fontSize: '0.82rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '0.4rem' }}>
              🔧 Next Focus Recommendation:
            </label>
            <input
              type="text" value={nextFocus} onChange={(e) => setNextFocus(e.target.value)}
              style={{ width: '100%', padding: '0.7rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#FFF', outline: 'none', fontSize: '0.82rem' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '0.4rem' }}>
            Targeted Correction / Repeat Notes for Participant:
          </label>
          <textarea
            rows={2} value={feedbackNote} onChange={(e) => setFeedbackNote(e.target.value)}
            placeholder="E.g., Your /R/ and /L/ distinction needs more control. Repeat Exercise 1 and Tongue Twister #2."
            style={{ width: '100%', padding: '0.7rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#FFF', outline: 'none', fontSize: '0.82rem' }}
          />
        </div>

        {/* Action Buttons */}
        {actionSuccess && (
          <div style={{ background: 'rgba(16, 185, 129, 0.25)', border: '1px solid #10B981', color: '#34D399', borderRadius: '12px', padding: '0.8rem', marginBottom: '1rem', fontWeight: 700, textAlign: 'center' }}>
            {actionSuccess}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={() => handleVerify(true)}
            style={{
              background: 'linear-gradient(135deg, #10B981, #059669)', color: '#FFFFFF',
              border: 'none', borderRadius: '9999px', padding: '0.85rem 2rem',
              fontFamily: 'var(--t-font-body)', fontSize: '0.9rem', fontWeight: 800,
              cursor: 'pointer', boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
            }}
          >
            [ ✓ Verify Day & Unlock Day {selectedDay + 1} ]
          </button>

          <button
            onClick={() => handleVerify(false)}
            style={{
              background: 'rgba(239, 68, 68, 0.2)', border: '1.5px solid #EF4444',
              color: '#FCA5A5', borderRadius: '9999px', padding: '0.85rem 2rem',
              fontFamily: 'var(--t-font-body)', fontSize: '0.9rem', fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            [ 🔁 Request Repeat ]
          </button>
        </div>
      </div>
    </div>
  );
}
