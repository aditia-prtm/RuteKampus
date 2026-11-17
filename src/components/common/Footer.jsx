import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Shapes, Home } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-blue-950/80 bg-[#020e1e] text-blue-200/70 py-10 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center text-xl font-bold tracking-tight text-white mb-1">
            <span className="font-medium">rute</span>
            <span className="text-amber-400 font-extrabold tracking-wider">KAMPUS</span>
          </div>
          <p className="text-xs text-blue-300/60 max-w-sm">
            Simulasi visual interaktif Traveling Salesperson Problem (TSP) dan Siklus Hamilton pada jaringan jalan Kampus Universitas Sriwijaya.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-blue-200/80">
          <Link to="/" className="hover:text-amber-400 transition cursor-pointer flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </Link>
          <Link to="/campus" className="hover:text-amber-400 transition cursor-pointer flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Peta Kampus</span>
          </Link>
          <Link to="/custom" className="hover:text-amber-400 transition cursor-pointer flex items-center gap-1.5">
            <Shapes className="w-3.5 h-3.5 text-teal-400" />
            <span>Graf Sendiri</span>
          </Link>
        </div>

        <div className="text-center md:text-right text-[11px] text-blue-400/50 space-y-0.5">
          <div>Tugas Besar Struktur Diskrit 2 &copy; {new Date().getFullYear()}</div>
          <div className="text-[10px]">Universitas Sriwijaya Bukit Besar Palembang</div>
        </div>
      </div>
    </footer>
  );
}
