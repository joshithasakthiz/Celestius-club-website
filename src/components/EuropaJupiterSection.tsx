/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, ArrowRight } from 'lucide-react';

interface EuropaJupiterSectionProps {
  onExploreEvents: () => void;
}

export const EuropaJupiterSection: React.FC<EuropaJupiterSectionProps> = ({
  onExploreEvents,
}) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasStartedPlaying, setHasStartedPlaying] = useState<boolean>(false);
  const [isOceanRevealed, setIsOceanRevealed] = useState<boolean>(false);

  // Automatically play when user scrolls to see the moon
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasStartedPlaying) {
          setHasStartedPlaying(true);
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.muted = true;
            videoRef.current.volume = 0;
            videoRef.current.play().catch(() => {});
          }
        }
      },
      {
        threshold: 0.25,
      }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, [hasStartedPlaying]);

  // Real-time canvas rendering:
  // Keys out the black space background of the new video (1280x720)
  // so only Europa (cracking ice & glowing ocean) and Jupiter float directly
  // on the website's space backdrop with zero sound.
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Ensure completely muted (no sound effects)
    video.muted = true;
    video.volume = 0;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');

    const render = () => {
      const cw = canvas.width;
      const ch = canvas.height;

      ctx.clearRect(0, 0, cw, ch);

      if (video.readyState >= 2 && offCtx) {
        const vw = video.videoWidth || 1280;
        const vh = video.videoHeight || 720;

        if (offCanvas.width !== vw || offCanvas.height !== vh) {
          offCanvas.width = vw;
          offCanvas.height = vh;
        }

        offCtx.clearRect(0, 0, vw, vh);
        offCtx.drawImage(video, 0, 0, vw, vh);

        try {
          const imgData = offCtx.getImageData(0, 0, vw, vh);
          const d = imgData.data;

          // Key out the dark space background from the video
          for (let i = 0; i < d.length; i += 4) {
            const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
            if (lum < 28) {
              d[i + 3] = 0; // Pure transparent background
            } else if (lum < 65) {
              d[i + 3] = Math.round(((lum - 28) / 37) * 255);
            }
          }
          offCtx.putImageData(imgData, 0, 0);
        } catch {
          // Security fallback
        }

        // Draw keyed video directly onto transparent canvas
        ctx.drawImage(offCanvas, 0, 0, cw, ch);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      // Around 4.5 seconds into the 10-second animation, the cracks glow and reveal the ocean
      if (videoRef.current.currentTime >= 4.5) {
        setIsOceanRevealed(true);
      }
    }
  };

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = true;
      videoRef.current.volume = 0;
      videoRef.current.play().catch(() => {});
      setIsOceanRevealed(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="europa-odyssey"
      className="relative max-w-5xl mx-auto px-4 sm:px-6 my-14 sm:my-20 flex flex-col items-center"
    >
      {/* 
        NO BOX! 
        Background completely removed with transparency so it blends directly into the website's space backdrop.
        Sound effects completely removed (muted).
      */}
      <div className="relative w-full max-w-4xl flex items-center justify-center mx-auto">
        {/* Hidden muted video source without sound effects */}
        <video
          ref={videoRef}
          src="/assets/aistudio/Jupiter_and_moon_ice_transforming_20261023005703_a38f8a13.mp4"
          className="hidden"
          playsInline
          muted
          autoPlay={false}
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
        />

        {/* 
          Transparent Canvas (1280 x 720, 16:9)
          Renders Europa on the left and Jupiter on the right floating directly in space
        */}
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          style={{ aspectRatio: '16 / 9' }}
          className="w-full h-auto max-h-[58vh] object-contain pointer-events-none select-none filter drop-shadow-[0_0_35px_rgba(56,189,248,0.22)]"
        />

        {/* Minimal replay button */}
        <button
          onClick={handleReplay}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/60 hover:bg-slate-900 text-cyan-300 border border-cyan-500/30 text-xs font-outfit backdrop-blur-md transition-all cursor-pointer opacity-70 hover:opacity-100"
          title="Replay moon animation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Replay</span>
        </button>
      </div>

      {/* 
        LEAVE SPACE BELOW ANIMATION.
        NO BOX! Pure blended background.
        Font style and size matched to the About Us content.
      */}
      <div
        className={`w-full max-w-3xl mt-10 sm:mt-14 text-center flex flex-col items-center transition-all duration-700 ${
          isOceanRevealed ? 'opacity-100 translate-y-0' : 'opacity-85 translate-y-0'
        }`}
      >
        {/* Animation Description: Same font style and size as About Us content */}
        <div className="space-y-3 sm:space-y-4 font-jakarta text-base sm:text-lg md:text-xl font-normal leading-relaxed sm:leading-loose">
          {/* Line 1: In icy blue colour */}
          <p className="text-icy-blue">
            Europa: Jupiter&apos;s second moon hides an ocean beneath its icy surface...
          </p>

          {/* Line 2: In white font colour with correct spelling "potential" */}
          <p className="text-white">
            You never know your hidden potential.
          </p>
        </div>

        {/* LEAVE SPACE, THEN JOIN US */}
        <div className="mt-10 sm:mt-14 space-y-4 sm:space-y-5">
          {/* JOIN US in bold (reduced size) */}
          <h3 className="text-xl sm:text-2xl md:text-3xl font-cinzel font-bold text-white tracking-wide drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
            JOIN US! discover what you are capable of.
          </h3>

          {/* Unlock your engineering, AI.. line: Same font style and size as About Us content */}
          <p className="font-jakarta text-base sm:text-lg md:text-xl font-normal text-slate-200 leading-relaxed sm:leading-loose max-w-xl mx-auto">
            Unlock your engineering, AI, and creative potential.
          </p>
        </div>

        {/* LEAVE SPACE, THEN BUTTON IN ICY BLUE */}
        <div className="mt-8 sm:mt-10">
          <button
            onClick={onExploreEvents}
            className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl font-cinzel font-semibold tracking-wider uppercase text-sm sm:text-base text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-400/80 shadow-[0_0_25px_rgba(56,189,248,0.45)] hover:shadow-[0_0_40px_rgba(56,189,248,0.8)] hover:text-white hover:border-cyan-300 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="relative z-10">explore events</span>
            <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 transition-transform relative z-10" />
          </button>
        </div>
      </div>
    </section>
  );
};
