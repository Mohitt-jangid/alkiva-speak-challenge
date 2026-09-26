import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * LowPolyBackground — Dark Cinematic 3D Ambient System
 * Dark metallic geometric shapes with warm orange/amber studio lighting.
 */

/* Faceted Icosahedron (Top-Left) */
function TopLeftPolyhedron() {
  const meshRef = useRef();
  const geom = useMemo(() => new THREE.IcosahedronGeometry(1.6, 1), []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x += delta * 0.08;
      meshRef.current.position.y = 3.6 + Math.sin(state.clock.elapsedTime * 0.7) * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geom} position={[-5.8, 3.6, -1]}>
      <meshStandardMaterial
        flatShading={true}
        color="#1E222D"
        roughness={0.3}
        metalness={0.8}
        emissive="#3A1800"
        emissiveIntensity={0.2}
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
      meshRef.current.rotation.y += delta * 0.25;
      meshRef.current.position.y = 2.2 + Math.sin(state.clock.elapsedTime * 1.0) * 0.12;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geom} position={[4.2, 2.2, 0]}>
      <meshStandardMaterial
        flatShading={true}
        color="#2A2F3D"
        roughness={0.25}
        metalness={0.85}
      />
    </mesh>
  );
}

/* Faceted Cone (Bottom-Right) */
function BottomRightCone() {
  const meshRef = useRef();
  const geom = useMemo(() => new THREE.ConeGeometry(1.2, 2.4, 6), []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.position.y = -3.2 + Math.cos(state.clock.elapsedTime * 0.9) * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geom} position={[5.5, -3.2, -0.5]} rotation={[0.4, 0, 0.2]}>
      <meshStandardMaterial
        flatShading={true}
        color="#1A1D26"
        roughness={0.3}
        metalness={0.7}
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
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} color="#FFFFFF" />
        {/* Warm Orange Accent Underlight */}
        <pointLight position={[0, -4, 4]} intensity={2.5} color="#FF5500" distance={12} />
        {/* Crisp Top Cool Rim Light */}
        <directionalLight position={[-5, 5, 5]} intensity={1.2} color="#A0B0D0" />
        
        <TopLeftPolyhedron />
        <TopRightSphere />
        <BottomRightCone />
      </Canvas>
    </div>
  );
}
