/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';

interface BlackHoleTransitionProps {
  onComplete: () => void;
}

interface SwirlStar {
  initialRadius: number;
  initialAngle: number;
  currentRadius: number;
  currentAngle: number;
  color: string;
  size: number;
  alpha: number;
  trail: { x: number; y: number }[];
}

export const BlackHoleTransition: React.FC<BlackHoleTransitionProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [nebulaTransform, setNebulaTransform] = useState<{
    rotate: number;
    scale: number;
    blur: number;
  }>({ rotate: 0, scale: 1, blur: 2 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const centerX = width / 2;
    const centerY = height / 2;
    // maxRadius to the furthest corner
    const maxRadius = Math.hypot(centerX, centerY);

    // Star colors matching the existing starfield (white, icy blue, cyan, soft lavender)
    const starColors = ['#ffffff', '#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#ddd6fe'];

    // Generate stars distributed across the ENTIRE screen and slightly past the corners
    // This guarantees corners and outer edges are densely populated and actively swirling
    const starCount = Math.min(320, Math.max(160, Math.floor((width * height) / 5500)));
    const stars: SwirlStar[] = [];

    for (let i = 0; i < starCount; i++) {
      // Uniform distribution across full circular expanse including beyond the viewport corners
      const r = Math.sqrt(Math.random()) * (maxRadius * 1.15);
      const theta = Math.random() * Math.PI * 2;

      stars.push({
        initialRadius: r,
        initialAngle: theta,
        currentRadius: r,
        currentAngle: theta,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        size: Math.random() * 1.6 + 0.6,
        alpha: Math.random() * 0.45 + 0.45,
        trail: [],
      });
    }

    const startTime = performance.now();
    // Duration: 3000ms (~3 seconds: ~1 second faster than the previous 4.0s version)
    const totalDuration = 3000;
    let animId: number;

    const render = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / totalDuration);

      // Smooth progressive acceleration: subtle at first, then powerfully pulls inward
      const swirlFactor = Math.pow(progress, 1.95);
      const pullFactor = Math.pow(progress, 1.8);

      // Update nebula CSS transform state synchronously
      setNebulaTransform({
        rotate: swirlFactor * 52,
        scale: Math.max(0.85, 1 - pullFactor * 0.15),
        blur: 2 + progress * 7,
      });

      ctx.clearRect(0, 0, width, height);

      // 1. Dark navy blue and purple mixed space background
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#020512');
      bgGrad.addColorStop(0.35, '#050921');
      bgGrad.addColorStop(0.7, '#110729');
      bgGrad.addColorStop(1, '#070416');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Space background itself swirling across the entire screen
      // Draw subtle, deep celestial spiral dust arms (no orange/fire, strictly dark space / indigo / cyan)
      if (progress > 0.04) {
        ctx.save();
        ctx.translate(centerX, centerY);
        const spaceSwirlAngle = swirlFactor * 2.8;
        ctx.rotate(spaceSwirlAngle);

        const arms = 3;
        for (let a = 0; a < arms; a++) {
          const armOffset = (a * (Math.PI * 2)) / arms;
          ctx.beginPath();
          const steps = 40;
          for (let s = 0; s <= steps; s++) {
            const stepRad = (s / steps) * maxRadius * 1.1;
            const stepAngle = armOffset + (stepRad / maxRadius) * 2.4;
            const sx = Math.cos(stepAngle) * stepRad;
            const sy = Math.sin(stepAngle) * stepRad;
            if (s === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.strokeStyle = a % 2 === 0 ? 'rgba(56, 189, 248, 0.045)' : 'rgba(168, 85, 247, 0.04)';
          ctx.lineWidth = Math.min(60, 20 + progress * 40);
          ctx.lineCap = 'round';
          ctx.stroke();
        }
        ctx.restore();
      }

      // 3. Stars visibly swirling across the ENTIRE SCREEN, including edges and corners
      // Base global swirl rotates the entire coordinate field so corners turn visibly
      const globalSwirl = swirlFactor * 5.4;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Inward gravitational pull
        star.currentRadius = star.initialRadius * Math.max(0, 1 - pullFactor * 0.96);

        // Angular rotation increases across entire screen, with extra differential velocity near core
        const differentialSpeed = 1.0 + 420 / (star.currentRadius + 75);
        star.currentAngle = star.initialAngle + globalSwirl + swirlFactor * differentialSpeed;

        const currentX = centerX + Math.cos(star.currentAngle) * star.currentRadius;
        const currentY = centerY + Math.sin(star.currentAngle) * star.currentRadius;

        // Maintain streak trail
        star.trail.unshift({ x: currentX, y: currentY });
        const maxTrail = Math.floor(5 + progress * 9);
        if (star.trail.length > maxTrail) star.trail.pop();

        // Draw curved inward spiral motion trail
        if (star.trail.length > 1 && progress > 0.04) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(star.trail[0].x, star.trail[0].y);
          for (let t = 1; t < star.trail.length; t++) {
            ctx.lineTo(star.trail[t].x, star.trail[t].y);
          }
          ctx.strokeStyle = star.color;
          ctx.lineWidth = star.size * 0.8;
          ctx.globalAlpha = star.alpha * (1 - progress * 0.2) * 0.5;
          ctx.stroke();
          ctx.restore();
        }

        // Star core
        ctx.save();
        ctx.beginPath();
        ctx.arc(currentX, currentY, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        // Fade stars as space blacks out in the final stretch
        ctx.globalAlpha = star.alpha * (1 - Math.max(0, (progress - 0.72) / 0.28));
        ctx.shadowColor = star.color;
        ctx.shadowBlur = 5 * (1 - progress * 0.4);
        ctx.fill();
        ctx.restore();
      }

      // 4. Center gravitational darkening core
      if (progress > 0.18) {
        const centerDarknessProgress = (progress - 0.18) / 0.82;
        const darkRadius = Math.max(25, maxRadius * 0.45 * centerDarknessProgress);
        const centerGrad = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          darkRadius
        );
        centerGrad.addColorStop(0, `rgba(1, 3, 10, ${Math.min(0.95, centerDarknessProgress * 1.15)})`);
        centerGrad.addColorStop(0.55, `rgba(2, 5, 16, ${Math.min(0.65, centerDarknessProgress * 0.75)})`);
        centerGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = centerGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, darkRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Final cinematic fade: smoothly darkens to pure black only during the final few moments (~0.8s)
      if (progress > 0.70) {
        const blackOutAlpha = Math.pow((progress - 0.70) / 0.30, 1.45);
        ctx.fillStyle = `rgba(2, 4, 12, ${blackOutAlpha})`;
        ctx.fillRect(0, 0, width, height);
      }

      if (progress < 1) {
        animId = requestAnimationFrame(render);
      } else {
        onComplete();
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden pointer-events-auto select-none transition-all"
      style={{
        backdropFilter: `blur(${nebulaTransform.blur}px)`,
        WebkitBackdropFilter: `blur(${nebulaTransform.blur}px)`,
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Nebula background image smoothly swirling across entire screen and corners */}
      <div
        className="absolute inset-[-30%] bg-cover bg-center mix-blend-screen pointer-events-none opacity-30 origin-center"
        style={{
          backgroundImage:
            'url(/assets/aistudio/Gemini_Generated_Image_zelvgszelvgszelv_91caeb67.png)',
          transform: `rotate(${nebulaTransform.rotate}deg) scale(${nebulaTransform.scale})`,
        }}
      />
    </div>
  );
};
