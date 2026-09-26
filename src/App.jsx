import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Navbar from './sections/Navbar';
import HeroSection from './sections/HeroSection';
import InstagramChallengeSection from './sections/InstagramChallengeSection';
import Challenge100Main from './components/Challenge100/Challenge100Main';
import GroupChatDrawer from './components/GroupChat/GroupChatDrawer';
import ProfileModal from './components/Profile/ProfileModal';
import Footer from './sections/Footer';
import LowPolyBackground from './components/LowPolyBackground';

/**
 * AppContent — Main logged in application view.
 */
function AppContent() {
  const { currentUser, isLoading } = useAuth();
  const [activeView, setActiveView] = useState('hero'); // 'hero' | 'challenge100' | 'instagram'
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Sync unread messages
  useEffect(() => {
    if (!currentUser) return;

    const keyLastRead = 'talkiva_last_read_' + currentUser.id;

    const computeUnread = () => {
      try {
        const storedMsgs = JSON.parse(localStorage.getItem('talkiva_group_chat_messages') || '[]');
        const lastReadId = localStorage.getItem(keyLastRead);

        if (!lastReadId) {
          if (storedMsgs.length > 0) {
            localStorage.setItem(keyLastRead, storedMsgs[storedMsgs.length - 1].id);
          }
          setUnreadCount(0);
          return;
        }

        const lastIdx = storedMsgs.findIndex((m) => m.id === lastReadId);
        if (lastIdx === -1) {
          setUnreadCount(0);
          return;
        }

        const unreadMsgs = storedMsgs.slice(lastIdx + 1).filter(
          (m) => m.senderId?.toLowerCase() !== currentUser.id.toLowerCase()
        );
        setUnreadCount(unreadMsgs.length);
      } catch (e) {
        console.error('Error computing unread count:', e);
      }
    };

    computeUnread();

    let channel;
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel('talkiva_group_chat_channel');
      channel.onmessage = (e) => {
        if (e.data?.type === 'NEW_MESSAGE') {
          if (isChatOpen) {
            const newMsg = e.data.payload;
            if (newMsg?.id) {
              localStorage.setItem(keyLastRead, newMsg.id);
            }
            setUnreadCount(0);
          } else {
            computeUnread();
          }
        } else if (e.data?.type === 'DELETE_MESSAGE') {
          computeUnread();
        }
      };
    }

    const handleStorage = (e) => {
      if (e.key === 'talkiva_group_chat_messages' && !isChatOpen) {
        computeUnread();
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      if (channel) channel.close();
    };
  }, [currentUser, isChatOpen]);

  const handleOpenChat = () => {
    setIsChatOpen(true);
    setUnreadCount(0);
    if (currentUser) {
      try {
        const storedMsgs = JSON.parse(localStorage.getItem('talkiva_group_chat_messages') || '[]');
        if (storedMsgs.length > 0) {
          localStorage.setItem('talkiva_last_read_' + currentUser.id, storedMsgs[storedMsgs.length - 1].id);
        }
      } catch (e) {
        console.error('Error updating last read state:', e);
      }
    }
  };

  const handleNavigateSection = (sectionId) => {
    if (sectionId === 'daily-drop' || sectionId === 'instagram') {
      setActiveView('instagram');
    } else if (activeView !== 'hero') {
      setActiveView('hero');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Show nothing while restoring session
  if (isLoading) return null;

  // Gate: show login if not authenticated
  if (!currentUser) {
    return <LoginPage />;
  }

  const isMohit = currentUser?.id?.toLowerCase() === 'mohit';

  return (
    <div style={{ minHeight: '100vh', color: '#FFFFFF', position: 'relative', background: '#07080B' }}>
      <LowPolyBackground />

      <Navbar
        onNavigateSection={handleNavigateSection}
        onOpenChallenge={() => isMohit && setActiveView('challenge100')}
        onOpenInstagram={() => setActiveView('instagram')}
        onOpenChat={handleOpenChat}
        onOpenProfile={() => setIsProfileOpen(true)}
        unreadCount={unreadCount}
      />

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
          ) : activeView === 'instagram' ? (
            <motion.div
              key="view-instagram"
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <InstagramChallengeSection onBackToHome={() => setActiveView('hero')} />
            </motion.div>
          ) : (
            <motion.div
              key="view-hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* HERO SECTION */}
              <HeroSection
                onOpenChallenge={() => isMohit && setActiveView('challenge100')}
                onOpenInstagram={() => setActiveView('instagram')}
                onOpenChat={handleOpenChat}
                onOpenProfile={() => setIsProfileOpen(true)}
                unreadCount={unreadCount}
              />

              {/* DAILY DROP SECTION */}
              <InstagramChallengeSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <GroupChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

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
