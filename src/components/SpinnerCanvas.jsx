import React, { Suspense, useRef, useCallback, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import FuturisticSpinner from './FuturisticSpinner';
import BackgroundShapes from './BackgroundShapes';
import gsap from 'gsap';

/**
 * SpinnerCanvas — R3F Canvas wrapper.
 * Handles lighting, environment, and the spin animation orchestration.
 */
export default function SpinnerCanvas({ onSpinComplete, triggerSpin }) {
  const spinState = useRef({
    outerSpeed: 0,
    middleSpeed: 0,
    coreSpeed: 0,
  });
  const [isSpinning, setIsSpinning] = useState(false);
  const timelineRef = useRef(null);

  // 5-step spin animation using GSAP to animate the spinState values
  const startSpin = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);

    // Kill any existing timeline
    if (timelineRef.current) timelineRef.current.kill();

    const tl = gsap.timeline({
      onComplete: () => {
        setIsSpinning(false);
        if (onSpinComplete) onSpinComplete();
      },
    });
    timelineRef.current = tl;

    const state = spinState.current;

    // Step 1: Preparation (0.6s) — slight pullback
    tl.to(state, {
      outerSpeed: -0.5,
      middleSpeed: 0.3,
      coreSpeed: -0.2,
      duration: 0.6,
      ease: 'power2.in',
    });

    // Step 2: Activation (0.8s) — rings start rotating independently
    tl.to(state, {
      outerSpeed: 8,
      middleSpeed: -6,
      coreSpeed: 10,
      duration: 0.8,
      ease: 'power2.in',
    });

    // Step 3: High speed (1.5s) — full velocity
    tl.to(state, {
      outerSpeed: 25,
      middleSpeed: -20,
      coreSpeed: 30,
      duration: 1.5,
      ease: 'power1.inOut',
    });

    // Step 4: Slow down (2.0s) — decelerate at different rates
    tl.to(state, {
      outerSpeed: 0.5,
      duration: 1.2,
      ease: 'power3.out',
    }, '+=0');
    tl.to(state, {
      middleSpeed: -0.3,
      duration: 1.6,
      ease: 'power3.out',
    }, '-=1.2');
    tl.to(state, {
      coreSpeed: 0.2,
      duration: 2.0,
      ease: 'power4.out',
    }, '-=1.6');

    // Step 5: Lock (0.5s) — snap to zero
    tl.to(state, {
      outerSpeed: 0,
      middleSpeed: 0,
      coreSpeed: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    });
  }, [isSpinning, onSpinComplete]);

  // Expose spin trigger to parent
  React.useEffect(() => {
    if (triggerSpin) {
      triggerSpin.current = startSpin;
    }
  }, [startSpin, triggerSpin]);

  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 40 }}
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      style={{
        background: 'transparent',
        width: '100%',
        height: '100%',
      }}
    >
      <Suspense fallback={null}>
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight
          position={[-3, -2, 4]}
          intensity={0.3}
          color="#C9A96E"
        />
        <pointLight position={[0, 0, 6]} intensity={0.5} color="#FAF8F5" />

        {/* Environment for reflections */}
        <Environment preset="city" environmentIntensity={0.3} />

        {/* The spinner */}
        <FuturisticSpinner spinState={spinState} isSpinning={isSpinning} />

        {/* Subtle background shapes */}
        <BackgroundShapes />

        {/* Performance adapters */}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
      </Suspense>
    </Canvas>
  );
}
