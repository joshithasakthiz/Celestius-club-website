/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Users,
  User,
  Mail,
  School,
  GraduationCap,
  Phone,
  Calendar,
  Ticket,
  Copy,
  Download,
  ShieldAlert,
  Terminal,
  Cpu,
  Code2,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { CelestiusLogo } from './CelestiusLogo.tsx';

interface RegistrationPageProps {
  onBackToDetails: () => void;
  onBackToEvents: () => void;
  onBackToHome: () => void;
}

export interface StoredRegistration {
  id: string;
  timestamp: string;
  fullName: string;
  email: string;
  collegeName: string;
  department: string;
  yearOfStudy: string;
  contactNumber: string;
  eventId: string;
  eventName: string;
  eventCategory: string;
  teamName?: string;
  teammates?: { name: string; email: string }[];
  additionalDetails?: Record<string, string>;
  status: 'CONFIRMED';
}

const STORAGE_KEY = 'celestius_event_registrations_2026';

export const RegistrationPage: React.FC<RegistrationPageProps> = ({
  onBackToDetails,
  onBackToEvents,
  onBackToHome,
}) => {
  // Form fields state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [collegeName, setCollegeName] = useState('Chennai Institute of Technology');
  const [department, setDepartment] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('event-1');

  // Team fields
  const [teamName, setTeamName] = useState('');
  const [partnerType, setPartnerType] = useState<'solo' | 'duo'>('solo');
  const [teammate1Name, setTeammate1Name] = useState('');
  const [teammate1Email, setTeammate1Email] = useState('');
  const [teammate2Name, setTeammate2Name] = useState('');
  const [teammate2Email, setTeammate2Email] = useState('');
  const [teammate3Name, setTeammate3Name] = useState('');
  const [teammate3Email, setTeammate3Email] = useState('');

  // Event-specific requirements
  const [githubUrl, setGithubUrl] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('C++');
  const [competitiveProfile, setCompetitiveProfile] = useState('');
  const [aiExperience, setAiExperience] = useState('Intermediate');
  const [laptopOS, setLaptopOS] = useState('Linux');
  const [securitySpecialization, setSecuritySpecialization] = useState('Web Security');
  const [ctfHandle, setCtfHandle] = useState('');
  const [specialAccommodation, setSpecialAccommodation] = useState('');

  // Validation & UI State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedPass, setSubmittedPass] = useState<StoredRegistration | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [pastRegistrations, setPastRegistrations] = useState<StoredRegistration[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const eventOptions = [
    {
      id: 'event-1',
      name: 'CodeNexus: 24-Hour Full-Stack Hackathon',
      category: 'Hackathon Sprint',
      teamFormat: 'Team Event (2–4 Members)',
      badgeColor: 'border-pink-500/40 text-pink-300 bg-pink-950/40',
      icon: Code2,
    },
    {
      id: 'event-2',
      name: 'AlgoClash: Speed Coding & DSA Championship',
      category: 'Competitive Programming',
      teamFormat: 'Individual Competitive (Solo)',
      badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40',
      icon: Terminal,
    },
    {
      id: 'event-3',
      name: 'GenAI Forge: Autonomous LLM Agents Workshop',
      category: 'Hands-on AI Lab',
      teamFormat: 'Solo or Duo Lab (1–2 Members)',
      badgeColor: 'border-purple-500/40 text-purple-300 bg-purple-950/40',
      icon: Cpu,
    },
    {
      id: 'event-4',
      name: 'CyberSiege: CTF & Defensive Security Quest',
      category: 'Cybersecurity Challenge',
      teamFormat: 'Team Tournament (1–3 Members)',
      badgeColor: 'border-pink-500/40 text-pink-300 bg-pink-950/40',
      icon: ShieldCheck,
    },
  ];

  const selectedEvent =
    eventOptions.find((e) => e.id === selectedEventId) || eventOptions[0];

  // Load existing registrations from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setPastRegistrations(parsed);
        }
      }
    } catch {
      // ignore parsing error
    }
  }, [submittedPass]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = 'Full Name is required (minimum 2 characters)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errs.email = 'Valid college email address is required (e.g. name@citchennai.net)';
    }

    if (!collegeName.trim()) {
      errs.collegeName = 'College name is mandatory';
    }

    if (!department.trim()) {
      errs.department = 'Department / Course is mandatory';
    }

    if (!yearOfStudy) {
      errs.yearOfStudy = 'Please select your current year of study';
    }

    const phoneRegex = /^[0-9+ -]{10,14}$/;
    if (!contactNumber.trim() || !phoneRegex.test(contactNumber.replace(/[\s-]/g, ''))) {
      errs.contactNumber = 'Enter a valid 10-digit mobile contact number';
    }

    // Event specific validation
    if (selectedEventId === 'event-1') {
      // CodeNexus 24hr Hackathon
      if (!teamName.trim()) {
        errs.teamName = 'Team name is mandatory for CodeNexus Hackathon';
      }
      if (!teammate1Name.trim()) {
        errs.teammate1Name = 'At least 1 teammate (Member 2) is required for 2–4 member hackathon';
      }
      if (!teammate1Email.trim() || !emailRegex.test(teammate1Email.trim())) {
        errs.teammate1Email = 'Valid college email is required for Member 2';
      }
      if (!githubUrl.trim() || !githubUrl.includes('github.com')) {
        errs.githubUrl = 'Provide a valid GitHub profile or organization repository link';
      }
    } else if (selectedEventId === 'event-3' && partnerType === 'duo') {
      // GenAI Forge duo option
      if (!teammate1Name.trim()) {
        errs.teammate1Name = 'Partner name is required for duo workshop seat';
      }
      if (!teammate1Email.trim() || !emailRegex.test(teammate1Email.trim())) {
        errs.teammate1Email = 'Valid college email is required for your workshop partner';
      }
    } else if (selectedEventId === 'event-4') {
      // CyberSiege CTF
      if (!teamName.trim()) {
        errs.teamName = 'Squad / Team name is required for CyberSiege CTF';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      // Scroll to first error
      window.scrollTo({ top: 320, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Construct payload
      const teammatesList: { name: string; email: string }[] = [];
      if (teammate1Name.trim()) {
        teammatesList.push({ name: teammate1Name.trim(), email: teammate1Email.trim() });
      }
      if (teammate2Name.trim()) {
        teammatesList.push({ name: teammate2Name.trim(), email: teammate2Email.trim() });
      }
      if (teammate3Name.trim()) {
        teammatesList.push({ name: teammate3Name.trim(), email: teammate3Email.trim() });
      }

      const additionalDetails: Record<string, string> = {};
      if (selectedEventId === 'event-1') {
        additionalDetails['GitHub / Portfolio'] = githubUrl.trim();
      } else if (selectedEventId === 'event-2') {
        additionalDetails['Preferred Language'] = preferredLanguage;
        if (competitiveProfile.trim()) {
          additionalDetails['Competitive Profile'] = competitiveProfile.trim();
        }
      } else if (selectedEventId === 'event-3') {
        additionalDetails['AI Experience'] = aiExperience;
        additionalDetails['Laptop OS'] = laptopOS;
        additionalDetails['Participation Mode'] = partnerType === 'duo' ? 'Duo' : 'Individual';
      } else if (selectedEventId === 'event-4') {
        additionalDetails['Specialization'] = securitySpecialization;
        if (ctfHandle.trim()) {
          additionalDetails['CTF Handle'] = ctfHandle.trim();
        }
      }

      if (specialAccommodation.trim()) {
        additionalDetails['Special Requirements'] = specialAccommodation.trim();
      }

      // Generate verifiable registration ID
      const prefix = selectedEventId.toUpperCase().replace('-', '');
      const serial = Math.floor(1000 + Math.random() * 9000);
      const regId = `CEL-2026-${prefix}-${serial}`;

      const newRegistration: StoredRegistration = {
        id: regId,
        timestamp: new Date().toISOString(),
        fullName: fullName.trim(),
        email: email.trim(),
        collegeName: collegeName.trim(),
        department: department.trim(),
        yearOfStudy,
        contactNumber: contactNumber.trim(),
        eventId: selectedEventId,
        eventName: selectedEvent.name,
        eventCategory: selectedEvent.category,
        teamName: teamName.trim() || undefined,
        teammates: teammatesList.length > 0 ? teammatesList : undefined,
        additionalDetails,
        status: 'CONFIRMED',
      };

      // Safely persist to storage
      const existingRaw = localStorage.getItem(STORAGE_KEY);
      const existingList: StoredRegistration[] = existingRaw ? JSON.parse(existingRaw) : [];
      const updatedList = [newRegistration, ...existingList];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));

      setTimeout(() => {
        setIsSubmitting(false);
        setSubmittedPass(newRegistration);
        window.scrollTo({ top: 180, behavior: 'smooth' });
      }, 500);
    } catch {
      setIsSubmitting(false);
      setErrors({
        submit: 'Failed to record registration in storage. Please verify browser storage access.',
      });
    }
  };

  const handleCopyId = (id: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  const handleDownloadSlip = (reg: StoredRegistration) => {
    const slipText = `=====================================================
CELESTIUS 2026 — OFFICIAL REGISTRATION PASS
Chennai Institute of Technology · Technical Club
=====================================================
Registration ID : ${reg.id}
Status          : ${reg.status}
Registered At   : ${new Date(reg.timestamp).toLocaleString()}

PARTICIPANT DETAILS:
Full Name       : ${reg.fullName}
College Email   : ${reg.email}
Contact Number  : ${reg.contactNumber}
College Name    : ${reg.collegeName}
Department      : ${reg.department}
Year of Study   : ${reg.yearOfStudy}

EVENT RESERVATION:
Event Name      : ${reg.eventName}
Category        : ${reg.eventCategory}
${reg.teamName ? `Team Name       : ${reg.teamName}` : ''}
${
  reg.teammates && reg.teammates.length > 0
    ? `Teammates       :\n${reg.teammates.map((t, idx) => `  - Member ${idx + 2}: ${t.name} (${t.email})`).join('\n')}`
    : ''
}
${
  reg.additionalDetails
    ? Object.entries(reg.additionalDetails)
        .map(([k, v]) => `${k.padEnd(16)}: ${v}`)
        .join('\n')
    : ''
}
=====================================================
Please present this pass at the registration desk on the event date.
Official Portal : Celestius Technical Club CIT
=====================================================`;

    const blob = new Blob([slipText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reg.id}-Celestius-Pass.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen text-slate-100 z-10 py-8 px-4 sm:px-6 max-w-5xl mx-auto flex flex-col">
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-pink-500/20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDetails}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-pink-300 border border-pink-500/30 text-xs sm:text-sm font-outfit transition-all duration-200 cursor-pointer hover:border-pink-400"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Event Specifications</span>
          </button>
          <button
            onClick={onBackToEvents}
            className="text-xs text-slate-400 hover:text-slate-200 font-outfit transition-colors hidden sm:inline-block cursor-pointer"
          >
            Events Carousel
          </button>
          <button
            onClick={onBackToHome}
            className="text-xs text-slate-400 hover:text-slate-200 font-outfit transition-colors hidden sm:inline-block cursor-pointer"
          >
            Home Orbit
          </button>
        </div>

        <CelestiusLogo size="sm" />

        <div className="flex items-center gap-3 text-xs text-slate-400 font-outfit">
          {pastRegistrations.length > 0 && (
            <button
              onClick={() => setShowHistoryModal(true)}
              className="text-pink-300 hover:text-pink-200 underline cursor-pointer flex items-center gap-1"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>My Passes ({pastRegistrations.length})</span>
            </button>
          )}
          <span className="hidden md:inline">Chennai Institute of Technology</span>
        </div>
      </div>

      {/* Page Heading & Welcoming Subtitle with Icy Pink Accents */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950/60 border border-pink-500/30 text-pink-300 text-xs font-mono uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>Registration Portal · Celestius 2026</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-cinzel font-bold text-white tracking-wide">
          Join the <span className="text-icy-pink">Celestius Experience</span>
        </h1>
        <p className="mt-3 text-slate-300 font-jakarta text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Step beyond the horizon. Register your team or claim your individual seat at CIT&apos;s
          premier technical symposium.
        </p>
      </div>

      {/* Brief Instructions Box as Requested */}
      <div className="mb-10 p-5 sm:p-6 rounded-2xl glass-panel border border-pink-500/30 bg-slate-950/60 shadow-[0_0_25px_rgba(244,114,182,0.12)]">
        <h3 className="text-xs sm:text-sm font-cinzel font-semibold uppercase tracking-wider text-pink-300 flex items-center gap-2 mb-3">
          <AlertCircle className="w-4 h-4 text-pink-400" />
          Registration Guidelines & Instructions
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-300 font-jakarta">
          <li className="flex items-start gap-2">
            <span className="text-pink-400 font-bold">•</span>
            <span>Use your official college email ID.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-400 font-bold">•</span>
            <span>
              Fields marked with an asterisk (<strong className="text-pink-400">*</strong>) are
              mandatory.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-400 font-bold">•</span>
            <span>Select your event carefully and verify your details before submitting.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-400 font-bold">•</span>
            <span>Enter accurate information to complete your registration.</span>
          </li>
        </ul>
      </div>

      {/* SUCCESS CONFIRMATION STATE */}
      {submittedPass ? (
        <div className="mb-16 p-6 sm:p-10 rounded-3xl glass-panel border border-pink-500/40 bg-slate-950/80 shadow-[0_0_40px_rgba(244,114,182,0.25)] animate-fade-in-gentle">
          <div className="flex flex-col items-center text-center pb-6 border-b border-slate-800">
            <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
              Registration Recorded Successfully
            </span>
            <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-white mt-1">
              Official Entry Pass Confirmed
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-md">
              Your details have been registered into the Celestius system. Please save your
              registration ID.
            </p>

            {/* Registration ID Banner */}
            <div className="mt-6 inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-900/90 border border-pink-500/40 text-pink-200">
              <span className="text-xs uppercase font-mono text-slate-400">Pass ID:</span>
              <strong className="text-base sm:text-lg font-mono font-bold tracking-wider text-icy-pink">
                {submittedPass.id}
              </strong>
              <button
                onClick={() => handleCopyId(submittedPass.id)}
                className="p-1.5 rounded hover:bg-slate-800 text-pink-300 hover:text-white transition-colors cursor-pointer"
                title="Copy Registration ID"
              >
                <Copy className="w-4 h-4" />
              </button>
              {copiedId && (
                <span className="text-[11px] font-mono text-emerald-400">Copied!</span>
              )}
            </div>
          </div>

          {/* Pass Breakdown Grid */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm font-outfit text-slate-300">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                Selected Event
              </span>
              <strong className="text-cyan-300 font-semibold block text-sm sm:text-base">
                {submittedPass.eventName}
              </strong>
              <span className="text-xs text-slate-400 font-mono mt-0.5 block">
                {submittedPass.eventCategory}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                Participant Details
              </span>
              <strong className="text-white block">{submittedPass.fullName}</strong>
              <span className="text-slate-400 block">{submittedPass.email}</span>
              <span className="text-slate-400 block">
                {submittedPass.department} · {submittedPass.yearOfStudy}
              </span>
              <span className="text-slate-400 block">{submittedPass.collegeName}</span>
            </div>

            {submittedPass.teamName && (
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 md:col-span-2">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                  Team Formation
                </span>
                <strong className="text-pink-300 block text-sm sm:text-base">
                  {submittedPass.teamName}
                </strong>
                {submittedPass.teammates && submittedPass.teammates.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {submittedPass.teammates.map((tm, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300"
                      >
                        Member {i + 2}: <strong>{tm.name}</strong> ({tm.email})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {submittedPass.additionalDetails && (
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 md:col-span-2">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                  Event Technical Specifications
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(submittedPass.additionalDetails).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-2">
                      <span className="text-slate-400">{k}:</span>
                      <strong className="text-slate-200">{v}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 pt-6 border-t border-slate-800">
            <button
              onClick={() => handleDownloadSlip(submittedPass)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-pink-950/60 hover:bg-pink-900/70 border border-pink-400/70 text-pink-200 font-cinzel font-semibold text-xs sm:text-sm shadow-[0_0_20px_rgba(244,114,182,0.3)] cursor-pointer transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Entry Slip (.txt)</span>
            </button>

            <button
              onClick={() => {
                setSubmittedPass(null);
                setFullName('');
                setEmail('');
                setContactNumber('');
                setTeamName('');
                setTeammate1Name('');
                setTeammate1Email('');
                setTeammate2Name('');
                setTeammate2Email('');
                setTeammate3Name('');
                setTeammate3Email('');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-cinzel text-xs sm:text-sm cursor-pointer transition-all"
            >
              <span>Register Another Event</span>
            </button>

            <button
              onClick={onBackToEvents}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-500/40 text-cyan-200 font-cinzel text-xs sm:text-sm cursor-pointer transition-all"
            >
              <span>Return to Events</span>
            </button>
          </div>
        </div>
      ) : (
        /* REGISTRATION FORM */
        <form
          onSubmit={handleSubmit}
          noValidate
          className="glass-panel rounded-3xl p-6 sm:p-10 border border-pink-500/30 shadow-[0_0_35px_rgba(244,114,182,0.1)] mb-16"
        >
          {/* Section 1: Event Selection */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-pink-950 border border-pink-400/40 text-pink-300 text-xs font-mono flex items-center justify-center font-bold">
                1
              </span>
              <h2 className="text-lg sm:text-xl font-cinzel font-bold text-white">
                Select Technical Event <span className="text-pink-400">*</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-jakarta mb-4 ml-8">
              Choose the event you wish to compete in. Team details and event requirements will
              adjust dynamically.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 ml-0 sm:ml-8">
              {eventOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedEventId === opt.id;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSelectedEventId(opt.id);
                      setErrors((prev) => ({ ...prev, selectedEventId: '' }));
                    }}
                    className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-pink-400 bg-pink-950/50 shadow-[0_0_20px_rgba(244,114,182,0.3)] ring-1 ring-pink-400'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg shrink-0 ${
                          isSelected ? 'bg-pink-900/60 text-pink-300' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                          {opt.category}
                        </span>
                        <h4 className="text-sm font-cinzel font-bold text-white mt-0.5 leading-snug">
                          {opt.name}
                        </h4>
                        <span
                          className={`mt-2 inline-block text-[11px] font-outfit px-2 py-0.5 rounded border ${opt.badgeColor}`}
                        >
                          {opt.teamFormat}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Personal & Academic Credentials */}
          <div className="mb-10 pt-8 border-t border-slate-800/80">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-pink-950 border border-pink-400/40 text-pink-300 text-xs font-mono flex items-center justify-center font-bold">
                2
              </span>
              <h2 className="text-lg sm:text-xl font-cinzel font-bold text-white">
                Participant Credentials
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-jakarta mb-5 ml-8">
              Primary registrant details. You will act as the team lead / primary contact.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 ml-0 sm:ml-8">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-outfit uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name <span className="text-pink-400 font-bold">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                    }}
                    placeholder="e.g. Arjun Sundaram"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border text-sm text-white placeholder-slate-500 font-jakarta focus:outline-none focus:ring-1 transition-all ${
                      errors.fullName
                        ? 'border-pink-500 focus:ring-pink-400'
                        : 'border-slate-800 focus:border-pink-400/70 focus:ring-pink-400/50'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-pink-400 mt-1 font-jakarta">{errors.fullName}</p>
                )}
              </div>

              {/* College Email */}
              <div>
                <label className="block text-xs font-outfit uppercase tracking-wider text-slate-300 mb-1.5">
                  College Email ID <span className="text-pink-400 font-bold">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    placeholder="arjun.s@citchennai.net"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border text-sm text-white placeholder-slate-500 font-jakarta focus:outline-none focus:ring-1 transition-all ${
                      errors.email
                        ? 'border-pink-500 focus:ring-pink-400'
                        : 'border-slate-800 focus:border-pink-400/70 focus:ring-pink-400/50'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-pink-400 mt-1 font-jakarta">{errors.email}</p>
                )}
              </div>

              {/* College Name */}
              <div>
                <label className="block text-xs font-outfit uppercase tracking-wider text-slate-300 mb-1.5">
                  College Name <span className="text-pink-400 font-bold">*</span>
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => {
                      setCollegeName(e.target.value);
                      if (errors.collegeName) setErrors((prev) => ({ ...prev, collegeName: '' }));
                    }}
                    placeholder="Chennai Institute of Technology"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border text-sm text-white placeholder-slate-500 font-jakarta focus:outline-none focus:ring-1 transition-all ${
                      errors.collegeName
                        ? 'border-pink-500 focus:ring-pink-400'
                        : 'border-slate-800 focus:border-pink-400/70 focus:ring-pink-400/50'
                    }`}
                  />
                </div>
                {errors.collegeName && (
                  <p className="text-xs text-pink-400 mt-1 font-jakarta">{errors.collegeName}</p>
                )}
              </div>

              {/* Department / Course */}
              <div>
                <label className="block text-xs font-outfit uppercase tracking-wider text-slate-300 mb-1.5">
                  Department / Course <span className="text-pink-400 font-bold">*</span>
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value);
                      if (errors.department) setErrors((prev) => ({ ...prev, department: '' }));
                    }}
                    placeholder="e.g. B.Tech Computer Science & AI"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border text-sm text-white placeholder-slate-500 font-jakarta focus:outline-none focus:ring-1 transition-all ${
                      errors.department
                        ? 'border-pink-500 focus:ring-pink-400'
                        : 'border-slate-800 focus:border-pink-400/70 focus:ring-pink-400/50'
                    }`}
                  />
                </div>
                {errors.department && (
                  <p className="text-xs text-pink-400 mt-1 font-jakarta">{errors.department}</p>
                )}
              </div>

              {/* Year of Study */}
              <div>
                <label className="block text-xs font-outfit uppercase tracking-wider text-slate-300 mb-1.5">
                  Year of Study <span className="text-pink-400 font-bold">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <select
                    value={yearOfStudy}
                    onChange={(e) => {
                      setYearOfStudy(e.target.value);
                      if (errors.yearOfStudy) setErrors((prev) => ({ ...prev, yearOfStudy: '' }));
                    }}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border text-sm text-white font-jakarta focus:outline-none focus:ring-1 transition-all appearance-none cursor-pointer ${
                      errors.yearOfStudy
                        ? 'border-pink-500 focus:ring-pink-400'
                        : 'border-slate-800 focus:border-pink-400/70 focus:ring-pink-400/50'
                    }`}
                  >
                    <option value="" disabled className="bg-slate-950">
                      Select Current Academic Year
                    </option>
                    <option value="1st Year (Freshman)" className="bg-slate-950">
                      1st Year (Freshman)
                    </option>
                    <option value="2nd Year (Sophomore)" className="bg-slate-950">
                      2nd Year (Sophomore)
                    </option>
                    <option value="3rd Year (Junior)" className="bg-slate-950">
                      3rd Year (Junior)
                    </option>
                    <option value="4th Year (Senior)" className="bg-slate-950">
                      4th Year (Senior)
                    </option>
                    <option value="Postgraduate / Masters" className="bg-slate-950">
                      Postgraduate / Masters
                    </option>
                  </select>
                </div>
                {errors.yearOfStudy && (
                  <p className="text-xs text-pink-400 mt-1 font-jakarta">{errors.yearOfStudy}</p>
                )}
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-xs font-outfit uppercase tracking-wider text-slate-300 mb-1.5">
                  Contact Number <span className="text-pink-400 font-bold">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => {
                      setContactNumber(e.target.value);
                      if (errors.contactNumber) setErrors((prev) => ({ ...prev, contactNumber: '' }));
                    }}
                    placeholder="+91 98765 43210"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border text-sm text-white placeholder-slate-500 font-jakarta focus:outline-none focus:ring-1 transition-all ${
                      errors.contactNumber
                        ? 'border-pink-500 focus:ring-pink-400'
                        : 'border-slate-800 focus:border-pink-400/70 focus:ring-pink-400/50'
                    }`}
                  />
                </div>
                {errors.contactNumber && (
                  <p className="text-xs text-pink-400 mt-1 font-jakarta">{errors.contactNumber}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Team Formation & Teammates Details (Where Applicable) */}
          {(selectedEventId === 'event-1' ||
            selectedEventId === 'event-4' ||
            selectedEventId === 'event-3') && (
            <div className="mb-10 pt-8 border-t border-slate-800/80">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-pink-950 border border-pink-400/40 text-pink-300 text-xs font-mono flex items-center justify-center font-bold">
                  3
                </span>
                <h2 className="text-lg sm:text-xl font-cinzel font-bold text-white">
                  Team Specification & Teammates
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-jakarta mb-5 ml-8">
                {selectedEventId === 'event-1'
                  ? 'CodeNexus requires teams of 2 to 4 developers. Please provide your team name and teammate details.'
                  : selectedEventId === 'event-4'
                    ? 'CyberSiege permits solo or team squads of up to 3 cybersecurity defenders.'
                    : 'GenAI Forge can be attended individually or as a collaborative duo.'}
              </p>

              <div className="space-y-4 ml-0 sm:ml-8">
                {/* GenAI Forge: Solo or Duo Selector */}
                {selectedEventId === 'event-3' && (
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs font-outfit uppercase text-slate-300">
                      Participation Mode:
                    </span>
                    <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="partnerType"
                        value="solo"
                        checked={partnerType === 'solo'}
                        onChange={() => setPartnerType('solo')}
                        className="accent-pink-400 cursor-pointer"
                      />
                      <span>Individual Seat (Solo)</span>
                    </label>
                    <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="partnerType"
                        value="duo"
                        checked={partnerType === 'duo'}
                        onChange={() => setPartnerType('duo')}
                        className="accent-pink-400 cursor-pointer"
                      />
                      <span>Duo Lab Partner (2 seats)</span>
                    </label>
                  </div>
                )}

                {/* Team Name (for CodeNexus & CyberSiege) */}
                {(selectedEventId === 'event-1' || selectedEventId === 'event-4') && (
                  <div>
                    <label className="block text-xs font-outfit uppercase tracking-wider text-slate-300 mb-1.5">
                      Team Name <span className="text-pink-400 font-bold">*</span>
                    </label>
                    <div className="relative max-w-md">
                      <Users className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => {
                          setTeamName(e.target.value);
                          if (errors.teamName) setErrors((prev) => ({ ...prev, teamName: '' }));
                        }}
                        placeholder="e.g. Quantum Pioneers"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border text-sm text-white placeholder-slate-500 font-jakarta focus:outline-none focus:ring-1 transition-all ${
                          errors.teamName
                            ? 'border-pink-500 focus:ring-pink-400'
                            : 'border-slate-800 focus:border-pink-400/70 focus:ring-pink-400/50'
                        }`}
                      />
                    </div>
                    {errors.teamName && (
                      <p className="text-xs text-pink-400 mt-1 font-jakarta">{errors.teamName}</p>
                    )}
                  </div>
                )}

                {/* Teammate 1 */}
                {(selectedEventId === 'event-1' ||
                  (selectedEventId === 'event-3' && partnerType === 'duo') ||
                  selectedEventId === 'event-4') && (
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
                    <span className="text-xs font-mono uppercase text-pink-300 mb-2 block font-semibold">
                      {selectedEventId === 'event-3' ? 'Lab Partner Details' : 'Teammate 1 (Member 2)'}{' '}
                      {selectedEventId === 'event-1' && <span className="text-pink-400">*</span>}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          value={teammate1Name}
                          onChange={(e) => {
                            setTeammate1Name(e.target.value);
                            if (errors.teammate1Name)
                              setErrors((prev) => ({ ...prev, teammate1Name: '' }));
                          }}
                          placeholder="Teammate Full Name"
                          className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 font-jakarta focus:outline-none focus:border-pink-400"
                        />
                        {errors.teammate1Name && (
                          <p className="text-xs text-pink-400 mt-1">{errors.teammate1Name}</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="email"
                          value={teammate1Email}
                          onChange={(e) => {
                            setTeammate1Email(e.target.value);
                            if (errors.teammate1Email)
                              setErrors((prev) => ({ ...prev, teammate1Email: '' }));
                          }}
                          placeholder="Teammate College Email"
                          className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 font-jakarta focus:outline-none focus:border-pink-400"
                        />
                        {errors.teammate1Email && (
                          <p className="text-xs text-pink-400 mt-1">{errors.teammate1Email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Teammates for Hackathon & CTF */}
                {(selectedEventId === 'event-1' || selectedEventId === 'event-4') && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-900/30 border border-slate-800/60">
                      <span className="text-[11px] font-mono uppercase text-slate-400 mb-1.5 block">
                        Teammate 2 (Member 3 - Optional)
                      </span>
                      <input
                        type="text"
                        value={teammate2Name}
                        onChange={(e) => setTeammate2Name(e.target.value)}
                        placeholder="Full Name"
                        className="w-full mb-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 font-jakarta focus:outline-none focus:border-pink-400"
                      />
                      <input
                        type="email"
                        value={teammate2Email}
                        onChange={(e) => setTeammate2Email(e.target.value)}
                        placeholder="College Email"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 font-jakarta focus:outline-none focus:border-pink-400"
                      />
                    </div>

                    {selectedEventId === 'event-1' && (
                      <div className="p-3.5 rounded-xl bg-slate-900/30 border border-slate-800/60">
                        <span className="text-[11px] font-mono uppercase text-slate-400 mb-1.5 block">
                          Teammate 3 (Member 4 - Optional)
                        </span>
                        <input
                          type="text"
                          value={teammate3Name}
                          onChange={(e) => setTeammate3Name(e.target.value)}
                          placeholder="Full Name"
                          className="w-full mb-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 font-jakarta focus:outline-none focus:border-pink-400"
                        />
                        <input
                          type="email"
                          value={teammate3Email}
                          onChange={(e) => setTeammate3Email(e.target.value)}
                          placeholder="College Email"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 font-jakarta focus:outline-none focus:border-pink-400"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 4: Event-Specific Technical Information */}
          <div className="mb-10 pt-8 border-t border-slate-800/80">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-pink-950 border border-pink-400/40 text-pink-300 text-xs font-mono flex items-center justify-center font-bold">
                {selectedEventId === 'event-2' ? '3' : '4'}
              </span>
              <h2 className="text-lg sm:text-xl font-cinzel font-bold text-white">
                Technical Specifications & Logistics
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-jakarta mb-5 ml-8">
              Genuine technical requirements configured for {selectedEvent.name}.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 ml-0 sm:ml-8">
              {/* Event 1 Requirements: GitHub */}
              {selectedEventId === 'event-1' && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-outfit uppercase tracking-wider text-slate-300 mb-1.5">
                    Team GitHub / Portfolio Organization Profile{' '}
                    <span className="text-pink-400 font-bold">*</span>
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => {
                      setGithubUrl(e.target.value);
                      if (errors.githubUrl) setErrors((prev) => ({ ...prev, githubUrl: '' }));
                    }}
                    placeholder="https://github.com/your-username-or-team"
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border text-sm text-white placeholder-slate-500 font-jakarta focus:outline-none focus:ring-1 transition-all ${
                      errors.githubUrl
                        ? 'border-pink-500 focus:ring-pink-400'
                        : 'border-slate-800 focus:border-pink-400/70 focus:ring-pink-400/50'
                    }`}
                  />
                  {errors.githubUrl && (
                    <p className="text-xs text-pink-400 mt-1 font-jakarta">{errors.githubUrl}</p>
                  )}
                </div>
              )}

              {/* Event 2 Requirements: Language & Competitive profile */}
              {selectedEventId === 'event-2' && (
                <>
                  <div>
                    <label className="block text-xs font-outfit uppercase tracking-wider text-slate-300 mb-1.5">
                      Primary Competitive Language <span className="text-pink-400 font-bold">*</span>
                    </label>
                    <select
                      value={preferredLanguage}
                      onChange={(e) => setPreferredLanguage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white font-jakarta focus:outline-none focus:border-pink-400 cursor-pointer"
                    >
                      <option value="C++ (GCC 14 / C++20)" className="bg-slate-950">
                        C++ (GCC 14 / C++20)
                      </option>
                      <option value="Java (OpenJDK 21)" className="bg-slate-950">
                        Java (OpenJDK 21)
                      </option>
                      <option value="Python (PyPy 3.10)" className="bg-slate-950">
                        Python (PyPy 3.10)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-outfit uppercase tracking-wider text-slate-300 mb-1.5">
                      LeetCode / Codeforces Profile Handle (Optional)
                    </label>
                    <input
                      type="text"
                      value={competitiveProfile}
                      onChange={(e) => setCompetitiveProfile(e.target.value)}
                      placeholder="e.g. codeforces.com/profile/alex"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white placeholder-slate-500 font-jakarta focus:outline-none focus:border-pink-400"
                    />
                  </div>
                </>
              )}

              {/* Event 3 Requirements: AI Experience & OS */}
              {selectedEventId === 'event-3' && (
                <>
                  <div>
                    <label className="block text-xs font-outfit uppercase tracking-wider text-slate-300 mb-1.5">
                      Prior Machine Learning & Python Experience
                    </label>
                    <select
                      value={aiExperience}
                      onChange={(e) => setAiExperience(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white font-jakarta focus:outline-none focus:border-pink-400 cursor-pointer"
                    >
                      <option value="Beginner (Basic Python, eager to learn)" className="bg-slate-950">
                        Beginner (Basic Python, eager to learn)
                      </option>
                      <option
                        value="Intermediate (Comfortable with REST APIs & NumPy)"
                        className="bg-slate-950"
                      >
                        Intermediate (Comfortable with REST APIs & NumPy)
                      </option>
                      <option
                        value="Advanced (Built RAG, LLM chains, or fine-tuned models)"
                        className="bg-slate-950"
                      >
                        Advanced (Built RAG, LLM chains, or fine-tuned models)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-outfit uppercase tracking-wider text-slate-300 mb-1.5">
                      Laptop OS (Bring-Your-Own-Device)
                    </label>
                    <select
                      value={laptopOS}
                      onChange={(e) => setLaptopOS(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white font-jakarta focus:outline-none focus:border-pink-400 cursor-pointer"
                    >
                      <option value="Linux (Ubuntu / Debian / Fedora / Arch)" className="bg-slate-950">
                        Linux (Ubuntu / Debian / Fedora / Arch)
                      </option>
                      <option value="macOS (Apple Silicon / Intel)" className="bg-slate-950">
                        macOS (Apple Silicon / Intel)
                      </option>
                      <option value="Windows with WSL2 enabled" className="bg-slate-950">
                        Windows with WSL2 enabled
                      </option>
                    </select>
                  </div>
                </>
              )}

              {/* Event 4 Requirements: CTF Domain */}
              {selectedEventId === 'event-4' && (
                <>
                  <div>
                    <label className="block text-xs font-outfit uppercase tracking-wider text-slate-300 mb-1.5">
                      Primary CTF Specialization
                    </label>
                    <select
                      value={securitySpecialization}
                      onChange={(e) => setSecuritySpecialization(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white font-jakarta focus:outline-none focus:border-pink-400 cursor-pointer"
                    >
                      <option value="Web Exploitation & API Security" className="bg-slate-950">
                        Web Exploitation & API Security
                      </option>
                      <option value="Cryptography & Cipher Decryption" className="bg-slate-950">
                        Cryptography & Cipher Decryption
                      </option>
                      <option value="Reverse Engineering & Binary Analysis" className="bg-slate-950">
                        Reverse Engineering & Binary Analysis
                      </option>
                      <option value="Digital Forensics & Memory Inspection" className="bg-slate-950">
                        Digital Forensics & Memory Inspection
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-outfit uppercase tracking-wider text-slate-300 mb-1.5">
                      CTFTime / HackTheBox / TryHackMe Handle (Optional)
                    </label>
                    <input
                      type="text"
                      value={ctfHandle}
                      onChange={(e) => setCtfHandle(e.target.value)}
                      placeholder="e.g. cipher_hunter_cit"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white placeholder-slate-500 font-jakarta focus:outline-none focus:border-pink-400"
                    />
                  </div>
                </>
              )}

              {/* Special Accommodations / Dietary Notes */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-outfit uppercase tracking-wider text-slate-300 mb-1.5">
                  Special Notes or Requirements (Optional)
                </label>
                <input
                  type="text"
                  value={specialAccommodation}
                  onChange={(e) => setSpecialAccommodation(e.target.value)}
                  placeholder="e.g. Dietary preference for overnight hackathon meals, accessibility needs"
                  className="w-full px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 font-jakarta focus:outline-none focus:border-pink-400"
                />
              </div>
            </div>
          </div>

          {/* Submission Errors Feedback */}
          {errors.submit && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 flex items-center gap-3 text-xs sm:text-sm">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-400 font-jakarta">
              By submitting, you certify that all information provided is accurate and authentic.
            </span>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl font-cinzel font-semibold tracking-wider uppercase text-sm text-pink-100 bg-pink-950/70 hover:bg-pink-900/80 border border-pink-400/80 shadow-[0_0_25px_rgba(244,114,182,0.4)] hover:shadow-[0_0_40px_rgba(244,114,182,0.8)] hover:text-white hover:border-pink-300 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-pink-300 border-t-transparent rounded-full animate-spin" />
                  <span>Validating & Storing...</span>
                </>
              ) : (
                <>
                  <Ticket className="w-4 h-4 text-pink-300" />
                  <span>Submit Registration</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* History Modal for Previous Registrations Stored on this device */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto glass-panel p-6 sm:p-8 rounded-3xl border border-pink-500/40">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-cinzel font-bold text-white flex items-center gap-2">
                <Ticket className="w-5 h-5 text-pink-400" />
                <span>My Recorded Event Passes</span>
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-xs text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3.5">
              {pastRegistrations.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs sm:text-sm font-outfit"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-mono text-xs text-pink-300 font-bold block">
                        {item.id}
                      </span>
                      <strong className="text-white block mt-0.5">{item.eventName}</strong>
                      <span className="text-slate-400 block mt-0.5">
                        Registrant: {item.fullName} ({item.email})
                      </span>
                      {item.teamName && (
                        <span className="text-cyan-300 block text-xs mt-0.5">
                          Team: {item.teamName}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono text-emerald-300">
                        CONFIRMED
                      </span>
                      <button
                        onClick={() => handleDownloadSlip(item)}
                        className="text-[11px] text-pink-300 hover:text-white underline cursor-pointer inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> Slip
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto py-8 text-center text-xs text-slate-400 font-outfit border-t border-slate-800/60">
        © 2026 Celestius Technical Club · Chennai Institute of Technology
      </footer>
    </div>
  );
};
