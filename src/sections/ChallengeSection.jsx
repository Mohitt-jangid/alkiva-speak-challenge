import React, { useRef, useState, Suspense } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { getDailyChallenge } from '../utils/dailyTopic';

/**
 * Floating abstract 3D cube — responsive canvas sizing.
 */
function AbstractCube({ isRevealed }) {
  const groupRef = useRef();
  const cube1Ref = useRef();
  const cube2Ref = useRef();
  const cube3Ref = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.2;
      groupRef.current.rotation.y += 0.003;
      groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
    }
    const spread = isRevealed ? 0.8 : 0;
    if (cube1Ref.current) {
      cube1Ref.current.rotation.x += 0.005;
      cube1Ref.current.rotation.z += 0.003;
      cube1Ref.current.position.x = -spread;
    }
    if (cube2Ref.current) {
      cube2Ref.current.rotation.y += 0.007;
      cube2Ref.current.rotation.z -= 0.004;
      cube2Ref.current.position.y = spread * 0.6;
    }
    if (cube3Ref.current) {
      cube3Ref.current.rotation.z += 0.004;
      cube3Ref.current.rotation.x -= 0.006;
      cube3Ref.current.position.x = spread;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={cube1Ref} castShadow>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh ref={cube2Ref} rotation={[0.5, 0.5, 0]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#C9A96E" roughness={0.45} metalness={0.6} transparent opacity={0.7} />
      </mesh>
      <mesh ref={cube3Ref} rotation={[0.3, -0.3, 0.5]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#6B6560" roughness={0.5} metalness={0.5} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

export default function ChallengeSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [isRevealed, setIsRevealed] = useState(false);
  const { challenge } = getDailyChallenge();

  return (
    <section
      id="challenge"
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(3rem, 8vw, 8rem) clamp(1rem, 4vw, 3rem)',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'clamp(1.5rem, 4vw, 3rem)',
          maxWidth: 'var(--max-width)',
          width: '100%',
        }}
      >
        {/* 3D Cube */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: 'clamp(220px, 50vw, 350px)',
            height: 'clamp(220px, 50vw, 350px)',
            cursor: 'pointer',
            position: 'relative',
          }}
          onClick={() => setIsRevealed(!isRevealed)}
        >
          <Canvas
            camera={{ position: [0, 0, 4.5], fov: 35 }}
            shadows
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.4} />
              <directionalLight position={[3, 5, 4]} intensity={1} castShadow />
              <pointLight position={[-2, -1, 3]} intensity={0.3} color="#C9A96E" />
              <Environment preset="city" environmentIntensity={0.2} />
              <AbstractCube isRevealed={isRevealed} />
            </Suspense>
          </Canvas>

          {!isRevealed && (
            <motion.p
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                position: 'absolute',
                bottom: '8px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.55rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                whiteSpace: 'nowrap',
              }}
            >
              TAP TO REVEAL
            </motion.p>
          )}
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            maxWidth: '520px',
            textAlign: 'center',
            padding: '0 0.5rem',
          }}
        >
          <p
            className="label"
            style={{
              marginBottom: 'clamp(0.8rem, 2vw, 1.5rem)',
              color: 'var(--color-accent)',
              fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)',
            }}
          >
            BEYOND THE SCREEN
          </p>

          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.5rem, 5vw, 2.8rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
            }}
          >
            Today's Real‑Life Challenge
          </h2>

          <AnimatePresence mode="wait">
            {isRevealed ? (
              <motion.div
                key="revealed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1rem, 3vw, 1.3rem)',
                    fontStyle: 'italic',
                    lineHeight: 1.6,
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-md)',
                    borderLeft: '2px solid var(--color-accent)',
                    paddingLeft: 'var(--space-md)',
                    textAlign: 'left',
                  }}
                >
                  {challenge}
                </p>
                <p
                  style={{
                    fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.6,
                  }}
                >
                  Step away from the screen. Real growth happens in real conversations.
                </p>
              </motion.div>
            ) : (
              <motion.p
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.7,
                }}
              >
                Not every challenge happens on screen. Tap the object to reveal
                today's real-world challenge — something to push your comfort zone
                in person.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
