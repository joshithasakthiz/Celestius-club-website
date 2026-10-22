/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const AboutUsSection: React.FC = () => {
  return (
    <section id="about" className="relative max-w-4xl mx-auto px-4 sm:px-6 my-12 sm:my-20">
      {/* 
        This is the ONLY translucent box on the webpage as requested:
        "ONLY IN ABOUT US I WANT BOX REST EVERYWHERE I WANT BACKGROUND BLENDED."
      */}
      <div className="glass-panel rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 relative overflow-hidden transition-all duration-300 hover:border-cyan-400/40">
        {/* Soft background cosmic glow inside card */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/10 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 blur-2xl pointer-events-none" />

        {/* Heading in Icy Blue Colour with Heading Font Size */}
        <div className="relative mb-6 sm:mb-8 text-center sm:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-icy-blue tracking-wide">
            About us..
          </h2>
          <div className="h-[2px] w-16 sm:w-20 bg-gradient-to-r from-cyan-400 to-transparent mt-2" />
        </div>

        {/* The Exact Body Content without butterfly */}
        <div className="relative font-jakarta text-base sm:text-lg md:text-xl text-slate-200 leading-relaxed sm:leading-loose">
          <p>
            Celestius is a student-driven technical community at{' '}
            <span className="font-medium text-icy-blue">
              Chennai Institute of Technology
            </span>
            , where curiosity turns into creation. From intelligent software and
            competitive engineering to artificial intelligence, we bring together students
            who{' '}
            <span className="font-semibold text-icy-blue transition-colors hover:text-white">
              learn
            </span>
            ,{' '}
            <span className="font-semibold text-icy-blue transition-colors hover:text-white">
              build
            </span>
            ,{' '}
            <span className="font-semibold text-icy-blue transition-colors hover:text-white">
              experiment
            </span>{' '}
            and grow through{' '}
            <span className="font-semibold text-icy-blue transition-colors hover:text-white">
              collaboration
            </span>
            .
          </p>
        </div>
      </div>
    </section>
  );
};
