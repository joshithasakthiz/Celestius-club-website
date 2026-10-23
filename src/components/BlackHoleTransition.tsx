/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';

interface BlackHoleTransitionProps {
  onMidpoint?: () => void;
  onComplete: () => void;
}

export const BlackHoleTransition: React.FC<BlackHoleTransitionProps> = ({
  onMidpoint,
  onComplete,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const midpointFiredRef = useRef<boolean>(false);
  const completedRef = useRef<boolean>(false);
  const [opacity, setOpacity] = useState<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Remove all audio completely and fast forward playback speed to 2.0x
    // (Plays the 3.0s video in a brisk, snappy ~1.5s)
    video.muted = true;
    video.volume = 0;
    video.playbackRate = 2.0;

    // Fast, smooth entry fade-in (60ms) so there's zero harsh flash
    const enterTimer = setTimeout(() => {
      setOpacity(1);
    }, 20);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback in case of browser autoplay policy restriction
        triggerMidpoint();
        setTimeout(finishTransition, 1500);
      });
    }

    // Safety timeout at 1.6s in case onended is delayed
    const maxTimer = setTimeout(() => {
      finishTransition();
    }, 1600);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(maxTimer);
    };
  }, []);

  const triggerMidpoint = () => {
    if (!midpointFiredRef.current) {
      midpointFiredRef.current = true;
      if (onMidpoint) {
        onMidpoint();
      }
    }
  };

  const finishTransition = () => {
    if (!completedRef.current) {
      completedRef.current = true;
      triggerMidpoint();
      onComplete();
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const duration = video.duration || 3.0;

    // Halfway through the 2.0x video (~0.75s real-time): seamlessly swap the page
    if (video.currentTime >= duration * 0.48) {
      triggerMidpoint();
    }

    // Smooth cinematic fade-out right near the end (~0.15s real-time before finish)
    if (video.currentTime >= duration - 0.3) {
      setOpacity(0);
    }
  };

  const handleEnded = () => {
    setOpacity(0);
    setTimeout(finishTransition, 50);
  };

  const handleError = () => {
    triggerMidpoint();
    finishTransition();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-[#040714] pointer-events-auto select-none transition-opacity duration-200 flex items-center justify-center"
      style={{ opacity }}
    >
      {/* 
        3-second black-hole swirl video sped up to 1.25x (~2.4s).
        Kept as-is visually: no camera movement, no zoom in/out, no reframing, no distortion.
        Audio 100% removed & muted.
      */}
      <video
        ref={videoRef}
        src="/assets/aistudio/blackhole_transition_muted.mp4"
        playsInline
        muted
        autoPlay
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={handleError}
        className="w-full h-full object-cover pointer-events-none select-none"
      />
    </div>
  );
};
