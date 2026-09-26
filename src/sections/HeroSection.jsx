import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MotivationalHero from '../components/MotivationalHero';
import Challenge100Card from '../components/Challenge100/Challenge100Card';
import InstagramChallengeCard from '../components/InstagramChallengeCard';
import { useAuth } from '../context/AuthContext';
import { getDailyTopic, formatDisplayDate } from '../utils/dailyTopic';
import './HeroSection.css';

/**
 * HeroSection — Dark Cinematic Technology Landing
 * Visual reference composition: Large confident headline, 3D centerpiece with orbital rings, technical metadata.
 */

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.15 + i * 0.1,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function HeroSection({ onOpenChallenge, onOpenInstagram, onOpenChat, onOpenProfile, unreadCount }) {
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

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="hero-tech-section">
      {/* Outer Technical Container */}
      <div className="hero-tech-container">
        
        <AnimatePresence mode="wait">
          {revealed ? (
            /* ── Revealed Daily Topic View ───────────────────── */
            <motion.div
              key="revealed-view"
              className="hero-revealed-panel"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="hero-revealed__meta">
                <span className="tech-eyebrow">{category?.toUpperCase()}</span>
                <span className="tech-index-tag">// TOPIC #{id} — {displayDate}</span>
              </div>

              <h2 className="hero-revealed__topic">{topic}</h2>

              <div className="hero-revealed__prompt-box">
                <div className="prompt-box-header">💡 SPEAKING PROMPT PROTOCOL</div>
                <p className="prompt-box-body">{prompt}</p>
              </div>

              <div className="hero-revealed__actions">
                <button
                  className="tech-btn-primary"
                  onClick={() => onOpenInstagram && onOpenInstagram()}
                >
                  Start Practice Mission →
                </button>
                <button
                  className="tech-btn-outline"
                  onClick={handleReset}
                >
                  ← Back to Overview
                </button>
              </div>
            </motion.div>
          ) : (
            /* ── Main Single-Page Hero View (Asymmetric Technical Layout) ── */
            <motion.div
              key="hero-view"
              className="hero-tech-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Corner Technical Bracket Markers */}
              <div className="tech-corner tech-corner--tl">+</div>
              <div className="tech-corner tech-corner--tr">+</div>
              <div className="tech-corner tech-corner--bl">+</div>
              <div className="tech-corner tech-corner--br">+</div>

              {/* Left Column: Eyebrow + Huge Headline + Copy + CTAs */}
              <div className="hero-left-column">
                <motion.div
                  className="tech-eyebrow-wrap"
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                >
                  <span className="tech-eyebrow">COMMUNICATION • FLUENCY • CONFIDENCE</span>
                  <span className="tech-date-tag">[{displayDate}]</span>
                </motion.div>

                <motion.h1
                  className="hero-main-headline"
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                >
                  Speak with clarity.
                  <br />
                  <span className="hero-headline-accent">Think without hesitation.</span>
                </motion.h1>

                <motion.p
                  className="hero-main-subtext"
                  custom={2}
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                >
                  Talkiva is an advanced communication & English mastery engine designed to build daily articulation, active vocabulary, and analytical speaking confidence.
                </motion.p>

                <motion.div
                  className="hero-actions-row"
                  custom={3}
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                >
                  <button className="tech-btn-primary" onClick={handleDiscover}>
                    Start Practicing <span className="btn-arrow">→</span>
                  </button>
                  <button className="tech-btn-outline" onClick={() => onOpenInstagram && onOpenInstagram()}>
                    Explore Talkiva
                  </button>
                </motion.div>

                {/* Technical Telemetry Badges */}
                <motion.div
                  className="hero-telemetry-row"
                  custom={4}
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                >
                  <div className="telemetry-item">
                    <span className="telemetry-label">SYSTEM</span>
                    <span className="telemetry-value">ONLINE // ACTIVE</span>
                  </div>
                  <div className="telemetry-divider">/</div>
                  <div className="telemetry-item">
                    <span className="telemetry-label">PROTOCOL</span>
                    <span className="telemetry-value">DAILY DISCOVERY</span>
                  </div>
                  <div className="telemetry-divider">/</div>
                  <div className="telemetry-item">
                    <span className="telemetry-label">MODULATION</span>
                    <span className="telemetry-value">AUDIO ENGAGED</span>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: 3D Centerpiece Artwork & Feature Cards */}
              <div className="hero-right-column">
                <div className="hero-3d-wrapper">
                  {/* Atmospheric Glow behind 3D render */}
                  <div className="hero-3d-glow" />
                  
                  {/* High Quality 3D Render Image */}
                  <img
                    src="/images/hero_3d.jpg"
                    alt="Talkiva 3D Communication Core"
                    className="hero-3d-image"
                  />

                  {/* Overlay Technical Graphics */}
                  <div className="hero-3d-hud">
                    <div className="hud-line" />
                    <span className="hud-badge">3D SOUND CORE v2.4</span>
                  </div>
                </div>

                {/* Integrated Feature Cards */}
                <div className="hero-cards-wrapper">
                  <InstagramChallengeCard onOpenInstagram={onOpenInstagram} />
                  {isMohit && (
                    <Challenge100Card onOpenChallenge={onOpenChallenge} />
                  )}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
