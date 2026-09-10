import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * ConceptSection — "Speak before you feel ready."
 * Large editorial text with scroll-triggered word reveal.
 */

const wordVariants = {
  hidden: { opacity: 0.08, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

function AnimatedText({ text, style }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const words = text.split(' ');

  return (
    <span ref={ref} style={{ display: 'inline', ...style }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          custom={i}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={wordVariants}
          style={{ display: 'inline-block', marginRight: '0.3em' }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export default function ConceptSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-150px' });

  return (
    <section
      id="concept"
      ref={sectionRef}
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-5xl) var(--space-xl)',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '900px', textAlign: 'center' }}>
        {/* Main statement */}
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 'var(--space-2xl)',
            color: 'var(--color-text-primary)',
          }}
        >
          <AnimatedText text="Speak before you feel ready." />
        </h2>

        {/* Accent divider */}
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: 80 } : {}}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: '2px',
            background: 'var(--color-accent)',
            margin: '0 auto var(--space-2xl)',
          }}
        />

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1.1rem',
            lineHeight: 1.8,
            color: 'var(--color-text-secondary)',
            maxWidth: '580px',
            margin: '0 auto',
          }}
        >
          Every day, you'll receive one topic. No preparation, no scripts,
          no perfect answers — just you, your thoughts, and a camera.
          Growth begins where comfort ends.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.2rem',
            fontStyle: 'italic',
            color: 'var(--color-accent-dark)',
            marginTop: 'var(--space-xl)',
          }}
        >
          The only way out is through.
        </motion.p>
      </div>
    </section>
  );
}
