import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * MissionSculpture — A floating abstract futuristic sculpture.
 * Built from multiple geometric pieces with metallic/matte materials.
 * Reacts to mouse movement and has an "accept" burst animation.
 *
 * Props:
 *  - accepted: boolean — triggers the dramatic accept animation
 */

/* ---- Individual floating piece ---- */
function FloatingPiece({
  geometry,
  color,
  roughness = 0.4,
  metalness = 0.6,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  floatSpeed = 1,
  floatAmp = 0.1,
  rotSpeed = [0.003, 0.002, 0.001],
  accepted,
  burstDir = [0, 0, 0],
}) {
  const ref = useRef();
  const initialPos = useMemo(() => [...position], [position]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;

    // Float
    ref.current.position.y = initialPos[1] + Math.sin(t * floatSpeed) * floatAmp;
    ref.current.position.x = initialPos[0] + Math.cos(t * floatSpeed * 0.7) * floatAmp * 0.5;

    // Slow rotation
    ref.current.rotation.x += rotSpeed[0];
    ref.current.rotation.y += rotSpeed[1];
    ref.current.rotation.z += rotSpeed[2];

    // Accept burst — pieces fly outward then return
    if (accepted) {
      const burstPhase = Math.min((t - ref.current.userData.acceptTime) * 2, 1);
      if (burstPhase <= 1) {
        const ease = burstPhase < 0.3
          ? burstPhase / 0.3 // expand
          : 1 - ((burstPhase - 0.3) / 0.7); // contract
        const intensity = ease * 0.6;
        ref.current.position.x = initialPos[0] + burstDir[0] * intensity;
        ref.current.position.y = initialPos[1] + burstDir[1] * intensity + Math.sin(t * floatSpeed) * floatAmp;
        ref.current.position.z = burstDir[2] * intensity;
      }
    }
  });

  // Record accept time
  React.useEffect(() => {
    if (accepted && ref.current) {
      ref.current.userData.acceptTime = performance.now() / 1000; // approximate
    }
  }, [accepted]);

  // Record accept start from clock
  const clockRef = useRef(0);
  useFrame((state) => {
    if (accepted && clockRef.current === 0) {
      clockRef.current = state.clock.elapsedTime;
      if (ref.current) ref.current.userData.acceptTime = clockRef.current;
    }
    if (!accepted) clockRef.current = 0;
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation} scale={scale} castShadow>
      {geometry}
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
      />
    </mesh>
  );
}

/* ---- Main Sculpture ---- */
export default function MissionSculpture({ accepted }) {
  const groupRef = useRef();
  const { pointer } = useThree();
  const targetRot = useRef({ x: 0, y: 0 });

  // Mouse tracking + floating
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Slow float
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.12;

    // Mouse tracking
    targetRot.current.x = pointer.y * 0.12;
    targetRot.current.y = pointer.x * 0.12;
    groupRef.current.rotation.x += (targetRot.current.x - groupRef.current.rotation.x) * delta * 2;
    groupRef.current.rotation.y += (targetRot.current.y - groupRef.current.rotation.y) * delta * 2;

    // Subtle base rotation
    groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.05;
  });

  // Accept pulse — brief scale animation
  const scaleRef = useRef(1);
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const target = accepted ? 1.08 : 1;
    scaleRef.current += (target - scaleRef.current) * delta * 4;
    groupRef.current.scale.setScalar(scaleRef.current);
  });

  return (
    <group ref={groupRef}>
      {/* Central core — elongated octahedron */}
      <FloatingPiece
        geometry={<octahedronGeometry args={[0.7, 0]} />}
        color="#2A2A2A"
        roughness={0.2}
        metalness={0.85}
        position={[0, 0, 0]}
        floatSpeed={0.8}
        floatAmp={0.05}
        rotSpeed={[0.002, 0.004, 0.001]}
        accepted={accepted}
        burstDir={[0, 0.5, 0]}
        scale={1.2}
      />

      {/* Orbiting ring — flat torus */}
      <FloatingPiece
        geometry={<torusGeometry args={[1.2, 0.06, 12, 48]} />}
        color="#C9A96E"
        roughness={0.35}
        metalness={0.7}
        position={[0, 0, 0]}
        rotation={[1.2, 0.3, 0]}
        floatSpeed={0.6}
        floatAmp={0.03}
        rotSpeed={[0.001, 0.005, 0]}
        accepted={accepted}
        burstDir={[0.3, 0.4, 0.2]}
      />

      {/* Second ring — perpendicular */}
      <FloatingPiece
        geometry={<torusGeometry args={[1.0, 0.04, 10, 40]} />}
        color="#6B6560"
        roughness={0.5}
        metalness={0.5}
        position={[0, 0, 0]}
        rotation={[0.3, 1.5, 0.5]}
        floatSpeed={0.5}
        floatAmp={0.04}
        rotSpeed={[0.003, -0.002, 0.001]}
        accepted={accepted}
        burstDir={[-0.3, -0.2, 0.4]}
      />

      {/* Upper satellite — small sphere */}
      <FloatingPiece
        geometry={<sphereGeometry args={[0.18, 16, 16]} />}
        color="#E8E4E0"
        roughness={0.1}
        metalness={0.9}
        position={[0.8, 0.6, 0.3]}
        floatSpeed={1.2}
        floatAmp={0.15}
        rotSpeed={[0.005, 0.003, 0.002]}
        accepted={accepted}
        burstDir={[1.2, 0.8, 0.5]}
      />

      {/* Lower satellite — small box */}
      <FloatingPiece
        geometry={<boxGeometry args={[0.2, 0.2, 0.2]} />}
        color="#C9A96E"
        roughness={0.3}
        metalness={0.7}
        position={[-0.7, -0.5, -0.2]}
        rotation={[0.5, 0.3, 0.8]}
        floatSpeed={1.0}
        floatAmp={0.12}
        rotSpeed={[0.004, -0.003, 0.006]}
        accepted={accepted}
        burstDir={[-1, -0.8, -0.4]}
      />

      {/* Side accent — cylinder */}
      <FloatingPiece
        geometry={<cylinderGeometry args={[0.08, 0.08, 0.5, 8]} />}
        color="#3A3A3A"
        roughness={0.3}
        metalness={0.8}
        position={[1.0, -0.2, -0.4]}
        rotation={[0, 0, 0.8]}
        floatSpeed={0.9}
        floatAmp={0.1}
        rotSpeed={[0.002, 0.001, 0.004]}
        accepted={accepted}
        burstDir={[1.5, -0.3, -0.6]}
      />

      {/* Small floating dodecahedron */}
      <FloatingPiece
        geometry={<dodecahedronGeometry args={[0.15, 0]} />}
        color="#9E9891"
        roughness={0.45}
        metalness={0.55}
        position={[-0.9, 0.7, 0.5]}
        floatSpeed={1.4}
        floatAmp={0.18}
        rotSpeed={[0.006, -0.004, 0.002]}
        accepted={accepted}
        burstDir={[-1.3, 1, 0.7]}
      />

      {/* Inner accent ring */}
      <FloatingPiece
        geometry={<torusGeometry args={[0.5, 0.03, 8, 32]} />}
        color="#E8E4E0"
        roughness={0.15}
        metalness={0.9}
        position={[0, 0, 0]}
        rotation={[0.8, -0.5, 1.2]}
        floatSpeed={0.7}
        floatAmp={0.02}
        rotSpeed={[-0.003, 0.006, 0.001]}
        accepted={accepted}
        burstDir={[0.2, -0.5, 0.3]}
      />
    </group>
  );
}
