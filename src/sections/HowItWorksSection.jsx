import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * HowItWorksSection — Three large numbered steps with lots of whitespace.
 */

const steps = [
  { number: '01', title: 'GET TODAY\'S TOPIC', desc: 'Spin the challenge and discover what you\'ll speak about.' },
  { number: '02', title: 'TURN ON YOUR CAMERA', desc: 'No fancy setup needed. Just you and your phone or laptop.' },
  { number: '03', title: 'SPEAK WITHOUT OVERTHINKING', desc: 'Think out loud for 3–5 minutes. Imperfect is perfect.' },
];

function Step({ step, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.2,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        textAlign: 'center',
        position: 'relative',
      }}
    >
      {/* Step number */}
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(4rem, 8vw, 7rem)',
          fontWeight: 700,
          color: 'var(--color-border)',
          lineHeight: 1,
          marginBottom: 'var(--space-sm)',
          userSelect: 'none',
        }}
      >
        {step.number}
      </div>

      {/* Step title */}
      <h3
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-sm)',
        }}
      >
        {step.title}
      </h3>

      {/* Step description */}
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.9rem',
          color: 'var(--color-text-secondary)',
          maxWidth: '300px',
          margin: '0 auto',
          lineHeight: 1.6,
        }}
      >
        {step.desc}
      </p>
    </motion.div>
  );
}

function Arrow({ index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scaleY: 0 }}
      animate={isInView ? { opacity: 1, scaleY: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: 0.3 + index * 0.2,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: 'var(--space-xl) 0',
      }}
    >
      <svg
        width="2"
        height="60"
        viewBox="0 0 2 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="1"
          y1="0"
          x2="1"
          y2="50"
          stroke="var(--color-text-muted)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <polygon
          points="1,60 -2,52 4,52"
          fill="var(--color-text-muted)"
        />
      </svg>
    </motion.div>
  );
}

export default function HowItWorksSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-5xl) var(--space-xl)',
        position: 'relative',
      }}
    >
      {/* Section label */}
      <motion.p
        className="label"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        style={{
          marginBottom: 'var(--space-3xl)',
          color: 'var(--color-accent)',
          fontSize: '0.7rem',
        }}
      >
        HOW IT WORKS
      </motion.p>

      {/* Steps */}
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {steps.map((step, i) => (
          <React.Fragment key={step.number}>
            <Step step={step} index={i} />
            {i < steps.length - 1 && <Arrow index={i} />}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
