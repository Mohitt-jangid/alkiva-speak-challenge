import React from 'react';
import { motion } from 'framer-motion';

/**
 * Footer — Minimal, editorial-style footer.
 */
export default function Footer() {
  return (
    <footer
      style={{
        padding: 'var(--space-3xl) var(--space-xl)',
        borderTop: '1px solid var(--color-border)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-md)',
        }}
      >
        {/* Logo */}
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-text-primary)',
          }}
        >
          TALKIVA
        </p>

        {/* Tagline */}
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1rem',
            fontStyle: 'italic',
            color: 'var(--color-text-muted)',
          }}
        >
          One topic. Every day. No excuses.
        </p>

        {/* Divider */}
        <div
          style={{
            width: '40px',
            height: '1px',
            background: 'var(--color-accent)',
            margin: 'var(--space-sm) 0',
          }}
        />

        {/* Copyright */}
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            color: 'var(--color-text-muted)',
          }}
        >
          © {new Date().getFullYear()} TALKIVA
        </p>
      </div>
    </footer>
  );
}
