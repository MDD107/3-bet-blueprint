import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';

// Lightweight canvas-free fireworks: rockets launch from the bottom of the
// screen and explode into gravity-pulled sparks. Rendered as plain Views in
// one overlay layer behind the quiz content (pointerEvents="none").
// Exposes burst() for a single firework and barrage() for a big celebration.

const { width: W, height: H } = Dimensions.get('window');

const PALETTE = ['#ffd700', '#ff4757', '#00d2ff', '#ff6bff', '#7bed9f', '#ffa502', '#ffffff'];
const MAX_PARTICLES = 380;

let nextId = 1;

const Fireworks = forwardRef(function Fireworks(props, ref) {
  const [, setTick] = useState(0);
  const parts = useRef([]);
  const raf = useRef(null);
  const last = useRef(0);
  const mounted = useRef(true);
  const timers = useRef([]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (raf.current) cancelAnimationFrame(raf.current);
      timers.current.forEach(clearTimeout);
    };
  }, []);

  function explode(x, y, color, arr) {
    const n = 38;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.random() * 0.35;
      const sp = 110 + Math.random() * 170;
      arr.push({
        id: nextId++, type: 'spark', x, y,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: 0.9 + Math.random() * 0.7, maxLife: 1.6,
        color: Math.random() < 0.8 ? color : '#ffffff',
        size: 4 + Math.random() * 3,
      });
    }
    // white flash at the explosion core
    arr.push({ id: nextId++, type: 'flash', x, y, vx: 0, vy: 0, life: 0.16, maxLife: 0.16, color: '#ffffff', size: 30 });
  }

  function loop(now) {
    const dt = Math.min(0.05, last.current ? (now - last.current) / 1000 : 0.016);
    last.current = now;
    const alive = [];
    for (const p of parts.current) {
      p.life -= dt;
      if (p.life <= 0) continue;
      if (p.type === 'rocket') {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (Math.random() < 0.45 && alive.length < MAX_PARTICLES) {
          alive.push({
            id: nextId++, type: 'trail', x: p.x, y: p.y + 4,
            vx: (Math.random() - 0.5) * 24, vy: 40 + Math.random() * 40,
            life: 0.35, maxLife: 0.35, color: p.color, size: 3,
          });
        }
        if (p.y <= p.targetY) {
          if (alive.length < MAX_PARTICLES) explode(p.x, p.y, p.color, alive);
          continue; // rocket is consumed by its explosion
        }
      } else if (p.type === 'spark' || p.type === 'trail') {
        p.vy += 300 * dt; // gravity
        p.vx *= 1 - 0.6 * dt; // drag
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
      // 'flash' just sits and fades
      alive.push(p);
    }
    parts.current = alive;
    if (mounted.current) setTick(t => t + 1);
    raf.current = alive.length && mounted.current ? requestAnimationFrame(loop) : null;
    if (!raf.current) parts.current = [];
  }

  function kick() {
    if (!raf.current && mounted.current) {
      last.current = 0;
      raf.current = requestAnimationFrame(loop);
    }
  }

  function launch() {
    if (!mounted.current || parts.current.length >= MAX_PARTICLES) return;
    const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    parts.current.push({
      id: nextId++, type: 'rocket',
      x: W * (0.12 + Math.random() * 0.76), y: H + 12,
      vx: (Math.random() - 0.5) * 36,
      vy: -(H * (0.5 + Math.random() * 0.22)),
      targetY: H * (0.12 + Math.random() * 0.32),
      life: 6, maxLife: 6, color, size: 5,
    });
    kick();
  }

  function later(fn, ms) {
    timers.current.push(setTimeout(() => { if (mounted.current) fn(); }, ms));
  }

  useImperativeHandle(ref, () => ({
    // one pretty firework (a couple of rockets for a fuller look)
    burst() {
      launch();
      later(launch, 160);
    },
    // big celebration: a staggered barrage across the sky
    barrage() {
      for (let i = 0; i < 11; i++) later(launch, i * 150);
    },
  }), []);

  return (
    <View style={styles.layer} pointerEvents="none">
      {parts.current.map(p => {
        const fade = p.maxLife > 0 ? Math.max(0, Math.min(1, p.life / (p.maxLife * 0.7))) : 1;
        const opacity = p.type === 'flash' ? fade * 0.9 : fade;
        const s = p.size;
        return (
          <View
            key={p.id}
            style={{
              position: 'absolute',
              left: p.x - s / 2,
              top: p.y - s / 2,
              width: s,
              height: s,
              borderRadius: s / 2,
              backgroundColor: p.type === 'rocket' ? '#fffbe8' : p.color,
              opacity,
            }}
          />
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Fireworks;
