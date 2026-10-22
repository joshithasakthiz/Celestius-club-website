/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Layers, LayoutGrid, CheckCircle2, Zap } from 'lucide-react';
import { CelestiusLogo } from './CelestiusLogo.tsx';

interface EventsPageProps {
  onBackToHome: () => void;
  onViewEventDetails?: () => void;
}

interface TechnicalEvent {
  id: string;
  number: string;
  name: string;
  category: string;
  shortDescription: string;
  skillsRequired: string[];
}

export const EventsPage: React.FC<EventsPageProps> = ({ onBackToHome, onViewEventDetails }) => {
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'stacked' | 'grid'>('stacked');
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  // 4 technical events: hackathons, coding competitions, workshops, AI/tech challenges
  // Note: Date and venue are omitted as they will be revealed on the next page
  const events: TechnicalEvent[] = [
    {
      id: 'event-1',
      number: '01',
      name: 'CodeNexus: 24-Hour Full-Stack Hackathon',
      category: 'Hackathon Sprint',
      shortDescription:
        'A high-intensity 24-hour sprint where student teams design, engineer, and deploy production-ready web and distributed applications solving campus and community challenges.',
      skillsRequired: [
        'JavaScript or TypeScript',
        'Frontend Framework (React, Vue, or Next.js)',
        'Node.js or Python backend',
        'Git & GitHub collaboration',
      ],
    },
    {
      id: 'event-2',
      number: '02',
      name: 'AlgoClash: Speed Coding & DSA Championship',
      category: 'Competitive Programming',
      shortDescription:
        'A fast-paced algorithmic battleground challenging your speed, precision, and mastery over complex data structures, dynamic programming, and combinatorial mathematics.',
      skillsRequired: [
        'Proficiency in C++, Java, or Python',
        'Core Data Structures (Trees, Graphs, Heaps)',
        'Algorithm Design & Big-O Optimization',
      ],
    },
    {
      id: 'event-3',
      number: '03',
      name: 'GenAI Forge: Autonomous LLM Agents Workshop',
      category: 'Hands-on AI Lab',
      shortDescription:
        'Deep-dive interactive lab where you will construct tool-calling autonomous AI agents, multi-modal vision pipelines, and RAG memory architectures using state-of-the-art APIs.',
      skillsRequired: [
        'Fundamental Python programming',
        'REST API integration & JSON handling',
        'Basic Machine Learning intuition',
      ],
    },
    {
      id: 'event-4',
      number: '04',
      name: 'CyberSiege: CTF & Defensive Security Quest',
      category: 'Cybersecurity Challenge',
      shortDescription:
        'A jeopardy-style cybersecurity tournament testing your skills in web vulnerability exploitation, cryptographic cipher decryption, reverse engineering, and digital forensics.',
      skillsRequired: [
        'Linux command line fundamentals',
        'Basic web security concepts (OWASP Top 10)',
        'Introductory cryptography & networking basics',
      ],
    },
  ];

  // The ENTIRE front card is clickable: taps anywhere smoothly moves the current card away/backward and brings the next forward
  const handleWholeCardClick = () => {
    if (viewMode !== 'stacked' || isSwapping) return;
    setIsSwapping(true);
    // Card 1 -> Card 2 -> Card 3 -> Card 4 -> Card 1
    setActiveCardIndex((prev) => (prev + 1) % events.length);
    setTimeout(() => setIsSwapping(false), 450);
  };

  return (
    <div className="relative min-h-screen text-slate-100 z-10 py-8 px-4 sm:px-6 max-w-5xl mx-auto flex flex-col">
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-cyan-500/20">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-sm font-outfit transition-all duration-200 cursor-pointer hover:border-cyan-400"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Celestius Orbit</span>
        </button>

        <CelestiusLogo size="sm" />

        {/* View Mode Toggle: "View All Events" Button at the Top */}
        <button
          onClick={() => setViewMode(viewMode === 'stacked' ? 'grid' : 'stacked')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-200 border border-cyan-400/60 text-xs sm:text-sm font-outfit font-medium shadow-[0_0_15px_rgba(56,189,248,0.25)] hover:shadow-[0_0_25px_rgba(56,189,248,0.5)] transition-all cursor-pointer"
        >
          {viewMode === 'stacked' ? (
            <>
              <LayoutGrid className="w-4 h-4 text-cyan-300" />
              <span>View All Events</span>
            </>
          ) : (
            <>
              <Layers className="w-4 h-4 text-cyan-300" />
              <span>Show Stacked Carousel</span>
            </>
          )}
        </button>
      </div>

      {/* Hero Header */}
      <div className="text-center mb-10 sm:mb-14">
        <h1 className="text-3xl sm:text-5xl font-cinzel font-bold text-white tracking-wide">
          Upcoming Events & Expeditions
        </h1>

        {/* Description in Icy Blue Color */}
        <p className="mt-3 text-icy-blue max-w-2xl mx-auto font-jakarta text-base sm:text-lg md:text-xl font-normal leading-relaxed">
          Connect, innovate, and test your mettle with the technical minds at CIT.
        </p>
      </div>

      {/* Main Content Area: Stacked Carousel OR View All Grid */}
      {viewMode === 'stacked' ? (
        <div className="relative w-full max-w-xl mx-auto min-h-[460px] sm:min-h-[500px] flex flex-col items-center">
          {/* Subtle instruction indicator */}
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/60 border border-cyan-500/30 text-xs text-slate-300 font-outfit">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tap anywhere on the card to cycle ({activeCardIndex + 1} of 4)</span>
          </div>

          {/* Stacked Cards Container */}
          <div className="relative w-full h-[380px] sm:h-[400px] select-none">
            {events.map((event, index) => {
              // Calculate offset relative to currently active card
              const offset = (index - activeCardIndex + events.length) % events.length;
              const isFront = offset === 0;

              // Top card is fully visible; subsequent cards peek underneath with scale and vertical offset
              const translateY = offset * 20;
              const scale = 1 - offset * 0.05;
              const opacity = offset === 0 ? 1 : offset === 1 ? 0.75 : offset === 2 ? 0.45 : 0.2;
              const zIndex = 30 - offset * 5;

              return (
                <div
                  key={event.id}
                  onClick={isFront ? handleWholeCardClick : undefined}
                  style={{
                    transform: `translateY(${translateY}px) scale(${scale})`,
                    zIndex,
                    opacity,
                  }}
                  className={`absolute inset-0 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] glass-panel ${
                    isFront
                      ? 'cursor-pointer border-cyan-400/70 shadow-[0_0_35px_rgba(56,189,248,0.3)] hover:border-cyan-300 hover:shadow-[0_0_50px_rgba(56,189,248,0.45)]'
                      : 'pointer-events-none border-cyan-500/20'
                  }`}
                  role={isFront ? 'button' : undefined}
                  tabIndex={isFront ? 0 : -1}
                  aria-label={isFront ? `Event ${event.name}. Tap anywhere to see next event.` : undefined}
                  onKeyDown={(e) => {
                    if (isFront && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleWholeCardClick();
                    }
                  }}
                >
                  {/* Card Content */}
                  <div className="pointer-events-none">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="text-xs font-semibold tracking-widest text-cyan-300 font-cinzel uppercase bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-500/30">
                        {event.category}
                      </span>
                      <span className="font-mono text-xs text-slate-400">
                        Event {event.number} / 04
                      </span>
                    </div>

                    {/* Event Name */}
                    <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-white leading-snug">
                      {event.name}
                    </h2>

                    {/* Short Description */}
                    <p className="mt-3 text-sm text-slate-300 font-jakarta leading-relaxed">
                      {event.shortDescription}
                    </p>

                    {/* Basic Skills/Knowledge Required */}
                    <div className="mt-5 pt-4 border-t border-slate-800/80">
                      <p className="text-xs uppercase tracking-wider text-slate-400 font-cinzel font-semibold mb-2">
                        Basic Skills / Knowledge Required:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {event.skillsRequired.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-slate-900/90 text-cyan-200 border border-cyan-500/30 font-outfit"
                          >
                            <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                            <span>{skill}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Date and venue removed */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-outfit pointer-events-none">
                    <span className="text-cyan-300/80 font-medium">Schedule to be announced</span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {event.number} of 04
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Dots */}
          <div className="flex items-center gap-2 mt-8 z-40">
            {events.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveCardIndex(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activeCardIndex === i
                    ? 'w-6 bg-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]'
                    : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Go to event ${i + 1}`}
                aria-label={`Jump to event ${i + 1}`}
              />
            ))}
          </div>
        </div>
      ) : (
        /* View All Events: Clean Responsive 2x2 Grid Layout (Without date & venue) */
        <div className="w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-cinzel font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>All 4 Celestius Technical Challenges</span>
            </h2>
            <span className="text-xs text-slate-400 font-outfit">Showing all events</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
            {events.map((event) => (
              <div
                key={event.id}
                className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col justify-between border border-cyan-500/25 hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-xs uppercase tracking-widest text-cyan-300 font-cinzel font-semibold bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-500/30">
                      {event.category}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      #{event.number}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-white group-hover:text-cyan-200 transition-colors">
                    {event.name}
                  </h3>

                  <p className="mt-3 text-sm text-slate-300 font-jakarta leading-relaxed">
                    {event.shortDescription}
                  </p>

                  <div className="mt-5 pt-4 border-t border-slate-800">
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-cinzel font-semibold mb-2">
                      Basic Skills / Knowledge Required:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {event.skillsRequired.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded bg-slate-900/90 text-cyan-200 border border-cyan-500/30 font-outfit"
                        >
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          <span>{skill}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-outfit">
                  <span className="text-cyan-300 font-medium">Dates & Venue to be revealed</span>
                  <span className="text-slate-400">Open to CIT Students</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 
        Bottom Section (Placed on 2nd web page as requested):
        Found Your Challenge?
        Your next big idea starts here. Explore the events, discover the details.
        [Explore Events] button
      */}
      <div className="mt-14 sm:mt-20 py-12 text-center flex flex-col items-center border-t border-cyan-500/20">
        <h2 className="text-2xl sm:text-4xl font-cinzel font-bold text-white tracking-wide">
          Found Your Challenge?
        </h2>

        <p className="mt-3 text-slate-300 font-jakarta text-base sm:text-lg max-w-xl">
          Your next big idea starts here. Explore the events, discover the details.
        </p>

        {/* Explore Events Button */}
        <div className="mt-8">
          <button
            onClick={onViewEventDetails}
            className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl font-cinzel font-semibold tracking-wider uppercase text-sm sm:text-base text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-400/80 shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:shadow-[0_0_40px_rgba(56,189,248,0.75)] hover:text-white hover:border-cyan-300 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="relative z-10">Explore Events</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-10 pb-4 text-center text-xs text-slate-400 font-outfit border-t border-slate-800/60">
        © 2026 Celestius Technical Club · Chennai Institute of Technology
      </div>
    </div>
  );
};
