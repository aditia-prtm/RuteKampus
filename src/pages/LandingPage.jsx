import React from 'react';
import HeroSection from '../components/features/landing/HeroSection.jsx';
import MemberSection from '../components/features/landing/MemberSection.jsx';
import ModeSelectionSection from '../components/features/landing/ModeSelectionSection.jsx';
import RealWorldSection from '../components/features/landing/RealWorldSection.jsx';
import GraphTheorySection from '../components/features/landing/GraphTheorySection.jsx';

/**
 * Pembatas visual antar section dengan garis gradasi safir halus
 * dan titik aksen emas Unsri di tengah.
 */
function SectionDivider() {
  return (
    <div className="relative py-4 sm:py-6 flex items-center justify-center pointer-events-none select-none">
      <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-blue-300/35 to-transparent" />
      <div className="absolute w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)] border border-amber-300" />
    </div>
  );
}

/**
 * LandingPage TourKampus UNSRI
 * Efek Parallax Curtain: Hero tetap tersemat (sticky), sementara MemberSection dan konten di bawahnya
 * meluncur naik ke atas menutupi Hero saat discroll.
 * Setiap section memiliki ID yang sinkron dengan navigasi navbar landing page.
 */
export default function LandingPage() {
  return (
    <div className="relative w-full bg-[#021124] text-white flex flex-col font-['Poppins',sans-serif]">
      {/* 1. HERO SECTION PINNED (Parallax Base: Pinned di viewport saat discroll) */}
      <div className="sticky top-0 h-screen-svh min-h-screen-svh w-full z-0 overflow-hidden pointer-events-auto">
        <HeroSection />
      </div>

      {/* 2. KONTEN CURTAIN NAIK (Parallax Reveal dengan palet biru Unsri #0a3a6b) */}
      <div className="relative z-40 bg-gradient-to-b from-[#0c4278] via-[#0a3a6b] via-25% to-[#083058] rounded-t-[2.5rem] sm:rounded-t-[3.5rem] border-t-2 border-blue-300/40 shadow-[0_-30px_90px_rgba(4,22,46,0.85)] pt-6 pb-20">
        {/* Indikator Aksen Handle Visual */}
        <div className="w-14 h-1.5 rounded-full bg-blue-200/40 mx-auto mb-10 shadow-sm" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
          {/* Section 1: Member Section */}
          <section id="developer" className="relative scroll-mt-24">
            <MemberSection />
          </section>

          {/* Pembatas Visual 1 */}
          <SectionDivider />

          {/* Section 2: Mode Selection (Peta Kampus vs Bikin Graf Sendiri) */}
          <section id="simulasi" className="relative scroll-mt-24">
            <ModeSelectionSection />
          </section>

          {/* Pembatas Visual 2 */}
          <SectionDivider />

          {/* Section 3: Real World Context (Studi Kasus Kampus UNSRI) */}
          <section id="relevansi" className="relative scroll-mt-24">
            <RealWorldSection />
          </section>

          {/* Pembatas Visual 3 */}
          <SectionDivider />

          {/* Section 4: Graph Theory & Discrete Math */}
          <section id="teori" className="relative scroll-mt-24">
            <GraphTheorySection />
          </section>
        </div>
      </div>
    </div>
  );
}
