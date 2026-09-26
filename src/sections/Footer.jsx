import React from 'react';

/**
 * Footer — Minimal, technical product footer (DRN OS aesthetic)
 */
export default function Footer() {
  return (
    <footer
      style={{
        padding: '3rem 2rem 4rem 2rem',
        background: '#040507',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#636A7A',
        fontFamily: 'var(--t-font-body)',
        fontSize: '0.82rem',
      }}
    >
      <div
        style={{
          maxWidth: '1300px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#FFFFFF', fontWeight: 800, fontFamily: 'var(--t-font-heading)', letterSpacing: '0.12em' }}>
            <span style={{ color: '#FF5500' }}>❖</span>
            <span>TALKIVA</span>
            <span style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: '#636A7A', paddingLeft: '0.5rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
              COMMUNICATION TECHNOLOGY
            </span>
          </div>

          {/* System Telemetry Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', fontFamily: 'monospace', fontSize: '0.72rem' }}>
            <span>SYS_STATUS: <strong style={{ color: '#10B981' }}>OPERATIONAL</strong></span>
            <span>/</span>
            <span>SECURITY: <strong style={{ color: '#FFFFFF' }}>ENCRYPTED</strong></span>
            <span>/</span>
            <span>BUILD: <strong style={{ color: '#FF5500' }}>v2.4.0</strong></span>
          </div>

        </div>

        <div style={{ width: '100%', height: '1px', background: 'rgba(255, 255, 255, 0.06)' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', color: '#525866' }}>
          <div>
            "Speak with clarity. Think without hesitation." — Talkiva Communication & Analytics
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '0.72rem' }}>
            © {new Date().getFullYear()} TALKIVA. ALL RIGHTS RESERVED.
          </div>
        </div>

      </div>
    </footer>
  );
}
