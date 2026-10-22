/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const TaglineSection: React.FC = () => {
  const words = [
    { text: 'innovate', delay: '0.1s' },
    { text: 'build', delay: '0.3s' },
    { text: 'collaborate', delay: '0.5s' },
  ];

  return (
    <section className="relative my-8 sm:my-14 flex flex-col items-center justify-center text-center px-4">
      {/* Decorative crystal refraction backdrop light */}
      <div className="absolute -inset-4 max-w-xl mx-auto h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col items-center gap-3 sm:gap-5 md:gap-6">
        {words.map(({ text, delay }) => (
          <div
            key={text}
            className="group flex items-center justify-center gap-3 sm:gap-4 md:gap-5 transition-transform duration-300 hover:scale-[1.03]"
            style={{ animationDelay: delay }}
          >
            {/* Small Glowing Lightning Symbol */}
            <div className="relative flex items-center justify-center">
              {/* Lightning aura */}
              <div className="absolute inset-0 bg-cyan-400/40 blur-md rounded-full transform scale-125 group-hover:scale-150 transition-transform duration-300" />
              
              <svg
                className="w-5 h-5 sm:w-8 sm:h-8 md:w-9 md:h-9 relative z-10 text-cyan-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.9)] transition-colors duration-200 group-hover:text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="0.5"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
              </svg>
            </div>

            {/* Crystal / Glass Word */}
            <span
              className="crystal-text text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-cinzel font-bold lowercase tracking-wider select-none"
              style={{
                /* Crystal glass refraction styling */
                textTransform: 'lowercase',
              }}
            >
              {text}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
