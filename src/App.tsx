/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StarfieldBackground } from './components/StarfieldBackground.tsx';
import { CelestiusLogo } from './components/CelestiusLogo.tsx';
import { TaglineSection } from './components/TaglineSection.tsx';
import { AboutUsSection } from './components/AboutUsSection.tsx';
import { EuropaJupiterSection } from './components/EuropaJupiterSection.tsx';
import { BlackHoleTransition } from './components/BlackHoleTransition.tsx';
import { EventsPage } from './components/EventsPage.tsx';
import { EventDetailsPage } from './components/EventDetailsPage.tsx';
import { RegistrationPage } from './components/RegistrationPage.tsx';

type PageState = 'home' | 'events' | 'details' | 'register';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageState>('home');
  const [targetPage, setTargetPage] = useState<PageState>('events');
  const [isSwirling, setIsSwirling] = useState<boolean>(false);

  // Trigger exact same black-hole transition effect consistently across every page transition
  const startTransitionTo = (nextPage: PageState) => {
    setTargetPage(nextPage);
    setIsSwirling(true);
  };

  // Called when black hole swirl finishes (after 3.0s)
  const handleTransitionComplete = () => {
    setIsSwirling(false);
    setCurrentPage(targetPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#040714] text-slate-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background: Space with dark navy blue & purple mixed color and twinkling stars */}
      <StarfieldBackground />

      {/* Reusable Black Hole Swirl Transition Overlay */}
      {isSwirling && <BlackHoleTransition onComplete={handleTransitionComplete} />}

      {/* Page Routing */}
      {currentPage === 'home' && (
        <div className="relative z-10 flex flex-col min-h-screen">
          <main className="flex-1">
            {/* First on the webpage: The Official Logo */}
            <section className="relative pt-12 sm:pt-16 pb-4 px-4 flex flex-col items-center justify-center text-center">
              <CelestiusLogo size="hero" />

              {/* Tagline of the club: innovate, build, collaborate with lightning symbols in crystal/glass font */}
              <TaglineSection />
            </section>

            {/* Translucent box: About us.. with icy blue heading and highlighted terms */}
            <AboutUsSection />

            {/* Europa & Jupiter Animation with neat spaced description & explore events button */}
            <EuropaJupiterSection onExploreEvents={() => startTransitionTo('events')} />
          </main>

          {/* Simple Clean Footer */}
          <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 px-4 text-center text-xs text-slate-400 font-outfit">
            <p>© 2026 Celestius Student Club · Chennai Institute of Technology</p>
          </footer>
        </div>
      )}

      {currentPage === 'events' && (
        /* Second Webpage: Interactive Events Carousel & Grid */
        <EventsPage
          onBackToHome={() => startTransitionTo('home')}
          onViewEventDetails={() => startTransitionTo('details')}
        />
      )}

      {currentPage === 'details' && (
        /* Third Webpage: Detailed Vertical Event Specifications & Rules */
        <EventDetailsPage
          onBackToEvents={() => startTransitionTo('events')}
          onBackToHome={() => startTransitionTo('home')}
          onNavigateToRegister={() => startTransitionTo('register')}
        />
      )}

      {currentPage === 'register' && (
        /* Fourth Webpage: Registration Portal */
        <RegistrationPage
          onBackToDetails={() => startTransitionTo('details')}
          onBackToEvents={() => startTransitionTo('events')}
          onBackToHome={() => startTransitionTo('home')}
        />
      )}
    </div>
  );
}
