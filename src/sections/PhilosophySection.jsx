import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * PhilosophySection — Connects the two core features (Speaking + Real-Life Challenge)
 * with the website's philosophy: Think. Experience. Speak. Repeat.
 */

const steps = [
  {
    label: 'DAILY SPEAKING TOPIC',
    main: 'Think & Speak',
    desc: 'Receive a topic. Organise your thoughts. Express yourself on camera.',
    icon: '🎤',
  },
  {
    label: 'DAILY REAL-LIFE CHALLENGE',
    main: 'Go & Experience',
    desc: 'Step outside your routine. Do something meaningful. Collect real stories.',
    icon: '🌍',
  },
  {
    label: 'THE RESULT',
    main: 'Grow Every Day',
    desc: 'More experiences. More thoughts. Better speaking. A better you.',
    icon: '✦',
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.2 + i * 0.2,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function PhilosophySection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(3rem, 8vw, 8rem) clamp(1rem, 4vw, 3rem)',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      {/* Section label */}
      <motion.p
        className="label"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        style={{
          color: 'var(--color-accent)',
          marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)',
        }}
      >
        THE PHILOSOPHY
      </motion.p>

      {/* Main statement */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
          fontWeight: 700,
          lineHeight: 1.15,
          maxWidth: '650px',
          marginBottom: 'clamp(2rem, 5vw, 4rem)',
          letterSpacing: '-0.02em',
        }}
      >
        Think. Experience. Speak.{' '}
        <span style={{ color: 'var(--color-accent-dark)', fontStyle: 'italic' }}>
          Repeat.
        </span>
      </motion.h2>

      {/* Three pillars */}
      <div
        style={{
          display: 'flex',
          gap: 'clamp(1rem, 3vw, 2rem)',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: '900px',
          width: '100%',
        }}
      >
        {steps.map((step, i) => (
          <motion.div
            key={step.label}
            custom={i}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={itemVariants}
            style={{
              flex: '1 1 240px',
              maxWidth: '280px',
              padding: 'clamp(1.5rem, 3vw, 2rem)',
              position: 'relative',
            }}
          >
            {/* Connector arrow (between items) */}
            {i < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 0.3 } : {}}
                transition={{ delay: 0.5 + i * 0.2, duration: 0.6 }}
                className="philosophy-arrow"
                style={{
                  position: 'absolute',
                  right: '-1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1.2rem',
                  color: 'var(--color-text-muted)',
                }}
              >
                →
              </motion.div>
            )}

            {/* Icon */}
            <div
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                marginBottom: 'clamp(0.8rem, 2vw, 1.2rem)',
              }}
            >
              {step.icon}
            </div>

            {/* Label */}
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(0.55rem, 1.3vw, 0.6rem)',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
                marginBottom: 'clamp(0.5rem, 1.5vw, 0.8rem)',
              }}
            >
              {step.label}
            </p>

            {/* Main text */}
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: 'clamp(0.5rem, 1.5vw, 0.8rem)',
                color: 'var(--color-text-primary)',
              }}
            >
              {step.main}
            </h3>

            {/* Description */}
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(0.78rem, 2vw, 0.85rem)',
                lineHeight: 1.6,
                color: 'var(--color-text-secondary)',
              }}
            >
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Bottom accent line */}
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: 'clamp(40px, 8vw, 80px)' } : {}}
        transition={{ duration: 1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          height: '2px',
          background: 'var(--color-accent)',
          marginTop: 'clamp(2rem, 5vw, 3.5rem)',
        }}
      />

      {/* Hide arrows on mobile (stack view) */}
      <style>{`
        @media (max-width: 768px) {
          .philosophy-arrow {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
