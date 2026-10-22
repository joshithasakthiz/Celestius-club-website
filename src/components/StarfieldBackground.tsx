/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  baseRadius: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
  hasFlare: boolean;
  flareTimer: number;
  flareDuration: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  active: boolean;
}

export const StarfieldBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener('resize', handleResize);

    const colors = [
      '#ffffff', // pure white
      '#e0f2fe', // ice white
      '#bae6fd', // icy blue
      '#7dd3fc', // celestial blue
      '#ddd6fe', // soft purple
    ];

    let stars: Star[] = [];
    let shootingStar: ShootingStar = {
      x: 0,
      y: 0,
      length: 0,
      speed: 0,
      angle: 0,
      alpha: 0,
      active: false,
    };
    let nextShootingStarTime = Date.now() + 8000;

    const initStars = () => {
      // Star count: not too crowded as requested (approx 70-95 on standard screen)
      const count = Math.min(105, Math.max(50, Math.floor((width * height) / 18000)));
      stars = [];

      for (let i = 0; i < count; i++) {
        const hasFlare = Math.random() < 0.18; // Some stars have occasional flares
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseRadius: Math.random() * 1.5 + 0.6,
          baseAlpha: Math.random() * 0.45 + 0.35,
          alpha: 0.5,
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          hasFlare,
          flareTimer: Math.random() * 500,
          flareDuration: 60,
        });
      }
    };

    initStars();

    const triggerShootingStar = () => {
      shootingStar = {
        x: Math.random() * width * 0.7,
        y: Math.random() * height * 0.4,
        length: Math.random() * 80 + 70,
        speed: Math.random() * 9 + 11,
        angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
        alpha: 1,
        active: true,
      };
      nextShootingStarTime = Date.now() + 14000 + Math.random() * 10000;
    };

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Deep space background gradient: dark navy blue & purple mixed color
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#030712'); // Deepest dark navy black
      gradient.addColorStop(0.35, '#060a22'); // Dark navy blue
      gradient.addColorStop(0.7, '#13092b'); // Rich royal purple
      gradient.addColorStop(1, '#080518'); // Midnight violet
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Render Stars with occasional gentle twinkling
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.twinklePhase += star.twinkleSpeed;
        
        // Occasional non-monotonic twinkle
        const wave = Math.sin(star.twinklePhase);
        const intensity = Math.pow((wave + 1) / 2, 2.5); // Sharpens peak twinkle
        star.alpha = star.baseAlpha + intensity * (1 - star.baseAlpha);

        // Core star circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.baseRadius * (0.85 + intensity * 0.35), 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.min(1, Math.max(0.15, star.alpha));
        ctx.shadowColor = star.color;
        ctx.shadowBlur = 8 * intensity;
        ctx.fill();

        // Occasional 4-point diffraction spike flare during high intensity
        if (star.hasFlare && intensity > 0.82) {
          const flareLen = (star.baseRadius + 6) * (intensity - 0.7) * 4;
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 0.75;
          ctx.globalAlpha = (intensity - 0.8) * 3;

          // Horizontal spike
          ctx.beginPath();
          ctx.moveTo(star.x - flareLen, star.y);
          ctx.lineTo(star.x + flareLen, star.y);
          ctx.stroke();

          // Vertical spike
          ctx.beginPath();
          ctx.moveTo(star.x, star.y - flareLen);
          ctx.lineTo(star.x, star.y + flareLen);
          ctx.stroke();
        }

        ctx.restore();
      }

      // Check shooting star
      if (!shootingStar.active && Date.now() > nextShootingStarTime) {
        triggerShootingStar();
      }

      if (shootingStar.active) {
        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.alpha -= 0.015;

        if (
          shootingStar.alpha <= 0 ||
          shootingStar.x > width + 100 ||
          shootingStar.y > height + 100
        ) {
          shootingStar.active = false;
        } else {
          ctx.save();
          const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
          const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

          const streakGrad = ctx.createLinearGradient(
            tailX,
            tailY,
            shootingStar.x,
            shootingStar.y
          );
          streakGrad.addColorStop(0, 'rgba(125, 211, 252, 0)');
          streakGrad.addColorStop(1, `rgba(255, 255, 255, ${shootingStar.alpha})`);

          ctx.strokeStyle = streakGrad;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(shootingStar.x, shootingStar.y);
          ctx.stroke();
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic Canvas Stars */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* High-res User Space Nebula Image Overlay for authentic nebula dust */}
      <div
        className="absolute inset-0 bg-cover bg-center mix-blend-screen opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            'url(/assets/aistudio/Gemini_Generated_Image_zelvgszelvgszelv_91caeb67.png)',
        }}
      />

      {/* Gentle cosmic radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-900/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-2/3 right-10 w-[500px] h-[500px] bg-cyan-900/15 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
};
