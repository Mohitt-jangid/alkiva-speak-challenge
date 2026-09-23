import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * CobaltSculpture — 3D Central Visual Element matching the reference image.
 * A rich cobalt blue sphere outer shell cut open to reveal an inner silver spiral/radial fin structure.
 */
function SphereWithFins() {
  const groupRef = useRef();
  const innerFinsRef = useRef();

  // Create inner fins geometries (radial blades)
  const finCount = 36;
  const fins = useMemo(() => {
    const items = [];
    for (let i = 0; i < finCount; i++) {
      const angle = (i / finCount) * Math.PI * 2;
      items.push({
        angle,
        rotationZ: angle,
        rotationX: Math.sin(angle * 2) * 0.25,
      });
    }
    return items;
  }, [finCount]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle floating and mouse rotation
      groupRef.current.rotation.y += delta * 0.3;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.1;
    }
    if (innerFinsRef.current) {
      innerFinsRef.current.rotation.z -= delta * 0.4;
    }
  });

  return (
    <group ref={groupRef} scale={1.85}>
      {/* Outer Cobalt Blue Sphere Shell (Hollow Hemisphere cut) */}
      <mesh rotation={[0.2, -0.6, 0.1]} castShadow receiveShadow>
        <sphereGeometry args={[1.2, 64, 64, 0, Math.PI * 2, 0.45, Math.PI * 0.85]} />
        <meshStandardMaterial
          color="#1D42E6"
          roughness={0.15}
          metalness={0.45}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Outer back sphere wall */}
      <mesh rotation={[0.2, -0.6, 0.1]}>
        <sphereGeometry args={[1.19, 64, 64]} />
        <meshStandardMaterial
          color="#0F2494"
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Inner Spiral Fin Core */}
      <group ref={innerFinsRef} position={[0, 0, 0.1]}>
        {fins.map((fin, idx) => (
          <mesh
            key={idx}
            rotation={[fin.rotationX, 0, fin.rotationZ]}
            position={[0, 0, -0.05]}
          >
            <boxGeometry args={[0.02, 1.6, 0.4]} />
            <meshStandardMaterial
              color="#E2E8F0"
              roughness={0.2}
              metalness={0.9}
            />
          </mesh>
        ))}
        {/* Inner center black ring */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[0.3, 0.08, 16, 32]} />
          <meshStandardMaterial color="#1E1B4B" roughness={0.3} metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

export default function CobaltSculpture() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '380px', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.7} color="#FFFFFF" />
        <directionalLight position={[5, 5, 5]} intensity={2.0} color="#FFFFFF" />
        <pointLight position={[-4, 3, 3]} color="#2563EB" intensity={3.0} />
        <pointLight position={[3, -3, 3]} color="#93C5FD" intensity={2.0} />
        <SphereWithFins />
      </Canvas>
    </div>
  );
}
