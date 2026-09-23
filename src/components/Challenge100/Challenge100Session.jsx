import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getChallengeDayContent } from '../../data/challenge100Data';
import {
  getChallenge100State,
  toggleExerciseAttempt,
  submitDayForVerification,
} from '../../utils/challenge100Storage';

/**
 * Challenge100Session — Individual Daily Training Room.
 */
export default function Challenge100Session({ dayNum, onBackToChecklist, onOpenCoachReview }) {
  const dayContent = getChallengeDayContent(dayNum);
  const [state, setState] = useState(getChallenge100State());
  const dayState = state.days[dayNum] || {
    status: dayNum === 1 ? 'NOT_STARTED' : 'LOCKED',
    exerciseCompletion: {},
  };

  const [transcriptInput, setTranscriptInput] = useState(dayState.evidence?.transcript || '');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(dayState.evidence?.audioUrl || null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleToggleEx = (exKey) => {
    const updated = toggleExerciseAttempt(dayNum, exKey);
    setState(updated);
  };

  // Voice recording simulation (integrates with MediaRecorder if available or simulated voice note)
  const handleSimulateRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setRecordedAudio('simulated_audio_submission_day_' + dayNum + '.mp3');
      }, 3000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!transcriptInput.trim() && !recordedAudio) {
      alert("Please enter a transcript or record audio of your speaking attempt before submitting!");
      return;
    }

    const updated = submitDayForVerification(dayNum, {
      transcript: transcriptInput,
      audioUrl: recordedAudio,
    });
    setState(updated);
    setSubmissionSuccess(true);
    setTimeout(() => setSubmissionSuccess(false), 4000);
  };

  const isLocked = dayState.status === 'LOCKED';
  const exComp = dayState.exerciseCompletion || {};
  const allAttempted = exComp.ex1 && exComp.ex2 && exComp.ex3 && exComp.ex4 && exComp.ex5 && exComp.final;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', color: '#FFFFFF', padding: '1rem' }}>
      {/* Navigation Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button
          onClick={onBackToChecklist}
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '9999px',
            color: '#FFFFFF',
            padding: '0.45rem 1.2rem',
            fontFamily: 'var(--t-font-body)',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          ← Back to Checklist
        </button>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button
            onClick={onOpenCoachReview}
            style={{
              background: 'rgba(139, 92, 246, 0.25)',
              border: '1px solid #8B5CF6',
              borderRadius: '9999px',
              color: '#FFFFFF',
              padding: '0.45rem 1.2rem',
              fontFamily: 'var(--t-font-body)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            🛡️ Coach Verification Panel
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.2) 100%)',
          border: '1.5px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '28px',
          padding: '2rem 2.5rem',
          backdropFilter: 'blur(24px)',
          marginBottom: '2rem',
          boxShadow: '0 20px 60px rgba(45, 27, 105, 0.2)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.8rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: dayContent.phaseColor, letterSpacing: '0.12em' }}>
            {dayContent.phase} • DAY {dayContent.day} OF 100
          </span>
          <span
            style={{
              background: dayState.status === 'VERIFIED' ? 'rgba(16, 185, 129, 0.3)' : dayState.status === 'AWAITING_VERIFICATION' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255, 255, 255, 0.15)',
              border: `1px solid ${dayState.status === 'VERIFIED' ? '#10B981' : '#FFFFFF'}`,
              padding: '0.3rem 0.9rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 800,
            }}
          >
            STATUS: {dayState.status}
          </span>
        </div>

        <h1 style={{ fontFamily: 'var(--t-font-heading)', fontSize: '2.2rem', fontWeight: 800, margin: '0.2rem 0 0.6rem' }}>
          {dayContent.title}
        </h1>

        <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.88)', lineHeight: 1.5, margin: 0 }}>
          🎯 <strong>Target Goal:</strong> {dayContent.goal}
        </p>

        {dayState.review?.feedback && (
          <div style={{ marginTop: '1.2rem', padding: '1rem 1.2rem', background: 'rgba(239, 68, 68, 0.18)', border: '1px solid #EF4444', borderRadius: '16px' }}>
            <div style={{ fontWeight: 800, color: '#FCA5A5', fontSize: '0.85rem' }}>🔁 Coach Target Correction Feedback:</div>
            <div style={{ fontSize: '0.85rem', color: '#FFFFFF', marginTop: '0.3rem' }}>{dayState.review.feedback}</div>
          </div>
        )}
      </div>

      {isLocked ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
          <h2>Day {dayNum} is Locked</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '440px', margin: '0.5rem auto' }}>
            You must complete and receive <strong>Coach Verification</strong> for Day {dayNum - 1} before accessing Day {dayNum}.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>

          {/* EXERCISE 1 — Mouth & Tongue Articulation */}
          <div style={{ background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: '24px', padding: '1.8rem', backdropFilter: 'blur(20px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--t-font-heading)', fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                1️⃣ {dayContent.exercise1.name}
              </h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', background: exComp.ex1 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.1)', padding: '0.4rem 0.9rem', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.3)', fontSize: '0.78rem', fontWeight: 700 }}>
                <input type="checkbox" checked={!!exComp.ex1} onChange={() => handleToggleEx('ex1')} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                <span>{exComp.ex1 ? '✓ Attempted' : 'Mark Attempted'}</span>
              </label>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.2rem', borderRadius: '16px', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '0.1em', color: '#A5B4FC', textAlign: 'center', margin: '0.4rem 0' }}>
                {dayContent.exercise1.pattern}
              </div>
              <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>
                Focus: {dayContent.exercise1.focus} • Reps: {dayContent.exercise1.repetitions}
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>
              <strong>Speed Progression:</strong> {dayContent.exercise1.speedProgression}
              <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem' }}>
                {dayContent.exercise1.instructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* EXERCISE 2 — Pen Reading (Compulsory) */}
          <div style={{ background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: '24px', padding: '1.8rem', backdropFilter: 'blur(20px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--t-font-heading)', fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                2️⃣ 🖊️ {dayContent.exercise2.name}
              </h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', background: exComp.ex2 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.1)', padding: '0.4rem 0.9rem', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.3)', fontSize: '0.78rem', fontWeight: 700 }}>
                <input type="checkbox" checked={!!exComp.ex2} onChange={() => handleToggleEx('ex2')} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                <span>{exComp.ex2 ? '✓ Attempted' : 'Mark Attempted'}</span>
              </label>
            </div>

            {/* Safety Banner */}
            <div style={{ background: 'rgba(239, 68, 68, 0.18)', border: '1px solid #EF4444', borderRadius: '14px', padding: '0.9rem 1.1rem', fontSize: '0.8rem', color: '#FCA5A5', marginBottom: '1.2rem', fontWeight: 600 }}>
              {dayContent.exercise2.safetyWarning}
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.2rem', marginBottom: '1.2rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#A5B4FC', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>PROCEDURE</div>
              {dayContent.exercise2.procedure.map((step, idx) => (
                <div key={idx} style={{ fontSize: '0.82rem', marginBottom: '0.3rem', color: 'rgba(255,255,255,0.9)' }}>{step}</div>
              ))}
            </div>

            <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', padding: '1.4rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                ARTICULATION PASSAGE (Target Duration: {dayContent.exercise2.duration})
              </div>
              <p style={{ fontFamily: 'var(--t-font-body)', fontSize: '0.95rem', lineHeight: 1.7, color: '#FFFFFF', margin: 0, fontStyle: 'italic' }}>
                "{dayContent.exercise2.passage}"
              </p>
            </div>
          </div>

          {/* EXERCISE 3 — Advanced Tongue Twisters */}
          <div style={{ background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: '24px', padding: '1.8rem', backdropFilter: 'blur(20px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--t-font-heading)', fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                3️⃣ 👅 {dayContent.exercise3.name}
              </h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', background: exComp.ex3 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.1)', padding: '0.4rem 0.9rem', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.3)', fontSize: '0.78rem', fontWeight: 700 }}>
                <input type="checkbox" checked={!!exComp.ex3} onChange={() => handleToggleEx('ex3')} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                <span>{exComp.ex3 ? '✓ Attempted' : 'Mark Attempted'}</span>
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.8rem', marginBottom: '1.2rem' }}>
              {dayContent.exercise3.rounds.map((r, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '0.8rem', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.75rem' }}>
                  <div style={{ fontWeight: 800, color: '#A5B4FC' }}>{r.round}</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', marginTop: '0.2rem' }}>{r.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {dayContent.exercise3.twisters.map((t, idx) => (
                <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem 1.2rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#F472B6', textTransform: 'uppercase' }}>Focus: {t.category}</span>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, marginTop: '0.2rem', color: '#FFFFFF' }}>"{t.text}"</div>
                </div>
              ))}
            </div>
          </div>

          {/* EXERCISE 4 — Speaking Challenge & Evidence Submission */}
          <div style={{ background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: '24px', padding: '1.8rem', backdropFilter: 'blur(20px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--t-font-heading)', fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                4️⃣ 🎤 {dayContent.exercise4.name}
              </h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', background: exComp.ex4 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.1)', padding: '0.4rem 0.9rem', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.3)', fontSize: '0.78rem', fontWeight: 700 }}>
                <input type="checkbox" checked={!!exComp.ex4} onChange={() => handleToggleEx('ex4')} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                <span>{exComp.ex4 ? '✓ Attempted' : 'Mark Attempted'}</span>
              </label>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: '18px', padding: '1.4rem', border: '1px solid rgba(255,255,255,0.15)', marginBottom: '1.2rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#818CF8', letterSpacing: '0.1em' }}>SPONTANEOUS TOPIC ({dayContent.exercise4.duration})</div>
              <h2 style={{ fontFamily: 'var(--t-font-heading)', fontSize: '1.4rem', fontWeight: 800, margin: '0.3rem 0 0.8rem' }}>
                {dayContent.exercise4.topic}
              </h2>

              <div style={{ fontSize: '0.8rem', color: '#F472B6', fontWeight: 700, marginBottom: '0.6rem' }}>
                🎯 Articulation Focus: {dayContent.exercise4.articulationFocus}
              </div>

              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.9)' }}>
                <strong>Key Points to Cover:</strong>
                <ul style={{ paddingLeft: '1.2rem', marginTop: '0.4rem' }}>
                  {dayContent.exercise4.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Audio Recording / Transcript Evidence Input */}
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '18px', padding: '1.2rem', border: '1px solid rgba(255,255,255,0.15)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.8rem' }}>🎙️ Voice Evidence & Transcript Submission</h4>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleSimulateRecord}
                  disabled={isRecording}
                  style={{
                    background: isRecording ? '#EF4444' : '#6366F1',
                    color: '#FFFFFF', border: 'none', borderRadius: '9999px',
                    padding: '0.55rem 1.4rem', fontSize: '0.8rem', fontWeight: 700,
                    cursor: isRecording ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                  }}
                >
                  <span>{isRecording ? '🔴 Recording (3s)...' : '🎙️ Record Voice Attempt'}</span>
                </button>

                {recordedAudio && (
                  <span style={{ fontSize: '0.78rem', color: '#34D399', fontWeight: 700 }}>
                    ✓ Voice Recording Attached ({recordedAudio})
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Or Submit Exact Spoken Transcript:
                </label>
                <textarea
                  rows={4}
                  value={transcriptInput}
                  onChange={(e) => setTranscriptInput(e.target.value)}
                  placeholder="Type or paste the exact words spoken during your spontaneous speaking challenge..."
                  style={{
                    width: '100%', padding: '0.9rem', background: 'rgba(0,0,0,0.3)',
                    border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: '12px',
                    color: '#FFFFFF', fontFamily: 'var(--t-font-body)', fontSize: '0.85rem', outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* EXERCISE 5 — Running / Breath Training */}
          <div style={{ background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: '24px', padding: '1.8rem', backdropFilter: 'blur(20px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--t-font-heading)', fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                5️⃣ 🏃 {dayContent.exercise5.name}
              </h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', background: exComp.ex5 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.1)', padding: '0.4rem 0.9rem', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.3)', fontSize: '0.78rem', fontWeight: 700 }}>
                <input type="checkbox" checked={!!exComp.ex5} onChange={() => handleToggleEx('ex5')} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                <span>{exComp.ex5 ? '✓ Attempted' : 'Mark Attempted'}</span>
              </label>
            </div>

            <div style={{ background: 'rgba(239, 68, 68, 0.18)', border: '1px solid #EF4444', borderRadius: '14px', padding: '0.9rem 1.1rem', fontSize: '0.8rem', color: '#FCA5A5', marginBottom: '1.2rem', fontWeight: 600 }}>
              {dayContent.exercise5.safetyWarning}
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.2rem', borderRadius: '16px', marginBottom: '0.8rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34D399', marginBottom: '0.3rem' }}>🏃 Today's Running / Walking Program:</div>
              <div style={{ fontSize: '0.92rem', color: '#FFFFFF', lineHeight: 1.5 }}>{dayContent.exercise5.program}</div>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
              💡 <em>{dayContent.exercise5.breathingInstruction}</em>
            </p>
          </div>

          {/* FINAL CHALLENGE */}
          <div style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)', border: '1.5px solid rgba(236, 72, 153, 0.4)', borderRadius: '24px', padding: '1.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--t-font-heading)', fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#F472B6' }}>
                {dayContent.finalChallenge.name}
              </h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', background: exComp.final ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.1)', padding: '0.4rem 0.9rem', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.3)', fontSize: '0.78rem', fontWeight: 700 }}>
                <input type="checkbox" checked={!!exComp.final} onChange={() => handleToggleEx('final')} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                <span>{exComp.final ? '✓ Attempted' : 'Mark Attempted'}</span>
              </label>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#FFFFFF', lineHeight: 1.6, margin: 0 }}>
              {dayContent.finalChallenge.instruction}
            </p>
          </div>

          {/* Submission Action Box */}
          <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'rgba(255,255,255,0.08)', borderRadius: '24px', border: '1.5px solid rgba(255,255,255,0.3)' }}>
            {submissionSuccess && (
              <div style={{ background: 'rgba(16, 185, 129, 0.25)', border: '1px solid #10B981', color: '#34D399', borderRadius: '12px', padding: '0.8rem', marginBottom: '1rem', fontWeight: 700 }}>
                ✓ Day {dayNum} Submitted for Coach Verification! Status changed to 🟡 Awaiting Verification.
              </div>
            )}

            <button
              onClick={handleSubmit}
              style={{
                background: allAttempted ? 'linear-gradient(135deg, #10B981, #059669)' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                color: '#FFFFFF', border: 'none', borderRadius: '9999px',
                padding: '1rem 3rem', fontFamily: 'var(--t-font-body)',
                fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.06em',
                cursor: 'pointer', boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
              }}
            >
              Submit Day {dayNum} for Coach Verification →
            </button>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.6rem' }}>
              Note: Day {dayNum + 1} will unlock automatically after coach review & verification.
            </p>
          </div>

        </div>
      )}
    </div>
  );
}
