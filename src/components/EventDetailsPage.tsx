/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  Code2,
  Cpu,
  Bot,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Users,
  Trophy,
  ArrowRight,
} from 'lucide-react';
import { CelestiusLogo } from './CelestiusLogo.tsx';

interface EventDetailsPageProps {
  onBackToEvents: () => void;
  onBackToHome: () => void;
  onNavigateToRegister?: () => void;
  onExploreEvents?: () => void;
}

interface EventSpecification {
  id: string;
  number: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  isRightAligned: boolean;
  detailedDescription: string;
  date: string;
  time: string;
  venue: string;
  registrationDeadline: string;
  eligibility: string;
  teamSize: string;
  requiredSkills: string[];
  rules: string[];
  perks: string;
}

export const EventDetailsPage: React.FC<EventDetailsPageProps> = ({
  onBackToEvents,
  onBackToHome,
  onNavigateToRegister,
}) => {
  const eventSpecs: EventSpecification[] = [
    {
      id: 'event-1',
      number: '01',
      name: 'CodeNexus: 24-Hour Full-Stack Hackathon',
      category: 'Hackathon Sprint',
      icon: Code2,
      isRightAligned: false, // Left aligned
      detailedDescription:
        'A continuous 24-hour engineering crucible where student innovators architect, code, and deploy resilient web applications addressing real-world operational challenges. Mentors from frontier startups will be on-site offering code reviews and architecture guidance.',
      date: 'November 14 – 15, 2026',
      time: 'Starts 09:00 AM IST (24h non-stop)',
      venue: 'CIT Tech Park, Main Auditorium & Innovation Hub',
      registrationDeadline: 'November 10, 2026 · 11:59 PM IST',
      eligibility: 'All undergraduate & postgraduate engineering students with valid student ID.',
      teamSize: '2 to 4 members per team',
      requiredSkills: [
        'JavaScript / TypeScript ecosystem',
        'Frontend frameworks (React, Vue, or Next.js)',
        'Server APIs (Node.js, Express, FastAPI, or Go)',
        'Git branch workflows & GitHub pull requests',
      ],
      rules: [
        'All application code must be authored inside the allocated 24-hour sprint window.',
        'Pre-built templates or third-party proprietary solutions are strictly prohibited.',
        'Open-source public libraries and AI co-pilots are permitted with proper attribution.',
        'Teams must submit working code repositories alongside a 3-minute live demonstration.',
      ],
      perks: '₹75,000 Total Prize Pool · Direct interview tracks for summer engineering internships.',
    },
    {
      id: 'event-2',
      number: '02',
      name: 'AlgoClash: Speed Coding & DSA Championship',
      category: 'Competitive Programming',
      icon: Cpu,
      isRightAligned: true, // Right aligned - slides in from left to right
      detailedDescription:
        'A high-octane competitive programming contest designed to evaluate algorithmic efficiency, spatial-temporal complexity optimization, and mathematical ingenuity under strict time constraints.',
      date: 'November 28, 2026',
      time: '10:00 AM – 02:00 PM IST (4 Hours)',
      venue: 'CIT Advanced Computing Center, Labs 3 & 4',
      registrationDeadline: 'November 25, 2026 · 06:00 PM IST',
      eligibility: 'Open to all technical students across all departments and academic years.',
      teamSize: 'Individual participation only',
      requiredSkills: [
        'Mastery in C++, Java, or Python',
        'Standard Template Library (STL) or Collections framework',
        'Advanced Data Structures (Segment Trees, Trie, Disjoint Set)',
        'Dynamic programming & Graph traversal algorithms',
      ],
      rules: [
        'Standard ACM-ICPC style automated grading with penalty time for wrong submissions.',
        'Plagiarism checks run via automated AST similarity analysis; violations yield immediate DQ.',
        'Access to external internet resources or pre-written offline code is strictly disabled.',
      ],
      perks: '₹40,000 Cash Pool · Certified Celestius High-Performance Competitive Coder badge.',
    },
    {
      id: 'event-3',
      number: '03',
      name: 'GenAI Forge: Autonomous LLM Agents Workshop',
      category: 'Hands-on AI Lab',
      icon: Bot,
      isRightAligned: false, // Left aligned
      detailedDescription:
        'An intensive hands-on workshop guiding participants through the engineering of production-grade autonomous agent systems, vector indexing, retrieval-augmented generation (RAG), and multi-modal tool calling.',
      date: 'December 05, 2026',
      time: '09:30 AM – 04:30 PM IST',
      venue: 'CIT Artificial Intelligence Research Center & Hall B',
      registrationDeadline: 'December 01, 2026 · 11:59 PM IST',
      eligibility: 'Students with working Python fundamentals and an interest in applied AI.',
      teamSize: 'Individual or Pairs (up to 2 members)',
      requiredSkills: [
        'Proficiency in Python syntax and asynchronous programming',
        'Working understanding of REST endpoints & JSON parsing',
        'Conceptual familiarity with prompt design and vector embeddings',
      ],
      rules: [
        'Participants must bring their personal laptop with Python 3.10+ pre-installed.',
        'Temporary API access credentials will be provisioned by the Celestius AI Wing.',
        'Active attendance throughout all hands-on exercises is required for course certification.',
      ],
      perks: 'Exclusive access to Celestius Model Compute Sandbox · Verified AI Engineer Certificate.',
    },
    {
      id: 'event-4',
      number: '04',
      name: 'CyberSiege: CTF & Defensive Security Quest',
      category: 'Cybersecurity Challenge',
      icon: ShieldCheck,
      isRightAligned: true, // Right aligned - slides in from left to right
      detailedDescription:
        'A jeopardy-format Capture The Flag (CTF) tournament immersing participants in real-world offensive and defensive security exercises spanning reverse engineering, binary exploitation, web vulnerabilities, and cipher decryption.',
      date: 'December 19, 2026',
      time: '09:00 AM – 05:00 PM IST',
      venue: 'Cyber Defense Center & Secure Network Sandbox, CIT',
      registrationDeadline: 'December 15, 2026 · 08:00 PM IST',
      eligibility: 'Open to all undergraduate students interested in ethical hacking & systems security.',
      teamSize: 'Teams of 2 to 3 members',
      requiredSkills: [
        'Linux command-line utilities & bash scripting',
        'Basic web exploitation (SQLi, XSS, CSRF, JWT validation)',
        'Fundamental cryptography (RSA, AES, XOR, hash functions)',
        'Wireshark packet analysis & network protocol basics',
      ],
      rules: [
        'Attacking the hosting infrastructure or score server results in permanent ban.',
        'Flag sharing or collusion between opposing teams is strictly prohibited.',
        'Brute-forcing submission endpoints is blocked and triggers time penalties.',
      ],
      perks: '₹50,000 Prize Bounty · Dedicated recommendation letters for InfoSec fellowships.',
    },
  ];

  return (
    <div className="relative min-h-screen text-slate-100 z-10 py-8 px-4 sm:px-6 max-w-6xl mx-auto flex flex-col">
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToEvents}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs sm:text-sm font-outfit transition-all duration-200 cursor-pointer hover:border-cyan-400"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events Carousel</span>
          </button>
          <button
            onClick={onBackToHome}
            className="text-xs text-slate-400 hover:text-slate-200 font-outfit transition-colors hidden sm:inline-block cursor-pointer"
          >
            Home Orbit
          </button>
        </div>

        <CelestiusLogo size="sm" />

        <div className="text-xs text-slate-400 font-outfit">
          Chennai Institute of Technology
        </div>
      </div>

      {/* Page Title Header */}
      <div className="text-center mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-5xl font-cinzel font-bold text-icy-purple tracking-wide">
          Event Specifications and Details
        </h1>
      </div>

      {/* 
        Event Layout:
        - 4 events displayed vertically, one after another
        - Events 1 and 3 aligned to the left
        - Events 2 and 4 aligned to the right (smoothly slide in from left to right)
        - Event headings: Icy Purple
        - Highlighted important details: Icy Blue
      */}
      <div className="flex flex-col gap-10 sm:gap-14 mb-20">
        {eventSpecs.map((evt) => {
          const Icon = evt.icon;
          const isRight = evt.isRightAligned;

          return (
            <div
              key={evt.id}
              className={`w-full flex ${isRight ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`w-full max-w-3xl glass-panel rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 ${
                  isRight ? 'animate-slide-in-right' : 'animate-fade-in-gentle'
                }`}
              >
                {/* Event Heading Lockup with Icon */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-400/40 text-purple-300 shrink-0 shadow-[0_0_12px_rgba(216,180,254,0.25)]">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
                        Event {evt.number} · {evt.category}
                      </span>
                      {/* Event Heading in Icy Purple */}
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-cinzel font-bold text-icy-purple leading-snug">
                        {evt.name}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Detailed Description */}
                <p className="mt-3 text-sm sm:text-base text-slate-300 font-jakarta leading-relaxed">
                  {evt.detailedDescription}
                </p>

                {/* Core Logistical Metadata Grid */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-5 border-t border-slate-800/80 text-xs sm:text-sm font-outfit">
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>
                      Date:{' '}
                      <strong className="text-icy-blue font-semibold">{evt.date}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>
                      Time: <span className="text-slate-200">{evt.time}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-300">
                    <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>
                      Venue:{' '}
                      <strong className="text-icy-blue font-semibold">{evt.venue}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-300">
                    <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>
                      Deadline:{' '}
                      <strong className="text-icy-blue font-semibold">
                        {evt.registrationDeadline}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Users className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>
                      Team Format: <span className="text-slate-200">{evt.teamSize}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Trophy className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>
                      Eligibility: <span className="text-slate-200">{evt.eligibility}</span>
                    </span>
                  </div>
                </div>

                {/* Required Skills Section */}
                <div className="mt-6 pt-5 border-t border-slate-800/80">
                  <h4 className="text-xs uppercase font-cinzel tracking-wider text-slate-400 font-semibold mb-2.5">
                    Required Skills & Knowledge:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {evt.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-slate-900/90 text-slate-200 border border-slate-700/60 font-outfit"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rules & Guidelines */}
                <div className="mt-6 pt-5 border-t border-slate-800/80">
                  <h4 className="text-xs uppercase font-cinzel tracking-wider text-slate-400 font-semibold mb-2.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Event Rules & Guidelines:</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300 font-jakarta leading-relaxed list-disc list-inside">
                    {evt.rules.map((rule, idx) => (
                      <li key={idx} className="marker:text-blue-400">
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Incentives / Perks */}
                <div className="mt-5 pt-3 flex items-center justify-between text-xs text-slate-400 font-outfit border-t border-slate-800/50">
                  <span>
                    Recognition:{' '}
                    <strong className="text-icy-blue font-medium">{evt.perks}</strong>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action: Register Now Button */}
      <div className="mt-6 mb-16 py-10 px-6 rounded-2xl glass-panel border border-purple-500/30 text-center flex flex-col items-center max-w-2xl mx-auto shadow-[0_0_30px_rgba(216,180,254,0.15)]">
        <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-white tracking-wide">
          Ready to Compete?
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-300 font-jakarta max-w-lg">
          Secure your team or individual slot in Celestius 2026. Review the specifications above and claim your participation.
        </p>
        <button
          onClick={onNavigateToRegister}
          className="mt-6 group relative inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl font-cinzel font-semibold tracking-wider uppercase text-sm sm:text-base text-purple-100 bg-purple-950/70 hover:bg-purple-900/80 border border-purple-400/80 shadow-[0_0_25px_rgba(216,180,254,0.4)] hover:shadow-[0_0_40px_rgba(216,180,254,0.8)] hover:text-white hover:border-purple-300 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span className="relative z-10 flex items-center gap-2">
            Register Now
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-purple-300" />
          </span>
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-8 text-center text-xs text-slate-400 font-outfit border-t border-slate-800/60">
        © 2026 Celestius Technical Club · Chennai Institute of Technology
      </footer>
    </div>
  );
};
