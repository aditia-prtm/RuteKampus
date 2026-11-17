import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import LandingPage from './pages/LandingPage.jsx';
import CampusVisualizerPage from './pages/CampusVisualizerPage.jsx';
import CustomGraphPage from './pages/CustomGraphPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
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
