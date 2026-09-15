import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Navbar — Multi-View Navigation Switcher.
 */

export default function Navbar({ activeView = 'c2', onSelectView }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: "TODAY'S CHALLENGE", id: 'hero', icon: '🔥' },
    { label: 'C2 PRONUNCIATION', id: 'c2', icon: '⚡' },
    { label: 'PHONEME WORKOUT', id: 'twisters', icon: '👅' },
    { label: '60S IMPROMPTU', id: 'impromptu', icon: '⏱️' },
    { label: 'ABOUT CONCEPT', id: 'concept', icon: '💡' },
    { label: 'HOW IT WORKS', id: 'how-it-works', icon: '⚙️' },
    { label: 'DAILY MISSION', id: 'mission', icon: '🎯' },
  ];

  const handleNavClick = (id) => {
    setMobileOpen(false);
    if (onSelectView) {
      onSelectView(id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        className="navbar"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 'var(--nav-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--space-md)',
          zIndex: 1000,
          background: scrolled || mobileOpen
            ? 'rgba(0, 0, 0, 0.94)'
            : 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.85rem',
            fontWeight: 800,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}
          onClick={() => handleNavClick('hero')}
        >
          <span style={{ color: 'var(--color-prism-cyan, #00f2fe)', textShadow: '0 0 12px rgba(0, 242, 254, 0.5)' }}>
            TALKIVA
          </span>
          <span
            style={{
              fontSize: '0.6rem',
              padding: '0.2rem 0.5rem',
              background: 'rgba(0, 242, 254, 0.1)',
              border: '1px solid var(--color-prism-cyan, #00f2fe)',
              borderRadius: '4px',
              color: 'var(--color-prism-cyan, #00f2fe)',
              fontWeight: 700,
            }}
          >
            DARK SIDE
          </span>
        </div>

        {/* Desktop Navigation Switcher */}
        <div className="nav-links-desktop">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  position: 'relative',
                  background: isActive ? 'rgba(0, 242, 254, 0.12)' : 'transparent',
                  border: isActive ? '1px solid var(--color-prism-cyan)' : '1px solid transparent',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.65rem',
                  fontWeight: isActive ? 800 : 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  padding: '0.45rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.25s ease',
                  boxShadow: isActive ? '0 0 15px rgba(0, 242, 254, 0.25)' : 'none',
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeTabGlow"
                    style={{
                      position: 'absolute',
                      bottom: '-1px',
                      left: '10%',
                      right: '10%',
                      height: '2px',
                      background: 'var(--color-prism-cyan, #00f2fe)',
                      borderRadius: '2px',
                      boxShadow: '0 0 8px #00f2fe',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: mobileOpen ? '0' : '5px',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            position: 'relative',
          }}
        >
          <motion.span animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 0 : -3 }} style={{ display: 'block', width: '18px', height: '1.5px', background: '#FFFFFF', position: mobileOpen ? 'absolute' : 'relative' }} />
          <motion.span animate={{ opacity: mobileOpen ? 0 : 1 }} style={{ display: 'block', width: '18px', height: '1.5px', background: '#FFFFFF' }} />
          <motion.span animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? 0 : 3 }} style={{ display: 'block', width: '18px', height: '1.5px', background: '#FFFFFF', position: mobileOpen ? 'absolute' : 'relative' }} />
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 'var(--nav-height)',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
              background: 'rgba(0, 0, 0, 0.96)',
              backdropFilter: 'blur(30px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.2rem',
              overflowY: 'auto',
              padding: '2rem 1rem',
            }}
          >
            {navItems.map((item, i) => {
              const isActive = activeView === item.id;
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    background: isActive ? 'rgba(0, 242, 254, 0.15)' : 'none',
                    border: isActive ? '1px solid #00f2fe' : 'none',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: isActive ? '#00f2fe' : '#FFFFFF',
                    cursor: 'pointer',
                    padding: '0.7rem 1.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    width: '100%',
                    maxWidth: '300px',
                    justifyContent: 'center',
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nav-links-desktop {
          display: flex;
          gap: 0.4rem;
          align-items: center;
        }
        .nav-hamburger {
          display: none !important;
        }
        @media (max-width: 1080px) {
          .nav-links-desktop {
            display: none !important;
          }
          .nav-hamburger {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
