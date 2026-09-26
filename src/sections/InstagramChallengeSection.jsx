import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  fetchInstagramOverview,
  submitInstagramLinkApi,
  fetchUserInstagramHistory
} from '../services/instagramService';
import './InstagramChallengeSection.css';

const DEFAULT_USER_METADATA = {
  Mohit: { name: 'Mohit Jangid', role: 'Challenger', color: '#6366F1', avatarBg: '#1F232E' },
  Aashish: { name: 'Aashish', role: 'Challenger', color: '#10B981', avatarBg: '#1F232E' },
  Ajay: { name: 'Ajay Choudhary', role: 'Challenger', color: '#F59E0B', avatarBg: '#1F232E' }
};

export default function InstagramChallengeSection({ onBackToHome }) {
  const { currentUser, usersList: authUsersList } = useAuth();

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [linkInput, setLinkInput] = useState('');
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error' | 'warning', text: '' }

  const [selectedUserHistory, setSelectedUserHistory] = useState(currentUser?.id || 'Mohit');
  const [userHistoryList, setUserHistoryList] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Derive dynamic users list from backend overview and auth context
  const dynamicUsers = React.useMemo(() => {
    const keysFromOverview = overview ? Object.keys(overview) : [];
    const keysFromAuth = (authUsersList || []).map((u) => u.id);
    const combined = Array.from(new Set([...keysFromAuth, ...keysFromOverview]));
    return combined.length > 0 ? combined : ['Mohit', 'Aashish', 'Ajay'];
  }, [overview, authUsersList]);

  // Load backend database overview
  const loadOverview = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchInstagramOverview();
      setOverview(data);
    } catch (err) {
      console.error('Failed to load Instagram overview:', err);
      setFeedback({
        type: 'error',
        text: 'Failed to connect to backend database. Please ensure dev server is running.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Load history for selected user tab
  const loadHistory = useCallback(async (userId) => {
    try {
      setHistoryLoading(true);
      const list = await fetchUserInstagramHistory(userId);
      setUserHistoryList(list);
    } catch (err) {
      console.error('Failed to load history:', err);
      setUserHistoryList([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  useEffect(() => {
    if (selectedUserHistory) {
      loadHistory(selectedUserHistory);
    }
  }, [selectedUserHistory, loadHistory]);

  const activeUserId = currentUser?.id || 'Mohit';
  const currentUserData = overview ? overview[activeUserId] : null;
  const hasSubmittedToday = currentUserData?.hasSubmittedToday || false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!linkInput.trim()) {
      setFeedback({
        type: 'error',
        text: 'Please paste a valid Instagram post or reel link.'
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await submitInstagramLinkApi(activeUserId, linkInput.trim());

      if (res.success) {
        setFeedback({
          type: 'success',
          text: res.message || 'Link submitted successfully! Streak updated.'
        });
        setLinkInput('');
        // Refresh backend overview data
        const freshOverview = await fetchInstagramOverview();
        setOverview(freshOverview);
        // Refresh history
        if (selectedUserHistory === activeUserId) {
          loadHistory(activeUserId);
        }
      } else {
        setFeedback({
          type: 'error',
          text: res.error || 'Submission rejected by database rules.'
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.message || 'An unexpected error occurred during submission.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="ig-challenge-section" id="instagram-challenge">
      <div className="ig-challenge-container">
        
        {/* Top Header */}
        <div className="ig-challenge-header">
          {onBackToHome && (
            <button className="ig-back-btn" onClick={onBackToHome}>
              ← Back to Dashboard
            </button>
          )}
          <h1 className="ig-challenge-title">
            Daily <span className="ig-title-gradient">Drop</span>
          </h1>
        </div>

        {/* Dynamic Users Streaks Overview Grid */}
        <div className="ig-streaks-grid">
          {dynamicUsers.map((userId) => {
            const userData = overview ? overview[userId] : null;
            const authUser = (authUsersList || []).find((u) => u.id.toLowerCase() === userId.toLowerCase());
            const meta = DEFAULT_USER_METADATA[userId] || { name: userId, role: 'Challenger', color: '#6366F1', avatarBg: '#1F232E' };
            const displayName = authUser?.name || meta.name;
            const isSelf = userId.toLowerCase() === activeUserId.toLowerCase();
            const streak = userData ? userData.streak : 0;
            const submittedToday = userData ? userData.hasSubmittedToday : false;

            return (
              <motion.div
                key={userId}
                className={`ig-user-card ${isSelf ? 'ig-user-card--self' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {isSelf && <div className="ig-self-badge">YOU (LOGGED IN)</div>}
                
                <div className="ig-user-avatar-wrap">
                  <div
                    className="ig-user-avatar"
                    style={{ background: meta.avatarBg }}
                  >
                    {displayName[0]}
                  </div>
                  <div className="ig-user-info">
                    <h3 className="ig-user-name">{displayName}</h3>
                    <span className="ig-user-role">{meta.role}</span>
                  </div>
                </div>

                <div className="ig-streak-box">
                  <div className="ig-streak-val">
                    <span className="ig-streak-number">{streak}</span>
                    <span className="ig-streak-label">Day Streak</span>
                  </div>
                </div>

                <div className="ig-card-footer">
                  <div className={`ig-status-pill ${submittedToday ? 'ig-status-pill--done' : 'ig-status-pill--pending'}`}>
                    {submittedToday ? '✓ Submitted Today' : '⚡ Pending Today'}
                  </div>
                  <div className="ig-total-sub">
                    {userData ? userData.totalSubmissions : 0} total posts
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Submission Form Glass Card */}
        <div className="ig-submit-card">
          <div className="ig-card-title-row">
            <h2>Daily Link Submission ({activeUserId})</h2>
            <div className="ig-date-badge">
              CALENDAR DAY: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="ig-form">
            <div className="ig-input-group">
              <span className="ig-input-icon">⚡</span>
              <input
                type="url"
                className="ig-input"
                placeholder="https://www.instagram.com/reel/C..."
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                disabled={hasSubmittedToday || submitting}
                required
              />
              <button
                type="submit"
                className={`ig-submit-btn ${hasSubmittedToday ? 'ig-submit-btn--done' : ''}`}
                disabled={hasSubmittedToday || submitting}
              >
                {submitting ? (
                  <span>Verifying DB...</span>
                ) : hasSubmittedToday ? (
                  <span>Submitted Today ✓</span>
                ) : (
                  <span>Submit Link →</span>
                )}
              </button>
            </div>
          </form>

          {/* Feedback Messages */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`ig-feedback ig-feedback--${feedback.type}`}
              >
                {feedback.type === 'success' && '✓ '}
                {feedback.type === 'error' && '⚡ '}
                {feedback.type === 'warning' && '! '}
                {feedback.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Permanent Submissions Database History */}
        <div className="ig-history-card">
          <div className="ig-history-header">
            <div>
              <h2>Permanent Database Submissions Log</h2>
              <p>Check submitted links and dates for all users permanently saved in DB.</p>
            </div>
          </div>

          {/* User Tabs */}
          <div className="ig-tabs-row">
            {dynamicUsers.map((uId) => (
              <button
                key={uId}
                className={`ig-tab-btn ${selectedUserHistory === uId ? 'ig-tab-btn--active' : ''}`}
                onClick={() => setSelectedUserHistory(uId)}
              >
                {uId}'s Links ({overview?.[uId]?.totalSubmissions || 0})
              </button>
            ))}
          </div>

          {/* History List */}
          <div className="ig-history-content">
            {historyLoading ? (
              <div className="ig-history-empty">Loading history from database...</div>
            ) : userHistoryList.length === 0 ? (
              <div className="ig-history-empty">No submissions logged for {selectedUserHistory} yet.</div>
            ) : (
              <div className="ig-history-table">
                {userHistoryList.map((item, idx) => (
                  <div key={item.id || idx} className="ig-history-row">
                    <div className="ig-history-num">#{userHistoryList.length - idx}</div>
                    <div className="ig-history-date">
                      <span className="ig-date-tag">{item.date}</span>
                      <span className="ig-time-tag">
                        {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <div className="ig-history-link">
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        {item.link} ↗
                      </a>
                    </div>
                    <div className="ig-history-badge">
                      Verified DB Link
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
