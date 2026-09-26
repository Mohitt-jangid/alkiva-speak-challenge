import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

/**
 * LoginPage — Premium glassmorphism login gate.
 * Only 3 hardcoded users. No sign-up.
 */
export default function LoginPage() {
  const { login } = useAuth();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!userId.trim() || !password.trim()) {
      setError('Please enter both User ID and Password');
      triggerShake();
      return;
    }

    const result = login(userId, password);
    if (!result.success) {
      setError(result.message);
      triggerShake();
    } else {
      setSuccess(true);
    }
  };

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  };

  return (
    <AnimatePresence>
      {!success && (
        <motion.div
          className="login-page"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Animated background */}
          <div className="login-bg" />
          <div className="login-grid-lines" />
          <div className="login-orb login-orb--cyan" />
          <div className="login-orb login-orb--magenta" />
          <div className="login-orb login-orb--violet" />

          {/* Login Card */}
          <motion.div
            className={`login-card ${shaking ? 'login-card--shake' : ''}`}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="login-header">
              <div className="login-logo">TALKIVA</div>
              <div className="login-subtitle">100 Days Challenge • Authorized Access</div>
            </div>

            {/* Form */}
            <form className="login-form" onSubmit={handleSubmit}>
              {/* User ID */}
              <div className="login-input-group">
                <label className="login-input-label" htmlFor="login-userid">
                  User ID
                </label>
                <div className="login-input-wrapper">
                  <span className="login-input-icon">👤</span>
                  <input
                    id="login-userid"
                    className="login-input"
                    type="text"
                    placeholder="Enter your User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    autoComplete="username"
                    autoFocus
                  />
                </div>
              </div>

              {/* Password */}
              <div className="login-input-group">
                <label className="login-input-label" htmlFor="login-password">
                  Password
                </label>
                <div className="login-input-wrapper">
                  <span className="login-input-icon">🔒</span>
                  <input
                    id="login-password"
                    className="login-input"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    style={{ paddingRight: '3rem' }}
                  />
                  <button
                    type="button"
                    className="login-pw-toggle"
                    onClick={() => setShowPw(!showPw)}
                    tabIndex={-1}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="login-error"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    ⚠️ {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                className="login-submit-btn"
                whileTap={{ scale: 0.98 }}
              >
                Enter Challenge →
              </motion.button>
            </form>

            {/* Footer */}
            <div className="login-users-hint">
              Authorized personnel only • <span>Secure Access Protocol</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
