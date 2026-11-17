import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import Navbar from './components/layout/Navbar.jsx';
import LandingPage from './pages/LandingPage.jsx';
import CampusVisualizerPage from './pages/CampusVisualizerPage.jsx';
import CustomGraphPage from './pages/CustomGraphPage.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

export default function App() {
  useEffect(() => {
    // Inisialisasi Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    window.lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-slate-950 font-sans text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
        <Navbar />

        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/campus" element={<CampusVisualizerPage />} />
            <Route path="/custom" element={<CustomGraphPage />} />
            {/* Alias /visualizer diarahkan ke peta kampus */}
            <Route path="/visualizer" element={<Navigate to="/campus" replace />} />
            {/* Fallback ke beranda */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500">
          RuteKampus UNSRI — Tugas Besar Struktur Diskrit 2 &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </BrowserRouter>
  );
}
