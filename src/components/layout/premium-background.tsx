"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { useAccessibility } from "@/contexts/accessibility-context";

// ─── Types ───────────────────────────────────────────────────
interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  baseSize: number;
  opacity: number;        // 0 (invisible) → 1 (fully visible)
  targetOpacity: number;  // Where opacity is heading
  spawnDelay: number;     // ms before this particle starts appearing
  spawnTime: number;      // timestamp when spawn was triggered
}

interface Explosion {
  x: number;
  y: number;
  progress: number;
  maxRadius: number;
  particleIndex: number;
}

// ─── Configuration ───────────────────────────────────────────
const CONFIG = {
  desktop: { count: 90, connectionDist: 180 },
  mobile: { count: 30, connectionDist: 130 },
  baseDepth: 300,
  nodeOpacity: 0.7,
  lineOpacity: 0.3,
  lineWidth: 0.8,
  speed: 0.2,
  parallaxStrength: 45,
  canvasOpacity: 0.18,

  explosion: {
    minDelay: 3000,
    maxDelay: 8000,
    duration: 1200,
    maxRadius: 120,
    flashIntensity: 0.6,
    scatterForce: 3.5,
    scatterRadius: 160,
  },

  // Chain reaction settings
  chain: {
    waveDelay: 60,       // ms between each BFS wave
    spawnDuration: 400,  // ms for each node to fade in
    despawnDuration: 300, // ms for each node to fade out during chain explosion
  },
} as const;

// ─── Helper: parse CSS variable to "H, S%, L%" for Canvas ───
function getHSLFromCSSVar(varName: string): string {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  if (!raw) return "0, 0%, 100%";
  const parts = raw.split(/\s+/);
  if (parts.length >= 3) {
    return `${parts[0]}, ${parts[1]}, ${parts[2]}`;
  }
  return raw;
}

// ─── Easing helpers ──────────────────────────────────────────
function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// ─── BFS: compute wave order from a starting point ───────────
function computeChainOrder(
  particles: Particle[],
  startX: number,
  startY: number,
  connectionDist: number
): number[][] {
  // Find the nearest particle to (startX, startY) as the seed
  let seedIdx = 0;
  let minDist = Infinity;
  for (let i = 0; i < particles.length; i++) {
    const dx = particles[i].x - startX;
    const dy = particles[i].y - startY;
    const d = dx * dx + dy * dy;
    if (d < minDist) {
      minDist = d;
      seedIdx = i;
    }
  }

  // BFS from seed — group particles into waves by hop distance
  const visited = new Set<number>();
  const waves: number[][] = [];
  let frontier = [seedIdx];
  visited.add(seedIdx);

  while (frontier.length > 0) {
    waves.push([...frontier]);
    const nextFrontier: number[] = [];

    for (const idx of frontier) {
      const p = particles[idx];
      for (let j = 0; j < particles.length; j++) {
        if (visited.has(j)) continue;
        const other = particles[j];
        const dx = p.x - other.x;
        const dy = p.y - other.y;
        // Use a generous radius for chain connectivity (1.5x normal connection distance)
        if (dx * dx + dy * dy < (connectionDist * 1.8) ** 2) {
          visited.add(j);
          nextFrontier.push(j);
        }
      }
    }

    frontier = nextFrontier;
  }

  // Catch any disconnected particles — add them as a final wave
  const orphans: number[] = [];
  for (let i = 0; i < particles.length; i++) {
    if (!visited.has(i)) orphans.push(i);
  }
  if (orphans.length > 0) waves.push(orphans);

  return waves;
}

