"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "@/lib/theme-context";

function createParticles(count: number, speed: number) {
  const pos = new Float32Array(count * 3);
  const vel = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 20;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    vel[i * 3] = (Math.random() - 0.5) * speed * 0.02;
    vel[i * 3 + 1] = (Math.random() - 0.5) * speed * 0.02;
    vel[i * 3 + 2] = (Math.random() - 0.5) * speed * 0.02;
  }
  return { positions: pos, velocities: vel };
}

function Particles() {
  const { theme } = useTheme();
  const meshRef = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array>(new Float32Array(0));
  const [initialPositions] = useState(
    () => createParticles(theme.particles.count, theme.particles.speed)
  );

  // Store velocities in ref, init from state
  useEffect(() => {
    velocitiesRef.current = initialPositions.velocities;
  }, [initialPositions.velocities]);

  // Update on theme change
  useEffect(() => {
    const data = createParticles(theme.particles.count, theme.particles.speed);
    velocitiesRef.current = data.velocities;
    if (meshRef.current) {
      const geo = meshRef.current.geometry;
      geo.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
    }
  }, [theme.particles.count, theme.particles.speed]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const velocities = velocitiesRef.current;
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    const count = positions.length / 3;
    for (let i = 0; i < count; i++) {
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      for (let j = 0; j < 3; j++) {
        if (Math.abs(positions[i * 3 + j]) > 10) {
          positions[i * 3 + j] *= -0.9;
        }
      }
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[initialPositions.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={theme.particles.color}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function ParticleField() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <Particles />
      </Canvas>
    </div>
  );
}
