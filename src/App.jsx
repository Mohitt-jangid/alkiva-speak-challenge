import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './sections/Navbar';
import HeroSection from './sections/HeroSection';
import C2PronunciationSection from './sections/C2PronunciationSection';
import TongueTwisterSection from './sections/TongueTwisterSection';
import ImpromptuSpeechSection from './sections/ImpromptuSpeechSection';
import ConceptSection from './sections/ConceptSection';
import HowItWorksSection from './sections/HowItWorksSection';
import MissionSection from './sections/MissionSection';
import Footer from './sections/Footer';
import LowPolyBackground from './components/LowPolyBackground';

/**
 * App — Pure Pitch-Black Multi-View Router.
 */
export default function App() {
  const [activeView, setActiveView] = useState('hero');

  const renderActiveView = () => {
    switch (activeView) {
      case 'c2':
        return (
          <motion.div
            key="view-c2"
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <C2PronunciationSection />
          </motion.div>
        );
      case 'twisters':
        return (
          <motion.div
            key="view-twisters"
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <TongueTwisterSection />
          </motion.div>
        );
      case 'impromptu':
        return (
          <motion.div
            key="view-impromptu"
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <ImpromptuSpeechSection />
          </motion.div>
        );
      case 'concept':
        return (
          <motion.div
            key="view-concept"
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ paddingTop: 'var(--nav-height)' }}
          >
            <ConceptSection />
          </motion.div>
        );
      case 'how-it-works':
        return (
          <motion.div
            key="view-how-it-works"
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ paddingTop: 'var(--nav-height)' }}
          >
            <HowItWorksSection />
          </motion.div>
        );
      case 'mission':
        return (
          <motion.div
            key="view-mission"
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ paddingTop: 'var(--nav-height)' }}
          >
            <MissionSection />
          </motion.div>
        );
      case 'hero':
      default:
        return (
          <motion.div
            key="view-hero"
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <HeroSection />
          </motion.div>
        );
    }
  };

  return (
    <div style={{ background: '#000000', minHeight: '100vh', color: '#FFFFFF' }}>
      <LowPolyBackground />
      <Navbar activeView={activeView} onSelectView={(viewId) => setActiveView(viewId)} />
      <main style={{ position: 'relative', zIndex: 1, minHeight: 'calc(100vh - 120px)' }}>
        <AnimatePresence mode="wait">
          {renderActiveView()}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
