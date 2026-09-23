import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * MotivationalHero — Simple idle cycling of motivational phrases.
 * Purely decorative — no spin or reveal logic.
 * Updated to use the new navy/indigo/violet design system.
 */

const PHRASES = [
  { top: 'SPEAK', main: 'Fearlessly', bottom: 'Your voice matters more than perfection.' },
  { top: 'THINK', main: 'Deeply', bottom: 'Every great speaker was once a beginner.' },
  { top: 'GROW', main: 'Daily', bottom: 'Comfort zones are where dreams go to sleep.' },
  { top: 'START', main: 'Now', bottom: 'The best time to begin was yesterday.' },
  { top: 'EMBRACE', main: 'Mistakes', bottom: 'Failure is the tuition fee of success.' },
];

const mainWordVariants = {
  enter: { opacity: 0, y: 60, scale: 0.85, filter: 'blur(10px)' },
  center: {
    opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0, y: -50, scale: 1.1, filter: 'blur(8px)',
    transition: { duration: 0.6, ease: [0.7, 0, 0.84, 0] },
  },
};

const topVariants = {
  enter: { opacity: 0, x: -20 },
  center: { opacity: 1, x: 0, transition: { duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, x: 15, transition: { duration: 0.3 } },
};

const bottomVariants = {
  enter: { opacity: 0, y: 15 },
  center: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

export default function MotivationalHero() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((prev) => (prev + 1) % PHRASES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const phrase = PHRASES[idx];

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(0.8rem, 3vw, 2rem)',
        minHeight: 'clamp(160px, 30vw, 240px)',
        overflow: 'hidden',
      }}
    >
      {/* Decorative rings */}
      <div style={{ position: 'absolute', width: 'clamp(160px, 50vw, 280px)', height: 'clamp(160px, 50vw, 280px)', borderRadius: '50%', border: '1px solid rgba(196, 181, 253, 0.08)', opacity: 0.5 }} />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', width: 'clamp(130px, 40vw, 230px)', height: 'clamp(130px, 40vw, 230px)', borderRadius: '50%', border: '1px dashed rgba(79, 70, 229, 0.15)', opacity: 0.3 }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', width: 'clamp(200px, 60vw, 340px)', height: 'clamp(200px, 60vw, 340px)', borderRadius: '50%', border: '1px solid rgba(124, 58, 237, 0.06)', opacity: 0.2 }}
      />

      {/* Floating dots */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -12, 0], opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
          style={{
            position: 'absolute', width: 3 + i, height: 3 + i, borderRadius: '50%',
            background: i % 2 === 0 ? 'var(--t-electric, #4F46E5)' : 'var(--t-lavender, #C4B5FD)',
            top: `${25 + Math.sin(i * 1.5) * 25}%`, left: `${20 + i * 17}%`,
          }}
        />
      ))}

      {/* Text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(0.3rem, 1.5vw, 0.6rem)', position: 'relative', zIndex: 2 }}
        >
          <motion.span variants={topVariants} initial="enter" animate="center" exit="exit"
            style={{ fontFamily: 'var(--t-font-body)', fontSize: 'clamp(0.55rem, 1.5vw, 0.7rem)', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--t-lavender, #C4B5FD)' }}
          >{phrase.top}</motion.span>

          <motion.span variants={mainWordVariants} initial="enter" animate="center" exit="exit"
            style={{
              fontFamily: 'var(--t-font-heading)', fontSize: 'clamp(2.4rem, 10vw, 5rem)', fontWeight: 800, fontStyle: 'italic', lineHeight: 1,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #F8FAFC 0%, #7C3AED 60%, #22D3EE 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}
          >{phrase.main}</motion.span>

          <motion.span variants={bottomVariants} initial="enter" animate="center" exit="exit"
            style={{ fontFamily: 'var(--t-font-body)', fontSize: 'clamp(0.7rem, 2vw, 0.85rem)', color: 'var(--t-text-secondary, #CBD5E1)', textAlign: 'center', maxWidth: '350px', lineHeight: 1.5, padding: '0 var(--t-space-xs)' }}
          >{phrase.bottom}</motion.span>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '6px', marginTop: 'clamp(0.8rem, 2vw, 1rem)', position: 'relative', zIndex: 2 }}>
        {PHRASES.map((_, i) => (
          <motion.div
            key={i}
            animate={{ width: i === idx ? 20 : 5, background: i === idx ? 'var(--t-electric, #4F46E5)' : 'rgba(196, 181, 253, 0.2)' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: 5, borderRadius: 3 }}
          />
        ))}
      </div>
    </div>
  );
}