// ─── Component ───────────────────────────────────────────────
export function PremiumBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const explosionsRef = useRef<Explosion[]>([]);
  const animFrameRef = useRef<number>(0);
  const explosionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chainTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [mounted, setMounted] = useState(false);
  // Track transition state: "spawning" | "idle" | "despawning" | "hidden"
  const transitionRef = useRef<"spawning" | "idle" | "despawning" | "hidden">("spawning");
  const { reducedMotion } = useAccessibility();
  const prevReducedMotionRef = useRef(reducedMotion);

  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const springX = useSpring(rawMouseX, { stiffness: 30, damping: 20, mass: 1.2 });
  const springY = useSpring(rawMouseY, { stiffness: 30, damping: 20, mass: 1.2 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // ─── Resize handler ──────────────────────────────────────
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  // ─── Initialize particles (all invisible initially) ──────
  const initParticles = useCallback(() => {
    const isMob = window.innerWidth < 768;
    const cfg = isMob ? CONFIG.mobile : CONFIG.desktop;
    const w = window.innerWidth;
    const h = window.innerHeight;

    particlesRef.current = Array.from({ length: cfg.count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * CONFIG.baseDepth,
      vx: (Math.random() - 0.5) * CONFIG.speed,
      vy: (Math.random() - 0.5) * CONFIG.speed,
      vz: (Math.random() - 0.5) * CONFIG.speed * 0.5,
      baseSize: Math.random() * 2.5 + 1.5,
      opacity: 0,          // Start invisible
      targetOpacity: 1,
      spawnDelay: 0,
      spawnTime: 0,
    }));
  }, []);

  // ─── Clear all chain reaction timers ─────────────────────
  const clearChainTimers = useCallback(() => {
    for (const t of chainTimersRef.current) clearTimeout(t);
    chainTimersRef.current = [];
  }, []);

  // ─── Chain spawn: nodes appear wave by wave from bottom-right ──
  const triggerChainSpawn = useCallback(() => {
    const particles = particlesRef.current;
    if (particles.length === 0) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const isMob = w < 768;
    const connectionDist = isMob ? CONFIG.mobile.connectionDist : CONFIG.desktop.connectionDist;

    // Start from bottom-right corner
    const waves = computeChainOrder(particles, w, h, connectionDist);
    const now = performance.now();

    transitionRef.current = "spawning";

    // Set all particles invisible with staggered spawn times
    for (const p of particles) {
      p.opacity = 0;
      p.targetOpacity = 1;
    }

    let totalDelay = 0;
    for (const wave of waves) {
      for (const idx of wave) {
        const p = particles[idx];
        p.spawnDelay = totalDelay;
        p.spawnTime = now;
      }
      totalDelay += CONFIG.chain.waveDelay;
    }

    // Set idle after all waves complete
    const finishTimer = setTimeout(() => {
      transitionRef.current = "idle";
    }, totalDelay + CONFIG.chain.spawnDuration);
    chainTimersRef.current.push(finishTimer);
  }, []);

  // ─── Chain despawn: nodes explode wave by wave from bottom-right ──
  const triggerChainDespawn = useCallback((onComplete: () => void) => {
    const particles = particlesRef.current;
    if (particles.length === 0) {
      onComplete();
      return;
    }

    const w = window.innerWidth;
    const h = window.innerHeight;
    const isMob = w < 768;
    const connectionDist = isMob ? CONFIG.mobile.connectionDist : CONFIG.desktop.connectionDist;

    // Start chain from bottom-right
    const waves = computeChainOrder(particles, w, h, connectionDist);
    const now = performance.now();

    transitionRef.current = "despawning";

    let totalDelay = 0;
    for (const wave of waves) {
      const waveDelay = totalDelay;
      const timer = setTimeout(() => {
        for (const idx of wave) {
          const p = particles[idx];
          p.targetOpacity = 0;
          p.spawnTime = performance.now();
          p.spawnDelay = 0;

          // Create a small explosion for each particle in this wave
          const scale = CONFIG.baseDepth / (CONFIG.baseDepth + p.z);
          const projX = (p.x - w / 2) * scale + w / 2;
          const projY = (p.y - h / 2) * scale + h / 2;

          explosionsRef.current.push({
            x: projX,
            y: projY,
            progress: 0,
            maxRadius: 30 + Math.random() * 30, // Smaller explosions for chain
            particleIndex: idx,
          });
        }
      }, waveDelay);
      chainTimersRef.current.push(timer);
      totalDelay += CONFIG.chain.waveDelay;
    }

    // Complete after all waves + fade time
    const finishTimer = setTimeout(() => {
      transitionRef.current = "hidden";
      onComplete();
    }, totalDelay + CONFIG.chain.despawnDuration + 200);
    chainTimersRef.current.push(finishTimer);
  }, []);

  // ─── Explosion scheduling (ambient, only when idle) ──────
  const scheduleNextExplosion = useCallback(() => {
    const { minDelay, maxDelay } = CONFIG.explosion;
    const delay = minDelay + Math.random() * (maxDelay - minDelay);

    explosionTimerRef.current = setTimeout(() => {
      // Only fire ambient explosions when fully idle
      if (transitionRef.current !== "idle") {
        scheduleNextExplosion();
        return;
      }

      const particles = particlesRef.current;
      if (particles.length === 0) return;

      const w = window.innerWidth;
      const h = window.innerHeight;

      const idx = Math.floor(Math.random() * particles.length);
      const p = particles[idx];

      const scale = CONFIG.baseDepth / (CONFIG.baseDepth + p.z);
      const projX = (p.x - w / 2) * scale + w / 2;
      const projY = (p.y - h / 2) * scale + h / 2;

      explosionsRef.current.push({
        x: projX,
        y: projY,
        progress: 0,
        maxRadius: CONFIG.explosion.maxRadius * (0.7 + Math.random() * 0.6),
        particleIndex: idx,
      });

      const { scatterForce, scatterRadius } = CONFIG.explosion;
      for (let i = 0; i < particles.length; i++) {
        if (i === idx) continue;
        const other = particles[i];
        const dx = other.x - p.x;
        const dy = other.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < scatterRadius && dist > 0) {
          const force = (1 - dist / scatterRadius) * scatterForce;
          const angle = Math.atan2(dy, dx);
          other.vx += Math.cos(angle) * force;
          other.vy += Math.sin(angle) * force;
        }
      }

      p.x = Math.random() * w;
      p.y = Math.random() * h;
      p.z = Math.random() * CONFIG.baseDepth;
      p.vx = (Math.random() - 0.5) * CONFIG.speed;
      p.vy = (Math.random() - 0.5) * CONFIG.speed;
      p.vz = (Math.random() - 0.5) * CONFIG.speed * 0.5;
      p.baseSize = Math.random() * 2.5 + 1.5;

      scheduleNextExplosion();
    }, delay);
  }, []);

  // ─── Main animation loop ─────────────────────────────────
  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    handleResize();
    initParticles();

    // Determine initial animation based on reducedMotion state
    if (!reducedMotion) {
      triggerChainSpawn();
      scheduleNextExplosion();
    } else {
      // If mounting with reducedMotion already on, stay hidden
      transitionRef.current = "hidden";
      for (const p of particlesRef.current) p.opacity = 0;
    }

    const onResize = () => {
      handleResize();
      // Don't reinit particles during transitions
      if (transitionRef.current === "idle") {
        initParticles();
        triggerChainSpawn();
      }
    };
    window.addEventListener("resize", onResize);

    const onMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return;
      rawMouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawMouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMouseMove);

    let lastTime = performance.now();

    // ─── Render Loop ────────────────────────────────────────
    const render = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const color = getHSLFromCSSVar("--foreground");
      const pX = springX.get() * CONFIG.parallaxStrength;
      const pY = springY.get() * CONFIG.parallaxStrength;
      const particles = particlesRef.current;
      const isMob = w < 768;
      const maxDist = isMob ? CONFIG.mobile.connectionDist : CONFIG.desktop.connectionDist;

      // ─── Update particle opacities based on transition ────
      for (const p of particles) {
        if (p.targetOpacity > p.opacity) {
          // Spawning: respect spawn delay
          const elapsed = now - p.spawnTime - p.spawnDelay;
          if (elapsed > 0) {
            p.opacity = Math.min(1, elapsed / CONFIG.chain.spawnDuration);
          }
        } else if (p.targetOpacity < p.opacity) {
          // Despawning: fade out quickly
          p.opacity = Math.max(0, p.opacity - dt / CONFIG.chain.despawnDuration);
        }
      }

      // ─── Dampen scattered velocities ──────────────────────
      const dampFactor = Math.pow(0.97, dt / 16);
      for (const p of particles) {
        const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (currentSpeed > CONFIG.speed * 1.5) {
          p.vx *= dampFactor;
          p.vy *= dampFactor;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (p.x < -50) p.x = w + 50;
        if (p.x > w + 50) p.x = -50;
        if (p.y < -50) p.y = h + 50;
        if (p.y > h + 50) p.y = -50;
        if (p.z < 0) p.z = CONFIG.baseDepth;
        if (p.z > CONFIG.baseDepth) p.z = 0;
      }

      // Pre-project
      const projected = particles.map((p, i) => {
        const scale = CONFIG.baseDepth / (CONFIG.baseDepth + p.z);
        return {
          x: (p.x - w / 2) * scale + w / 2 + pX * scale,
          y: (p.y - h / 2) * scale + h / 2 + pY * scale,
          scale,
          size: p.baseSize * scale,
          opacity: particles[i].opacity,
        };
      });

      // ─── Draw connections (opacity-aware) ─────────────────
      ctx.lineWidth = CONFIG.lineWidth;
      for (let i = 0; i < projected.length; i++) {
        const a = projected[i];
        if (a.opacity <= 0) continue;
        for (let j = i + 1; j < projected.length; j++) {
          const b = projected[j];
          if (b.opacity <= 0) continue;

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const fade = 1 - dist / maxDist;
            const avgScale = (a.scale + b.scale) / 2;
            const pairOpacity = Math.min(a.opacity, b.opacity);
            const alpha = fade * avgScale * CONFIG.lineOpacity * pairOpacity;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `hsla(${color}, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      // ─── Draw nodes (opacity-aware) ───────────────────────
      for (const pt of projected) {
        if (pt.opacity <= 0) continue;
        const alpha = pt.scale * CONFIG.nodeOpacity * pt.opacity;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${color}, ${alpha})`;
        ctx.fill();
      }

      // ─── Draw & update explosions ─────────────────────────
      const explosions = explosionsRef.current;
      for (let i = explosions.length - 1; i >= 0; i--) {
        const exp = explosions[i];

        exp.progress += dt / CONFIG.explosion.duration;
        if (exp.progress >= 1) {
          explosions.splice(i, 1);
          continue;
        }

        const t = exp.progress;
        const easedRadius = easeOutQuart(t) * exp.maxRadius;
        const fadeOut = 1 - easeOutCubic(t);

        // Central glow flash
        const glowRadius = Math.max(easedRadius * 0.6, 1);
        const glowAlpha = fadeOut * CONFIG.explosion.flashIntensity;
        const gradient = ctx.createRadialGradient(
          exp.x, exp.y, 0,
          exp.x, exp.y, glowRadius
        );
        gradient.addColorStop(0, `hsla(${color}, ${glowAlpha})`);
        gradient.addColorStop(0.4, `hsla(${color}, ${glowAlpha * 0.4})`);
        gradient.addColorStop(1, `hsla(${color}, 0)`);

        ctx.beginPath();
        ctx.arc(exp.x, exp.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Expanding shockwave ring
        const ringAlpha = fadeOut * 0.35;
        const ringWidth = 1.5 + (1 - fadeOut) * 1;
        ctx.beginPath();
        ctx.arc(exp.x, exp.y, easedRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${color}, ${ringAlpha})`;
        ctx.lineWidth = ringWidth;
        ctx.stroke();

        // Scatter sparks
        const sparkCount = 6;
        for (let s = 0; s < sparkCount; s++) {
          const angle = (s / sparkCount) * Math.PI * 2 + t * 0.5;
          const sparkDist = easedRadius * (0.5 + Math.random() * 0.5);
          const sparkX = exp.x + Math.cos(angle) * sparkDist;
          const sparkY = exp.y + Math.sin(angle) * sparkDist;
          const sparkAlpha = fadeOut * 0.5;
          const sparkSize = (1 - t) * 1.5;

          ctx.beginPath();
          ctx.arc(sparkX, sparkY, sparkSize, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${color}, ${sparkAlpha})`;
          ctx.fill();
        }
      }

      ctx.lineWidth = CONFIG.lineWidth;
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (explosionTimerRef.current) clearTimeout(explosionTimerRef.current);
      clearChainTimers();
    };
  }, [mounted, handleResize, initParticles, triggerChainSpawn, scheduleNextExplosion, clearChainTimers, rawMouseX, rawMouseY, springX, springY]);

  // ─── Handle reducedMotion transitions ─────────────────────
  useEffect(() => {
    if (!mounted) return;

    const prev = prevReducedMotionRef.current;
    prevReducedMotionRef.current = reducedMotion;

    if (prev === reducedMotion) return; // No change

    if (reducedMotion && !prev) {
      // Turning ON → chain despawn
      clearChainTimers();
      if (explosionTimerRef.current) {
        clearTimeout(explosionTimerRef.current);
        explosionTimerRef.current = null;
      }
      triggerChainDespawn(() => {
        // After despawn completes, everything stays rendered but invisible
      });
    } else if (!reducedMotion && prev) {
      // Turning OFF → reinitialize particles and chain spawn
      clearChainTimers();
      initParticles();
      triggerChainSpawn();
      scheduleNextExplosion();
    }
  }, [reducedMotion, mounted, clearChainTimers, triggerChainDespawn, triggerChainSpawn, initParticles, scheduleNextExplosion]);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          opacity: CONFIG.canvasOpacity,
        }}
      />
    </div>
  );
}
