"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const { viewport } = useThree();

  const [initialPositions] = useState(
    () => createParticles(theme.particles.count, theme.particles.speed)
  );

  useEffect(() => {
    velocitiesRef.current = initialPositions.velocities;
  }, [initialPositions.velocities]);

  useEffect(() => {
    const data = createParticles(theme.particles.count, theme.particles.speed);
    velocitiesRef.current = data.velocities;
    if (meshRef.current) {
      const geo = meshRef.current.geometry;
      geo.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
    }
  }, [theme.particles.count, theme.particles.speed]);

  // Track mouse
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const velocities = velocitiesRef.current;
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    const count = positions.length / 3;

    // Mouse influence in world coords
    const mx = mouseRef.current.x * viewport.width * 0.5;
    const my = mouseRef.current.y * viewport.height * 0.5;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      // Base velocity
      positions[ix] += velocities[ix];
      positions[iy] += velocities[iy];
      positions[iz] += velocities[iz];

      // Mouse repulsion
      const dx = positions[ix] - mx;
      const dy = positions[iy] - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 2.5) {
        const force = (2.5 - dist) * 0.008;
        positions[ix] += dx * force;
        positions[iy] += dy * force;
      }

      // Wrap around
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
  const [isMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  if (isMobile) {
    // Reduced particles on mobile
    return (
      <div className="fixed inset-0 -z-10">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <MobileParticles />
        </Canvas>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <Particles />
      </Canvas>
    </div>
  );
}

function MobileParticles() {
  const { theme } = useTheme();
  const meshRef = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array>(new Float32Array(0));

  const mobileCount = Math.min(theme.particles.count, 30);
  const [initialData] = useState(
    () => createParticles(mobileCount, theme.particles.speed * 0.5)
  );

  useEffect(() => {
    velocitiesRef.current = initialData.velocities;
  }, [initialData.velocities]);

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
          args={[initialData.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={theme.particles.color}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
