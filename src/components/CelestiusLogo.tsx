/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';

interface CelestiusLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export const CelestiusLogo: React.FC<CelestiusLogoProps> = ({
  className = '',
  size = 'hero',
}) => {
  const isHero = size === 'hero';
  const [cleanedLogoSrc, setCleanedLogoSrc] = useState<string | null>(null);

  useEffect(() => {
    // Process logo image to completely remove background (chroma/luma keying)
    const img = new Image();
    img.src = '/assets/aistudio/file_000000002f8082118575764ef8d5d687_b598a61a.png';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Strip dark background pixels so only the white crescent moon,
        // letters ELESTIUS, and radiant star remain with 100% transparency.
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Perceived luminance
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;

          if (lum < 38) {
            // Background space is removed completely
            data[i + 3] = 0;
          } else if (lum < 95) {
            // Smooth gradient edge falloff for the natural glow
            const alphaFactor = (lum - 38) / (95 - 38);
            data[i + 3] = Math.round(alphaFactor * 255);
          }
          // Bright moon and lettering remain fully opaque
        }

        ctx.putImageData(imgData, 0, 0);
        setCleanedLogoSrc(canvas.toDataURL('image/png'));
      } catch (e) {
        // Fallback to original image if security/canvas restrictions
        setCleanedLogoSrc('/assets/aistudio/file_000000002f8082118575764ef8d5d687_b598a61a.png');
      }
    };

    img.onerror = () => {
      setCleanedLogoSrc('/assets/aistudio/file_000000002f8082118575764ef8d5d687_b598a61a.png');
    };
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <div
        className={`relative flex items-center justify-center ${
          isHero ? 'max-w-4xl w-full px-2 sm:px-6' : 'max-w-[220px] w-full'
        }`}
      >
        <img
          src={cleanedLogoSrc || '/assets/aistudio/file_000000002f8082118575764ef8d5d687_b598a61a.png'}
          alt="Celestius Logo"
          className="w-full h-auto object-contain pointer-events-none select-none filter drop-shadow-[0_0_30px_rgba(255,255,255,0.45)]"
        />
      </div>
    </div>
  );
};
