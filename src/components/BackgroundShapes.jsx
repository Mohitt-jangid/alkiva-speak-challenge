import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * BackgroundShapes — Subtle floating geometric shapes.
 * Very transparent, slow drift, placed far from camera.
 */

function FloatingShape({ geometry, position, speed, rotationAxis, color, scale = 1 }) {
  const ref = useRef();
  const initialPos = useMemo(() => [...position], [position]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;

    // Slow drift
    ref.current.position.y = initialPos[1] + Math.sin(t) * 0.3;
    ref.current.position.x = initialPos[0] + Math.cos(t * 0.7) * 0.15;

    // Slow rotation
    ref.current.rotation.x += 0.001 * rotationAxis[0];
    ref.current.rotation.y += 0.001 * rotationAxis[1];
    ref.current.rotation.z += 0.001 * rotationAxis[2];
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      {geometry}
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.06}
        roughness={0.8}
        metalness={0.2}
        wireframe={false}
      />
    </mesh>
  );
}

export default function BackgroundShapes() {
  return (
    <group>
      <FloatingShape
        geometry={<octahedronGeometry args={[1.5, 0]} />}
        position={[-8, 3, -12]}
        speed={0.3}
        rotationAxis={[1, 0.5, 0.3]}
        color="#C9A96E"
        scale={1.5}
      />
      <FloatingShape
        geometry={<icosahedronGeometry args={[1, 0]} />}
        position={[9, -2, -15]}
        speed={0.25}
        rotationAxis={[0.3, 1, 0.5]}
        color="#8A8580"
        scale={2}
      />
      <FloatingShape
        geometry={<torusKnotGeometry args={[0.8, 0.25, 64, 8, 2, 3]} />}
        position={[-6, -4, -10]}
        speed={0.2}
        rotationAxis={[0.5, 0.3, 1]}
        color="#6B6560"
        scale={1.2}
      />
      <FloatingShape
        geometry={<dodecahedronGeometry args={[1, 0]} />}
        position={[7, 5, -18]}
        speed={0.15}
        rotationAxis={[0.8, 0.2, 0.6]}
        color="#C9A96E"
        scale={1.8}
      />
    </group>
  );
}
