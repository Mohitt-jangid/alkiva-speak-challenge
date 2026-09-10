import React, { useRef, useState, Suspense, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import MissionSculpture from '../components/MissionSculpture';
import { REAL_LIFE_CHALLENGES, formatDisplayDate } from '../utils/dailyTopic';

/**
 * MissionSection — Random Real-Life Challenge.
 * Every spin gives a new random challenge (opposite of daily topic which is fixed).
 */

const difficultyColors = {
  Easy: '#6B8F6B',
  Medium: '#C9A96E',
  Hard: '#A85A4A',
};

function getRandomChallenge(excludeIndex) {
  let idx;
  do {
    idx = Math.floor(Math.random() * REAL_LIFE_CHALLENGES.length);
  } while (idx === excludeIndex && REAL_LIFE_CHALLENGES.length > 1);
  return { challenge: REAL_LIFE_CHALLENGES[idx], index: idx };
}

export default function MissionSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [lastIndex, setLastIndex] = useState(-1);
  const [accepted, setAccepted] = useState(false);
  const [spinKey, setSpinKey] = useState(0); // forces re-animation

  const displayDate = formatDisplayDate();

  const handleSpin = useCallback(() => {
    setAccepted(false);
    const result = getRandomChallenge(lastIndex);
    setCurrentChallenge(result.challenge);
    setLastIndex(result.index);
    setSpinKey((k) => k + 1);
  }, [lastIndex]);

  const handleAccept = () => {
    if (accepted) return;
    setAccepted(true);
  };

  return (
    <section
      id="mission"
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(3rem, 8vw, 8rem) clamp(1rem, 4vw, 3rem)',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(180deg, var(--color-bg) 0%, var(--color-bg-warm) 50%, var(--color-bg) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(2rem, 5vw, 5rem)',
          maxWidth: 'var(--max-width)',
          width: '100%',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {/* 3D Sculpture */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: 'clamp(250px, 40vw, 420px)',
            height: 'clamp(250px, 40vw, 420px)',
            flexShrink: 0,
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 5], fov: 35 }}
            shadows
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.35} />
              <directionalLight position={[4, 6, 5]} intensity={1.1} castShadow shadow-mapSize={[512, 512]} />
              <directionalLight position={[-3, -2, 3]} intensity={0.25} color="#C9A96E" />
              <pointLight position={[0, 0, 4]} intensity={0.4} color="#FAF8F5" />
              <Environment preset="city" environmentIntensity={0.25} />
              <MissionSculpture accepted={accepted} />
            </Suspense>
          </Canvas>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: '520px', flex: '1 1 320px' }}
        >
          {/* Section label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="label"
            style={{
              color: 'var(--color-accent)',
              marginBottom: 'clamp(0.5rem, 1.5vw, 1rem)',
              fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)',
            }}
          >
            DAILY MISSION
          </motion.p>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.6rem, 4.5vw, 3rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: 'clamp(0.8rem, 2vw, 1.2rem)',
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            Your Random Challenge
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(0.85rem, 2.2vw, 0.95rem)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
            }}
          >
            {currentChallenge
              ? "Here's your mission. Every spin gives you a new one."
              : 'Hit spin to receive a random real-life mission. Each spin brings a different challenge.'}
          </motion.p>

          {/* Challenge Card — appears after spin */}
          <AnimatePresence mode="wait">
            {currentChallenge && (
              <motion.div
                key={spinKey}
                initial={{ opacity: 0, y: 25, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.97 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
                  borderLeft: '2px solid var(--color-accent)',
                  paddingLeft: 'clamp(1rem, 2.5vw, 1.5rem)',
                }}
              >
                {/* Challenge title */}
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.2rem, 3.5vw, 1.8rem)',
                    fontWeight: 700,
                    lineHeight: 1.2,
                    marginBottom: 'clamp(0.5rem, 1.5vw, 0.8rem)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {currentChallenge.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                    lineHeight: 1.7,
                    color: 'var(--color-text-secondary)',
                    marginBottom: 'clamp(0.8rem, 2vw, 1.2rem)',
                  }}
                >
                  {currentChallenge.description}
                </p>

                {/* Meta pills */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 'clamp(0.4rem, 1vw, 0.6rem)',
                  }}
                >
                  <span style={pillStyle()}>{currentChallenge.category}</span>
                  <span style={pillStyle(difficultyColors[currentChallenge.difficulty])}>
                    {currentChallenge.difficulty}
                  </span>
                  <span style={pillStyle()}>⏱ {currentChallenge.duration}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'clamp(0.5rem, 1.5vw, 0.8rem)',
              alignItems: 'center',
            }}
          >
            {/* Spin button — always visible */}
            <button
              className="btn-primary"
              onClick={handleSpin}
              style={{
                flex: '1 1 auto',
                maxWidth: '260px',
                justifyContent: 'center',
              }}
            >
              <span>{currentChallenge ? 'SPIN AGAIN' : 'SPIN A MISSION'}</span>
              <span className="arrow">↻</span>
            </button>

            {/* Accept button — only after a challenge is shown */}
            <AnimatePresence>
              {currentChallenge && !accepted && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="btn-primary"
                  onClick={handleAccept}
                  style={{
                    flex: '1 1 auto',
                    maxWidth: '260px',
                    justifyContent: 'center',
                    borderColor: 'var(--color-accent)',
                    color: 'var(--color-accent-dark)',
                  }}
                >
                  <span>ACCEPT</span>
                  <span className="arrow">→</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Accepted confirmation */}
          <AnimatePresence>
            {accepted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-sm)',
                  marginTop: 'clamp(0.8rem, 2vw, 1.2rem)',
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 15 }}
                  style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: 'var(--color-accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-bg)', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
                  }}
                >✓</motion.div>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(0.65rem, 1.8vw, 0.75rem)',
                    fontWeight: 600, letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--color-accent-dark)',
                  }}
                >
                  CHALLENGE ACCEPTED
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Responsive stacking */}
      <style>{`
        @media (max-width: 768px) {
          #mission > div:nth-child(2) {
            flex-direction: column !important;
            text-align: center;
          }
          #mission > div:nth-child(2) > div:last-child {
            text-align: left;
          }
        }
      `}</style>
    </section>
  );
}

/* Helper: pill style */
function pillStyle(color) {
  return {
    fontFamily: 'var(--font-sans)',
    fontSize: 'clamp(0.55rem, 1.3vw, 0.65rem)',
    fontWeight: color ? 600 : 500,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: color || 'var(--color-text-secondary)',
    padding: '0.35rem 0.7rem',
    border: `1px solid ${color || 'var(--color-border)'}`,
    borderRadius: '2px',
  };
}
