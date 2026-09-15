import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Animated Faceted Geometry for Pure Black Theme
 */
function PureBlackFacetedMesh() {
  const meshRef = useRef();
  const wireframeRef = useRef();
  const particlesRef = useRef();

  // Create Icosahedron geometry with faceted low-poly offsets
  const geometry = useMemo(() => {
    const geom = new THREE.IcosahedronGeometry(4.0, 3);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);
      const noise = (Math.sin(vx * 2.0) + Math.cos(vy * 2.0) + Math.sin(vz * 2.0)) * 0.18;
      pos.setXYZ(i, vx + noise, vy + noise, vz + noise);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  // Floating particles
  const particlesCount = 80;
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = (Math.random() - 0.5) * 16;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, [particlesCount]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y += delta * 0.15;
      wireframeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <group position={[0, 0, -1]}>
      {/* Faceted Base Mesh */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          flatShading={true}
          roughness={0.15}
          metalness={0.9}
          color="#08090C"
          emissive="#030406"
        />
      </mesh>

      {/* Wireframe Facet Overlay */}
      <mesh ref={wireframeRef} geometry={geometry} scale={1.003}>
        <meshBasicMaterial
          wireframe={true}
          color="#00f2fe"
          transparent={true}
          opacity={0.18}
        />
      </mesh>

      {/* Particle Field */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#00f2fe" transparent opacity={0.6} />
      </points>
    </group>
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
        background: '#000000',
      }}
    >
      {/* Radial Gradient overlay to ensure deep pitch black around edges */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 40%, rgba(10, 14, 25, 0.4) 0%, rgba(0, 0, 0, 0.98) 75%)',
          zIndex: 1,
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <ambientLight intensity={0.4} />
        {/* Prismatic Cyan / Magenta / Violet Light bursts */}
        <pointLight position={[-6, 4, 5]} color="#00f2fe" intensity={3.0} />
        <pointLight position={[6, -4, 5]} color="#ff007f" intensity={3.0} />
        <pointLight position={[0, 6, 2]} color="#7928ca" intensity={2.2} />

        <PureBlackFacetedMesh />
      </Canvas>
    </div>
  );
}
