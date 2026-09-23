import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import HeroSection from './sections/HeroSection';
import Challenge100Main from './components/Challenge100/Challenge100Main';
import Footer from './sections/Footer';
import LowPolyBackground from './components/LowPolyBackground';

/**
 * AppContent — Main logged in application view.
 */
function AppContent() {
  const { currentUser, isLoading } = useAuth();
  const [activeView, setActiveView] = useState('hero'); // 'hero' | 'challenge100'

  // Show nothing while restoring session
  if (isLoading) return null;

  // Gate: show login if not authenticated
  if (!currentUser) {
    return <LoginPage />;
  }

  const isMohit = currentUser?.id?.toLowerCase() === 'mohit';

  return (
    <div style={{ minHeight: '100vh', color: '#FFFFFF', position: 'relative' }}>
      <LowPolyBackground />

      <main style={{ position: 'relative', zIndex: 1, minHeight: 'calc(100vh - 120px)' }}>
        <AnimatePresence mode="wait">
          {activeView === 'challenge100' && isMohit ? (
            <motion.div
              key="view-challenge100"
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Challenge100Main onBackToHome={() => setActiveView('hero')} />
            </motion.div>
          ) : (
            <motion.div
              key="view-hero"
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <HeroSection onOpenChallenge={() => isMohit && setActiveView('challenge100')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

/**
 * App — Root wrapper with AuthProvider.
 */
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
