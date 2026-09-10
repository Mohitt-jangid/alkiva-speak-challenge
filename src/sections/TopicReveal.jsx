import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDailyTopic, formatDisplayDate } from '../utils/dailyTopic';

/**
 * TopicReveal — Full-screen overlay, fully responsive for mobile.
 */

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      delay: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: 0.98,
    transition: { duration: 0.3 },
  },
};

const lineVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.5 + i * 0.1,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function TopicReveal({ isVisible, onClose }) {
  const { topic } = getDailyTopic();
  const displayDate = formatDisplayDate();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="topic-reveal"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 5000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(250, 248, 245, 0.97)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
          onClick={onClose}
        >
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            style={{
              textAlign: 'center',
              maxWidth: '700px',
              width: '100%',
              padding: 'clamp(1.5rem, 5vw, 3rem)',
              margin: 'auto',
            }}
          >
            {/* Date label */}
            <motion.p
              custom={0}
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              className="label"
              style={{
                marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)',
                color: 'var(--color-accent)',
                fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)',
              }}
            >
              TODAY'S CHALLENGE — {displayDate}
            </motion.p>

            {/* Topic */}
            <motion.h2
              custom={1}
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.5rem, 5vw, 3.5rem)',
                fontWeight: 700,
                lineHeight: 1.2,
                color: 'var(--color-text-primary)',
                marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)',
                letterSpacing: '-0.02em',
                padding: '0 0.5rem',
              }}
            >
              {topic}
            </motion.h2>

            {/* Divider */}
            <motion.div
              custom={2}
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              style={{
                width: '50px',
                height: '1px',
                background: 'var(--color-accent)',
                margin: '0 auto clamp(1rem, 3vw, 1.5rem)',
              }}
            />

            {/* Suggested time */}
            <motion.p
              custom={3}
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--space-sm)',
                letterSpacing: '0.05em',
              }}
            >
              Suggested time: 3–5 minutes
            </motion.p>

            {/* Encouragement */}
            <motion.p
              custom={4}
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                fontStyle: 'italic',
                color: 'var(--color-text-secondary)',
                marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)',
                lineHeight: 1.6,
                padding: '0 0.5rem',
              }}
            >
              Don't prepare a perfect script. Think. Speak. Make mistakes.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              custom={5}
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '0 1rem',
              }}
            >
              <button
                className="btn-primary"
                onClick={onClose}
                style={{
                  width: '100%',
                  maxWidth: '280px',
                  justifyContent: 'center',
                }}
              >
                <span>START THE CHALLENGE</span>
                <span className="arrow">→</span>
              </button>
            </motion.div>

            {/* Close hint */}
            <motion.p
              custom={6}
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              style={{
                marginTop: 'clamp(1rem, 3vw, 1.5rem)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.6rem',
                color: 'var(--color-text-muted)',
                letterSpacing: '0.1em',
              }}
            >
              TAP ANYWHERE TO CLOSE
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
