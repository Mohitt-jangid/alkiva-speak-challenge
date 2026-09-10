import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MotivationalHero from '../components/MotivationalHero';
import { getDailyTopic, formatDisplayDate } from '../utils/dailyTopic';

/**
 * HeroSection — Centered layout.
 * Clicking "Discover" immediately shows today's topic. No spinning animation.
 */

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.3 + i * 0.12,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function HeroSection() {
  const [revealed, setRevealed] = useState(false);

  const { topic } = getDailyTopic();
  const displayDate = formatDisplayDate();

  const handleDiscover = useCallback(() => {
    if (revealed) return;
    setRevealed(true);
  }, [revealed]);

  const handleReset = useCallback(() => {
    setRevealed(false);
  }, []);

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        textAlign: 'center',
        padding: 'calc(var(--nav-height) + 1rem) clamp(1rem, 4vw, 3rem) 2rem',
      }}
    >
      {/* Top label */}
      <motion.p
        className="label"
        custom={0}
        initial="hidden"
        animate="visible"
        variants={textVariants}
        style={{
          marginBottom: 'clamp(0.8rem, 2vw, 1.5rem)',
          color: 'var(--color-accent)',
          fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)',
        }}
      >
        TALKIVA
      </motion.p>

      {/* Headline — hides when topic is revealed */}
      <AnimatePresence>
        {!revealed && (
          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20, height: 0, marginBottom: 0, transition: { duration: 0.4 } }}
            variants={textVariants}
            style={{
              marginBottom: 'clamp(0.8rem, 2vw, 1.5rem)',
              lineHeight: 1.1,
              maxWidth: '700px',
              padding: '0 0.5rem',
            }}
          >
            One Topic.
            <br />
            One Camera.
            <br />
            <span style={{ color: 'var(--color-accent-dark)' }}>
              One Step Better.
            </span>
          </motion.h1>
        )}
      </AnimatePresence>

      {/* Subtitle — hides when topic is revealed */}
      <AnimatePresence>
        {!revealed && (
          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -15, height: 0, marginBottom: 0, transition: { duration: 0.3 } }}
            variants={textVariants}
            style={{
              fontSize: 'clamp(0.85rem, 2.5vw, 1.05rem)',
              color: 'var(--color-text-secondary)',
              maxWidth: '480px',
              lineHeight: 1.6,
              marginBottom: 'clamp(1rem, 3vw, 2rem)',
              padding: '0 0.5rem',
            }}
          >
            A daily challenge designed to help you think, speak, and become more confident.
          </motion.p>
        )}
      </AnimatePresence>

      {/* Motivational cycling text (idle only, hidden when topic revealed) */}
      <AnimatePresence>
        {!revealed && (
          <motion.div
            custom={2.5}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
            variants={textVariants}
            style={{
              marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)',
              width: '100%',
              maxWidth: '650px',
            }}
          >
            <MotivationalHero />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Revealed Topic — shown directly, no spinning */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            key="topic-result"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'clamp(0.8rem, 2vw, 1.2rem)',
              marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)',
              padding: '0 0.5rem',
              maxWidth: '650px',
              width: '100%',
            }}
          >
            {/* Date */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(0.55rem, 1.5vw, 0.65rem)',
                fontWeight: 600,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
              }}
            >
              TODAY'S CHALLENGE — {displayDate}
            </motion.span>

            {/* Topic */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.6rem, 5.5vw, 3.2rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.02em',
                maxWidth: '600px',
              }}
            >
              {topic}
            </motion.h2>

            {/* Divider */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 50 }}
              transition={{ delay: 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height: '1.5px',
                background: 'var(--color-accent)',
              }}
            />

            {/* Time + encouragement */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
                color: 'var(--color-text-muted)',
                letterSpacing: '0.05em',
              }}
            >
              Suggested time: 3–5 minutes
            </motion.span>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
                fontStyle: 'italic',
                color: 'var(--color-text-secondary)',
                maxWidth: '420px',
                lineHeight: 1.5,
              }}
            >
              Don't prepare a perfect script. Think. Speak. Make mistakes.
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buttons */}
      <motion.div
        custom={3}
        initial="hidden"
        animate="visible"
        variants={textVariants}
        style={{
          width: '100%',
          maxWidth: '320px',
          padding: '0 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(0.6rem, 2vw, 1rem)',
          alignItems: 'center',
        }}
      >
        <AnimatePresence mode="wait">
          {revealed ? (
            <motion.div
              key="revealed-actions"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(0.5rem, 2vw, 0.8rem)',
                width: '100%',
                alignItems: 'center',
              }}
            >
              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  const el = document.getElementById('concept');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>START THE CHALLENGE</span>
                <span className="arrow">→</span>
              </button>
              <button
                onClick={handleReset}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.65rem',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.target.style.color = 'var(--color-accent)')}
                onMouseLeave={(e) => (e.target.style.color = 'var(--color-text-muted)')}
              >
                ← BACK TO HOME
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="discover-action"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%' }}
            >
              <button
                className="btn-primary"
                onClick={handleDiscover}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                <span>DISCOVER TODAY'S CHALLENGE</span>
                <span className="arrow">→</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </section>
  );
}
