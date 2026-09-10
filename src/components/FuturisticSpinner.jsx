import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * FuturisticSpinner — A sculptural, multi-layered 3D object.
 * Not a casino wheel. Think: floating mechanical art piece.
 *
 * Layers:
 *  - Outer Ring: thick torus with segment notches
 *  - Middle Ring: torus with offset rotation axis
 *  - Inner Core: lathe-sculpted lens shape
 *  - Detail elements: small geometric accents
 */

/* ---- Sub-components for each layer ---- */

function OuterRing({ spinState }) {
  const ref = useRef();

  useFrame((state, delta) => {
    if (!ref.current) return;
    const baseSpeed = 0.08;
    const spinSpeed = spinState.current.outerSpeed;
    ref.current.rotation.z += delta * (baseSpeed + spinSpeed);
    ref.current.rotation.x += delta * 0.02;
  });

  // Create notch positions around the ring
  const notches = useMemo(() => {
    const items = [];
    const count = 24;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 3.2;
      items.push({
        position: [Math.cos(angle) * r, Math.sin(angle) * r, 0],
        rotation: [0, 0, angle],
      });
    }
    return items;
  }, []);

  return (
    <group ref={ref}>
      {/* Main ring */}
      <mesh castShadow receiveShadow>
        <torusGeometry args={[3.2, 0.22, 24, 80]} />
        <meshStandardMaterial
          color="#3A3A3A"
          roughness={0.25}
          metalness={0.85}
          envMapIntensity={1.2}
        />
      </mesh>
      {/* Second thinner ring slightly offset */}
      <mesh castShadow position={[0, 0, 0.15]}>
        <torusGeometry args={[3.5, 0.08, 16, 80]} />
        <meshStandardMaterial
          color="#4A4A4A"
          roughness={0.35}
          metalness={0.8}
        />
      </mesh>
      {/* Notch details */}
      {notches.map((n, i) => (
        i % 3 === 0 && (
          <mesh key={i} position={n.position} rotation={n.rotation} castShadow>
            <boxGeometry args={[0.12, 0.06, 0.08]} />
            <meshStandardMaterial
              color="#C9A96E"
              roughness={0.5}
              metalness={0.6}
            />
          </mesh>
        )
      ))}
    </group>
  );
}

function MiddleRing({ spinState }) {
  const ref = useRef();

  useFrame((state, delta) => {
    if (!ref.current) return;
    const baseSpeed = -0.06;
    const spinSpeed = spinState.current.middleSpeed;
    ref.current.rotation.z += delta * (baseSpeed + spinSpeed);
    ref.current.rotation.y += delta * 0.03;
  });

  const segments = useMemo(() => {
    const items = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 2.2;
      items.push({
        position: [Math.cos(angle) * r, Math.sin(angle) * r, 0],
        rotation: [0, 0, angle + Math.PI / 2],
      });
    }
    return items;
  }, []);

  return (
    <group ref={ref} rotation={[0.3, 0, 0]}>
      {/* Middle ring torus */}
      <mesh castShadow receiveShadow>
        <torusGeometry args={[2.2, 0.18, 20, 64]} />
        <meshStandardMaterial
          color="#2A2A2A"
          roughness={0.65}
          metalness={0.5}
        />
      </mesh>
      {/* Mechanical segments */}
      {segments.map((s, i) => (
        i % 2 === 0 && (
          <mesh key={i} position={s.position} rotation={s.rotation} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.25, 8]} />
            <meshStandardMaterial
              color="#5A5A5A"
              roughness={0.4}
              metalness={0.7}
            />
          </mesh>
        )
      ))}
    </group>
  );
}

function InnerCore({ spinState }) {
  const ref = useRef();
  const lensRef = useRef();

  useFrame((state, delta) => {
    if (!ref.current) return;
    const baseSpeed = 0.04;
    const spinSpeed = spinState.current.coreSpeed;
    ref.current.rotation.z += delta * (baseSpeed + spinSpeed);

    // Gentle pulse
    if (lensRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
      lensRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  // Lathe geometry for a camera-lens-like shape
  const lensGeometry = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const r = Math.sin(t * Math.PI) * 1.0 + 0.2;
      const y = (t - 0.5) * 0.8;
      points.push(new THREE.Vector2(r, y));
    }
    return new THREE.LatheGeometry(points, 48);
  }, []);

  return (
    <group ref={ref}>
      {/* Lens-shaped core */}
      <mesh ref={lensRef} geometry={lensGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color="#E8E4E0"
          roughness={0.08}
          metalness={0.95}
          envMapIntensity={2}
        />
      </mesh>
      {/* Inner accent ring */}
      <mesh castShadow>
        <torusGeometry args={[0.85, 0.06, 12, 40]} />
        <meshStandardMaterial
          color="#C9A96E"
          roughness={0.35}
          metalness={0.7}
        />
      </mesh>
      {/* Center dot */}
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#1A1A1A"
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}

/* ---- Main Spinner ---- */
export default function FuturisticSpinner({ spinState, isSpinning }) {
  const groupRef = useRef();
  const { pointer } = useThree();

  // Mouse tracking — gentle tilt toward cursor
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Floating motion
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.15;
    groupRef.current.position.x = Math.cos(t * 0.4) * 0.05;

    // Mouse tracking (disabled during spin)
    if (!isSpinning) {
      targetRotation.current.x = pointer.y * 0.15;
      targetRotation.current.y = pointer.x * 0.15;
    }

    // Lerp toward target
    groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * delta * 2;
    groupRef.current.rotation.y += (targetRotation.current.y - groupRef.current.rotation.y) * delta * 2;
  });

  return (
    <group ref={groupRef}>
      <OuterRing spinState={spinState} />
      <MiddleRing spinState={spinState} />
      <InnerCore spinState={spinState} />
    </group>
  );
}
