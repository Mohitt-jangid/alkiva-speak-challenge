import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * LowPolyBackground — Soft Lavender/Periwinkle Theme with floating 3D geometric shapes
 * Matching the exact visual style from the reference image (top-left icosahedron, top-right sphere, bottom-right cone).
 */

/* Faceted Icosahedron (Top-Left) */
function TopLeftPolyhedron() {
  const meshRef = useRef();
  const geom = useMemo(() => new THREE.IcosahedronGeometry(1.6, 1), []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.position.y = 3.6 + Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geom} position={[-5.8, 3.6, -1]}>
      <meshStandardMaterial
        flatShading={true}
        color="#C4B9FB"
        roughness={0.2}
        metalness={0.4}
      />
    </mesh>
  );
}

/* Faceted Sphere (Top-Right inside background) */
function TopRightSphere() {
  const meshRef = useRef();
  const geom = useMemo(() => new THREE.IcosahedronGeometry(0.7, 2), []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
      meshRef.current.position.y = 2.2 + Math.sin(state.clock.elapsedTime * 1.1) * 0.12;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geom} position={[4.2, 2.2, 0]}>
      <meshStandardMaterial
        flatShading={true}
        color="#E4DCFF"
        roughness={0.15}
        metalness={0.5}
      />
    </mesh>
  );
}

/* Faceted Cone (Bottom-Right) */
function BottomRightCone() {
  const meshRef = useRef();
  const geom = useMemo(() => new THREE.ConeGeometry(1.0, 2.0, 8), []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = -0.6 + Math.sin(state.clock.elapsedTime * 0.7) * 0.08;
      meshRef.current.rotation.y += delta * 0.25;
      meshRef.current.position.y = -3.2 + Math.cos(state.clock.elapsedTime * 0.9) * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geom} position={[5.2, -3.2, 0]} rotation={[0.4, 0, -0.6]}>
      <meshStandardMaterial
        flatShading={true}
        color="#B9C7FC"
        roughness={0.25}
        metalness={0.4}
      />
    </mesh>
  );
}

/* Small shiny blue marble (Center-Left) */
function FloatingMarble() {
  const meshRef = useRef();
  const geom = useMemo(() => new THREE.SphereGeometry(0.35, 32, 32), []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = -1.8 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geom} position={[-4.5, -1.8, 1]}>
      <meshStandardMaterial
        color="#A1C4FE"
        roughness={0.1}
        metalness={0.8}
      />
    </mesh>
  );
}

export default function LowPolyBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Soft gradient overlay matching periwinkle lavender theme */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #A89CF5 0%, #9485E9 40%, #8271E0 100%)',
          zIndex: -1,
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <ambientLight intensity={0.75} color="#FFFFFF" />
        <directionalLight position={[5, 8, 5]} intensity={1.5} color="#FFFFFF" />
        <pointLight position={[-6, 4, 4]} color="#B8ACFF" intensity={2} />
        <pointLight position={[6, -4, 4]} color="#6495ED" intensity={2} />

        <TopLeftPolyhedron />
        <TopRightSphere />
        <BottomRightCone />
        <FloatingMarble />
      </Canvas>
    </div>
  );
}
