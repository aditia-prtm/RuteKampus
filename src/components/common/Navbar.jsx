import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MapPin, Shapes } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const isLanding = currentPath === '/';
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Deteksi scroll untuk transisi latar belakang navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tutup menu seluler saat rute berpindah
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPath]);

  // Aksesibilitas: Tutup menu seluler dengan tombol Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fungsi scroll halus ke section tujuan pada landing page menggunakan Lenis
  const scrollToSection = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (window.lenis) {
      window.lenis.scrollTo(targetId, { offset: -80 });
    } else {
      const element = document.querySelector(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 text-white ${
        isLanding
          ? scrolled
            ? 'bg-[#0a3a6b]/95 backdrop-blur-md border-b border-blue-300/20 shadow-xl shadow-[#021830]/40'
            : 'bg-gradient-to-b from-[#031d3d]/90 via-[#031d3d]/30 to-transparent border-transparent'
          : 'bg-[#083461]/95 backdrop-blur-md border-b border-blue-300/20 shadow-md shadow-[#021830]/30'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between relative">
        {/* Brand Link: TourKAMPUS (Klik logo langsung kembali ke beranda) */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0 z-10 font-poppins">
          <div className="flex flex-col">
            <div className="flex items-center text-lg sm:text-2xl font-bold tracking-tight">
              <span className="text-white">Tour</span>
              <span className="text-amber-400 font-extrabold tracking-wider">KAMPUS</span>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-blue-200/80 font-semibold -mt-1">
              Navigasi & Tur Kampus Unsri
            </span>
          </div>
        </Link>

        {/* ==============================================================
            NAVBAR MODE 1: LANDING PAGE
            - Menu section tepat di tengah horizontal
            - Tombol Visualisasi tetap di kanan
           ============================================================== */}
        {isLanding ? (
          <>
            {/* Desktop Navigation Landing Page (Tepat di Tengah Horizontal) */}
            <nav
              aria-label="Navigasi Landing Page"
              className="hidden md:flex items-center gap-7 lg:gap-8 text-xs font-semibold font-poppins absolute left-1/2 -translate-x-1/2"
            >
              <a
                href="#developer"
                onClick={(e) => scrollToSection(e, '#developer')}
                className="text-white/85 hover:text-amber-400 transition-colors cursor-pointer"
              >
                Developer
              </a>
              <a
                href="#simulasi"
                onClick={(e) => scrollToSection(e, '#simulasi')}
                className="text-white/85 hover:text-amber-400 transition-colors cursor-pointer"
              >
                Pilihan Mode
              </a>
              <a
                href="#relevansi"
                onClick={(e) => scrollToSection(e, '#relevansi')}
                className="text-white/85 hover:text-amber-400 transition-colors cursor-pointer"
              >
                Relevansi
              </a>
              <a
                href="#teori"
                onClick={(e) => scrollToSection(e, '#teori')}
                className="text-white/85 hover:text-amber-400 transition-colors cursor-pointer"
              >
                Teori Graf
              </a>
            </nav>

            {/* Tombol Kuning Emas 'Visualisasi' di Paling Kanan */}
            <div className="hidden md:flex items-center shrink-0 z-10">
              <Link
                to="/campus"
                className="inline-flex items-center gap-1.5 px-6 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs font-poppins shadow-md shadow-black/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Visualisasi</span>
              </Link>
            </div>

            {/* Mobile Hamburger Button Landing Page */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Tutup Menu' : 'Buka Menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2 rounded-xl text-white hover:bg-white/10 transition cursor-pointer z-10"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-amber-400" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </>
        ) : (
          /* ==============================================================
             NAVBAR MODE 2: VISUALISASI (/campus & /custom)
             (Latar belakang match dengan halaman visualisasi #021124,
              menu Peta Kampus & Graf Kustom di kanan)
             ============================================================== */
          <>
            {/* Desktop Navigation Visualisasi di Kanan */}
            <nav aria-label="Navigasi Visualisasi" className="hidden md:flex items-center gap-8 text-xs font-semibold font-poppins">
              <Link
                to="/campus"
                className={`transition-colors relative py-1 cursor-pointer ${
                  currentPath === '/campus'
                    ? 'text-amber-400 font-bold'
                    : 'text-white/85 hover:text-white'
                }`}
              >
                <span>Peta Kampus</span>
                {currentPath === '/campus' && (
                  <span className="absolute -bottom-1 inset-x-0 h-0.5 bg-amber-400 rounded-full" />
                )}
              </Link>

              <Link
                to="/custom"
                className={`transition-colors relative py-1 cursor-pointer ${
                  currentPath === '/custom'
                    ? 'text-amber-400 font-bold'
                    : 'text-white/85 hover:text-white'
                }`}
              >
                <span>Graf Kustom</span>
                {currentPath === '/custom' && (
                  <span className="absolute -bottom-1 inset-x-0 h-0.5 bg-amber-400 rounded-full" />
                )}
              </Link>
            </nav>

            {/* Mobile Hamburger Button Visualisasi */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Tutup Menu' : 'Buka Menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2 rounded-xl text-white hover:bg-white/10 transition cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-amber-400" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </>
        )}
      </div>

      {/* ==============================================================
          DRAWER MOBILE MENU (Meluncur Turun dengan Framer Motion)
         ============================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -12, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`md:hidden backdrop-blur-xl border-b px-5 py-4 overflow-hidden shadow-2xl ${
              isLanding
                ? 'bg-[#0a3a6b]/98 border-blue-300/25'
                : 'bg-[#083461]/98 border-blue-300/25'
            }`}
          >
            {isLanding ? (
              /* Menu Seluler untuk Landing Page */
              <nav aria-label="Navigasi Seluler Landing" className="flex flex-col space-y-2 text-xs font-semibold font-poppins">
                <a
                  href="#developer"
                  onClick={(e) => scrollToSection(e, '#developer')}
                  className="px-3.5 py-2.5 rounded-xl text-white hover:text-amber-400 hover:bg-white/5 transition"
                >
                  Developer
                </a>
                <a
                  href="#simulasi"
                  onClick={(e) => scrollToSection(e, '#simulasi')}
                  className="px-3.5 py-2.5 rounded-xl text-white hover:text-amber-400 hover:bg-white/5 transition"
                >
                  Pilihan Mode
                </a>
                <a
                  href="#relevansi"
                  onClick={(e) => scrollToSection(e, '#relevansi')}
                  className="px-3.5 py-2.5 rounded-xl text-white hover:text-amber-400 hover:bg-white/5 transition"
                >
                  Relevansi
                </a>
                <a
                  href="#teori"
                  onClick={(e) => scrollToSection(e, '#teori')}
                  className="px-3.5 py-2.5 rounded-xl text-white hover:text-amber-400 hover:bg-white/5 transition"
                >
                  Teori Graf
                </a>

                <div className="pt-2">
                  <Link
                    to="/campus"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs font-poppins shadow-md transition"
                  >
                    <span>Mulai Visualisasi</span>
                  </Link>
                </div>
              </nav>
            ) : (
              /* Menu Seluler untuk Halaman Visualisasi */
              <nav aria-label="Navigasi Seluler Visualisasi" className="flex flex-col space-y-2 text-xs font-semibold font-poppins">
                <Link
                  to="/campus"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
                    currentPath === '/campus'
                      ? 'text-amber-400 font-bold bg-white/10'
                      : 'text-white hover:text-amber-400 hover:bg-white/5'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Peta Kampus</span>
                </Link>

                <Link
                  to="/custom"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
                    currentPath === '/custom'
                      ? 'text-amber-400 font-bold bg-white/10'
                      : 'text-white hover:text-amber-400 hover:bg-white/5'
                  }`}
                >
                  <Shapes className="w-4 h-4 text-teal-300" />
                  <span>Graf Kustom</span>
                </Link>
              </nav>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
