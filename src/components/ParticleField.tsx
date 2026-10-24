"use client";

import { useRef, useEffect, useState, useMemo } from "react";
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

function createStarTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  const cx = size / 2, cy = size / 2;
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const x = cx + Math.cos(angle) * (size * 0.45);
    const y = cy + Math.sin(angle) * (size * 0.45);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
    const innerAngle = angle + (2 * Math.PI) / 10;
    const ix = cx + Math.cos(innerAngle) * (size * 0.18);
    const iy = cy + Math.sin(innerAngle) * (size * 0.18);
    ctx.lineTo(ix, iy);
  }
  ctx.closePath();
  ctx.fill();
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

function createDiamondTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(size / 2, 2);
  ctx.lineTo(size - 2, size / 2);
  ctx.lineTo(size / 2, size - 2);
  ctx.lineTo(2, size / 2);
  ctx.closePath();
  ctx.fill();
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

function createSquareTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(8, 8, 48, 48);
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

function createDotTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);
  const grd = ctx.createRadialGradient(32, 32, 0, 32, 32, 24);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

function getTextureForShape(shape: string): THREE.Texture | null {
  switch (shape) {
    case "star": return createStarTexture();
    case "cube": return createSquareTexture();
    case "diamond": return createDiamondTexture();
    case "dot": return createDotTexture();
    default: return null; // sphere uses default circle
  }
}

function getSizeForShape(shape: string): number {
  switch (shape) {
    case "star": return 0.15;
    case "cube": return 0.12;
    case "diamond": return 0.1;
    case "dot": return 0.08;
    default: return 0.05;
  }
}

function scrubNonFinite(values: Float32Array) {
  for (let i = 0; i < values.length; i++) {
    if (!Number.isFinite(values[i])) values[i] = 0;
  }
}

function Particles() {
  const { theme } = useTheme();
  const meshRef = useRef<THREE.Points>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const { viewport } = useThree();
  const [initialData] = useState(() =>
    createParticles(theme.particles.count, theme.particles.speed)
  );
  const velocitiesRef = useRef<Float32Array>(initialData.velocities);
  const particleKeyRef = useRef(`${theme.particles.count}:${theme.particles.speed}`);

  const texture = useMemo(() => getTextureForShape(theme.particles.shape), [theme.particles.shape]);

  useEffect(() => {
    return () => { texture?.dispose(); };
  }, [texture]);

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
    const particleKey = `${theme.particles.count}:${theme.particles.speed}`;
    if (particleKeyRef.current !== particleKey) {
      particleKeyRef.current = particleKey;
      const data = createParticles(theme.particles.count, theme.particles.speed);
      scrubNonFinite(data.positions);
      velocitiesRef.current = data.velocities;
      const geo = meshRef.current.geometry;
      geo.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
      geo.computeBoundingSphere();
    }
    const velocities = velocitiesRef.current;
    const positions = meshRef.current.geometry.attributes.position?.array as Float32Array;
    if (!positions || velocities.length !== positions.length) return;
    const count = positions.length / 3;

    const viewWidth = Number.isFinite(viewport.width) ? viewport.width : 0;
    const viewHeight = Number.isFinite(viewport.height) ? viewport.height : 0;
    const mx = mouseRef.current.x * viewWidth * 0.5;
    const my = mouseRef.current.y * viewHeight * 0.5;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;
      const vx = velocities[ix];
      const vy = velocities[iy];
      const vz = velocities[iz];
      if (!Number.isFinite(vx) || !Number.isFinite(vy) || !Number.isFinite(vz)) continue;

      positions[ix] += vx;
      positions[iy] += vy;
      positions[iz] += vz;

      const dx = positions[ix] - mx;
      const dy = positions[iy] - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (Number.isFinite(dist) && dist < 2.5 && viewWidth > 0 && viewHeight > 0) {
        const force = (2.5 - dist) * 0.008;
        positions[ix] += dx * force;
        positions[iy] += dy * force;
      }

      for (let j = 0; j < 3; j++) {
        if (Math.abs(positions[i * 3 + j]) > 10) {
          positions[i * 3 + j] *= -0.9;
        }
      }
    }
    scrubNonFinite(positions);
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    const sphere = meshRef.current.geometry.boundingSphere;
    if (sphere && !Number.isFinite(sphere.radius)) {
      meshRef.current.geometry.computeBoundingSphere();
    }
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={meshRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[initialData.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={getSizeForShape(theme.particles.shape)}
        color={theme.particles.color}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        map={texture}
        alphaMap={texture}
        alphaTest={0.01}
      />
    </points>
  );
}

function MobileParticles() {
  const { theme } = useTheme();
  const meshRef = useRef<THREE.Points>(null);

  const texture = useMemo(() => getTextureForShape(theme.particles.shape), [theme.particles.shape]);

  useEffect(() => {
    return () => { texture?.dispose(); };
  }, [texture]);

  const mobileCount = Math.min(theme.particles.count, 30);
  const [initialData] = useState(() =>
    createParticles(mobileCount, theme.particles.speed * 0.5)
  );
  const velocitiesRef = useRef<Float32Array>(initialData.velocities);

  useFrame((state) => {
    if (!meshRef.current) return;
    const velocities = velocitiesRef.current;
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    if (velocities.length !== positions.length) return;
    const count = positions.length / 3;
    for (let i = 0; i < count; i++) {
      const vx = velocities[i * 3];
      const vy = velocities[i * 3 + 1];
      const vz = velocities[i * 3 + 2];
      if (!Number.isFinite(vx) || !Number.isFinite(vy) || !Number.isFinite(vz)) continue;
      positions[i * 3] += vx;
      positions[i * 3 + 1] += vy;
      positions[i * 3 + 2] += vz;
      for (let j = 0; j < 3; j++) {
        if (Math.abs(positions[i * 3 + j]) > 10) {
          positions[i * 3 + j] *= -0.9;
        }
      }
    }
    scrubNonFinite(positions);
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={meshRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[initialData.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={getSizeForShape(theme.particles.shape)}
        color={theme.particles.color}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        map={texture}
        alphaMap={texture}
        alphaTest={0.01}
      />
    </points>
  );
}

export default function ParticleField() {
  const [isMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        {isMobile ? <MobileParticles /> : <Particles />}
      </Canvas>
    </div>
  );
}
