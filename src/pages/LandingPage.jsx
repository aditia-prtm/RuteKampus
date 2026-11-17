import React from 'react';
import HeroSection from '../components/features/landing/HeroSection.jsx';
import ModeSelectionSection from '../components/features/landing/ModeSelectionSection.jsx';
import RealWorldSection from '../components/features/landing/RealWorldSection.jsx';
import GraphTheorySection from '../components/features/landing/GraphTheorySection.jsx';

/**
 * LandingPage RuteKampus UNSRI
 * Terstruktur bersih menggunakan arsitektur fitur modular (components/features/landing).
 * Tampilan selaras dengan visual Hero (Deep Royal Navy, Amber Serif Accent, Frosted Glass).
 */
export default function LandingPage() {
  return (
    <div className="flex-1 bg-[#021124] text-white flex flex-col font-['Poppins',sans-serif]">
      {/* 1. Hero Section (100vh fit, awan berarak, responsive kampus, CTA+text) */}
      <HeroSection />

      {/* 2. Konten Utama Landing Page */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <ModeSelectionSection />
        <RealWorldSection />
        <GraphTheorySection />
      </div>
    </div>
  );
}
