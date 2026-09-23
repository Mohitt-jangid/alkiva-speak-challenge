import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MotivationalHero from '../components/MotivationalHero';
import Challenge100Card from '../components/Challenge100/Challenge100Card';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import { getDailyTopic, formatDisplayDate } from '../utils/dailyTopic';
import './HeroSection.css';

/**
 * HeroSection — Single Page Glass Frame Landing
 * Clean frosted glass container.
 * Shows Today's Challenge from the 21 curated topics (1 per day).
 */

const textVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: 0.2 + i * 0.1,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function HeroSection({ onOpenChallenge }) {
  const { currentUser } = useAuth();
  const [revealed, setRevealed] = useState(false);
  const { topic, category, prompt, id } = getDailyTopic();
  const displayDate = formatDisplayDate();

  const isMohit = currentUser?.id?.toLowerCase() === 'mohit';

  const handleDiscover = useCallback(() => {
    if (revealed) return;
    setRevealed(true);
  }, [revealed]);

  const handleReset = useCallback(() => {
    setRevealed(false);
  }, []);

  return (
    <section id="hero" className="hero-section">
      {/* Outer Main Glass Frame Container */}
      <div className="hero-frame">
        {/* Navbar inside top of frame */}
        <Navbar onOpenChallenge={onOpenChallenge} />

        <AnimatePresence mode="wait">
          {revealed ? (
            /* ── Revealed Topic View ───────────────────── */
            <motion.div
              key="revealed-view"
              className="hero-revealed"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.span
                className="hero-revealed__date"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {category?.toUpperCase()} • TOPIC #{id} — {displayDate}
              </motion.span>

              <motion.h2
                className="hero-revealed__topic"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                {topic}
              </motion.h2>

              <motion.div
                className="hero-revealed__line"
                initial={{ width: 0 }}
                animate={{ width: 80 }}
                transition={{ delay: 0.25 }}
              />

              <motion.p
                className="hero-revealed__quote"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{ fontStyle: 'normal', fontSize: '0.95rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.92)' }}
              >
                💡 <strong>Speaking Prompt:</strong> {prompt}
              </motion.p>

              <motion.span
                className="hero-revealed__meta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                Suggested practice duration: 3–5 minutes
              </motion.span>

              <motion.div
                className="hero-revealed__actions"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <button
                  className="hero-pill-btn hero-pill-btn--solid"
                  onClick={handleReset}
                >
                  ← BACK TO OVERVIEW
                </button>
              </motion.div>
            </motion.div>
          ) : (
            /* ── Single Page Hero View ─────────── */
            <motion.div
              key="hero-view"
              className="hero-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Background Watermark Text "TALKIVA" */}
              <div className="hero-watermark">TALKIVA</div>

              {/* Left Column: Eyebrow + Headline + Carousel Dots + Social Links */}
              <div className="hero-left">
                <motion.div
                  className="hero-eyebrow-container"
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                >
                  <span className="hero-eyebrow-text">Daily challenge <strong>{displayDate}</strong></span>
                  <div className="hero-eyebrow-line" />
                </motion.div>

                <motion.h1
                  className="hero-title"
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                >
                  Beginners
                  <br />
                  Guide to
                  <br />
                  <span className="hero-title__highlight">English fluency</span>
                </motion.h1>

                <motion.div
                  className="hero-motivational-wrap"
                  custom={1.5}
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                >
                  <MotivationalHero />
                </motion.div>

                {/* Dots indicator */}
                <motion.div
                  className="hero-dots-row"
                  custom={2}
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                >
                  <span className="hero-dot hero-dot--active" />
                  <span className="hero-dot" />
                  <span className="hero-dot" />
                  <span className="hero-dot" />
                  <span className="hero-dot" />
                </motion.div>

                {/* Bottom Left Social Links */}
                <motion.div
                  className="hero-social-links"
                  custom={3}
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                >
                  <span>FB</span>
                  <span>TW</span>
                  <span>IG</span>
                  <span>IN</span>
                </motion.div>
              </div>

              {/* Right Column: Avatars + Description + CTA Pill Button + Private Card if mohit */}
              <div className="hero-right">
                <motion.div
                  className="hero-avatars"
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                >
                  <div className="hero-avatar hero-avatar--1">👤</div>
                  <div className="hero-avatar hero-avatar--2">👩‍💼</div>
                  <div className="hero-avatar hero-avatar--3">👨‍🎓</div>
                </motion.div>

                <motion.p
                  className="hero-description"
                  custom={2}
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                >
                  <strong>Talkiva</strong> is a modern communication platform designed to help you improve English speaking, confidence, pronunciation, and fluency daily.
                </motion.p>

                <motion.div
                  className="hero-cta-wrap"
                  custom={3}
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                >
                  <button className="hero-pill-btn hero-pill-btn--outline" onClick={handleDiscover}>
                    Get started
                  </button>
                </motion.div>

                {/* PRIVATE FEATURE CARD — MOHIT ONLY */}
                {isMohit && (
                  <Challenge100Card onOpenChallenge={onOpenChallenge} />
                )}

                {/* Subtle caption text at bottom right */}
                <div className="hero-right-caption" style={{ marginTop: '1.2rem' }}>
                  Daily speaking missions • Interactive audio practice
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
