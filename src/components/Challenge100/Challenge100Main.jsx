import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Challenge100Checklist from './Challenge100Checklist';
import Challenge100Session from './Challenge100Session';
import Challenge100CoachPanel from './Challenge100CoachPanel';
import Challenge100Completion from './Challenge100Completion';
import { getChallenge100Stats, getChallenge100State } from '../../utils/challenge100Storage';

/**
 * Challenge100Main — Main Private Feature View.
 * Restricted strictly to user ID = 'mohit'.
 */
export default function Challenge100Main({ onBackToHome }) {
  const { currentUser } = useAuth();
  const stats = getChallenge100Stats();
  const state = getChallenge100State();

  const [activeTab, setActiveTab] = useState('checklist'); // 'checklist' | 'session' | 'coach'
  const [selectedDayNum, setSelectedDayNum] = useState(stats.currentUnlockedDay);

  // STRICT ACCESS CONTROL GATE
  const isMohit = currentUser?.id?.toLowerCase() === 'mohit';

  if (!isMohit) {
    // Unauthorized access attempt — redirect immediately to normal dashboard
    if (onBackToHome) onBackToHome();
    return null;
  }

  const handleSelectDay = (dNum) => {
    setSelectedDayNum(dNum);
    setActiveTab('session');
  };

  // Check if Day 100 is completed & verified
  const day100Verified = state.days[100]?.status === 'VERIFIED';

  return (
    <div style={{ position: 'relative', zIndex: 2, paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      {/* Top Header Controls Bar */}
      <div style={{ maxWidth: '1100px', margin: '0 auto 1.5rem', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <button
          onClick={onBackToHome}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1.5px solid rgba(255, 255, 255, 0.35)',
            borderRadius: '9999px',
            color: '#FFFFFF',
            padding: '0.45rem 1.2rem',
            fontFamily: 'var(--t-font-body)',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          ← Back to Main Dashboard
        </button>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.1)', padding: '4px', borderRadius: '9999px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <button
            onClick={() => setActiveTab('checklist')}
            style={{
              background: activeTab === 'checklist' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'checklist' ? '#2D1B69' : '#FFFFFF',
              border: 'none', borderRadius: '9999px',
              padding: '0.45rem 1.1rem', fontSize: '0.78rem', fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.3s ease',
            }}
          >
            📋 100-Day Checklist
          </button>
          <button
            onClick={() => setActiveTab('session')}
            style={{
              background: activeTab === 'session' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'session' ? '#2D1B69' : '#FFFFFF',
              border: 'none', borderRadius: '9999px',
              padding: '0.45rem 1.1rem', fontSize: '0.78rem', fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.3s ease',
            }}
          >
            🏋️ Day {selectedDayNum} Session
          </button>
          <button
            onClick={() => setActiveTab('coach')}
            style={{
              background: activeTab === 'coach' ? '#8B5CF6' : 'transparent',
              color: '#FFFFFF',
              border: 'none', borderRadius: '9999px',
              padding: '0.45rem 1.1rem', fontSize: '0.78rem', fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.3s ease',
            }}
          >
            🛡️ Coach Verification
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {day100Verified && selectedDayNum === 100 && activeTab === 'session' ? (
        <Challenge100Completion onBackToChecklist={() => setActiveTab('checklist')} />
      ) : activeTab === 'coach' ? (
        <Challenge100CoachPanel initialDay={selectedDayNum} onClose={() => setActiveTab('checklist')} />
      ) : activeTab === 'session' ? (
        <Challenge100Session
          dayNum={selectedDayNum}
          onBackToChecklist={() => setActiveTab('checklist')}
          onOpenCoachReview={() => setActiveTab('coach')}
        />
      ) : (
        <Challenge100Checklist onSelectDay={handleSelectDay} />
      )}
    </div>
  );
}
