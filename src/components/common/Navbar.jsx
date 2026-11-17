import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Shapes } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const isLanding = currentPath === '/';

  return (
    <header
      className={`text-white transition-all duration-200 ${
        isLanding
          ? 'absolute top-0 inset-x-0 z-50 bg-gradient-to-b from-[#031d3d]/90 via-[#031d3d]/40 to-transparent'
          : 'sticky top-0 z-50 bg-[#07172e]/95 backdrop-blur-md border-b border-blue-900/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Link: ruteKAMPUS (Sesuai Desain laporUNSRI) */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex flex-col">
            <div className="flex items-center text-lg sm:text-2xl font-bold tracking-tight">
              <span className="text-white font-medium">rute</span>
              <span className="text-amber-400 font-extrabold tracking-wider">KAMPUS</span>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-blue-200/80 font-semibold -mt-1">
              Project Struktur Diskrit 2
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav aria-label="Navigasi Utama" className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/campus"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
              currentPath === '/campus'
                ? 'bg-[#1a4a88] text-white shadow border border-blue-400/50'
                : 'text-blue-100 hover:text-white bg-white/10 border border-white/15'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Peta Kampus</span>
          </Link>

          <Link
            to="/custom"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
              currentPath === '/custom'
                ? 'bg-[#1a4a88] text-white shadow border border-blue-400/50'
                : 'text-blue-100 hover:text-white bg-white/10 border border-white/15'
            }`}
          >
            <Shapes className="w-3.5 h-3.5 text-teal-400" />
            <span>Graf Sendiri</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
