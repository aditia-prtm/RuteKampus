import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Shapes, ArrowRight, Compass } from 'lucide-react';
import Card from '../../common/Card.jsx';
import Badge from '../../common/Badge.jsx';

export default function ModeSelectionSection() {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <Badge variant="amber" dot className="mx-auto">
          Pilihan Simulasi
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Dua Mode Pembelajaran <span className="text-amber-400 font-serif italic">Siklus Hamilton</span>
        </h2>
        <p className="text-xs sm:text-sm text-blue-100/85 max-w-xl mx-auto leading-relaxed">
          Pilih untuk mengamati simulasi nyata pada topografi Kampus Unsri atau berkreasi bebas dengan kanvas graf buatan sendiri.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Kartu 1: Peta Kampus Unsri */}
        <Card hoverEffect className="flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center border border-white/20 group-hover:scale-105 group-hover:border-amber-400/50 transition-transform shadow-inner">
              <MapPin className="w-6 h-6" />
            </div>

            <div>
              <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/35 mb-2">
                Studi Kasus Kampus Unsri
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                Rute Shuttle Bus Unsri Palembang
              </h3>
              <p className="text-xs sm:text-sm text-blue-100/80 mt-2 leading-relaxed">
                Simulasi penjelajahan antar fakultas (FK, FH, Fasilkom, Pascasarjana, dan fasilitas utama) di Kampus Unsri Bukit Besar Palembang di atas peta koordinat GPS nyata.
              </p>
            </div>
          </div>

          <div className="pt-6">
            <Link
              to="/campus"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-blue-50 font-bold text-[#0a3a6b] shadow-xl shadow-[#031c38]/40 border border-white/40 transition-all text-xs sm:text-sm cursor-pointer group-hover:border-amber-400/40"
            >
              <span>Buka Peta Kampus</span>
              <ArrowRight className="w-4 h-4 text-[#0a3a6b]" />
            </Link>
          </div>
        </Card>

        {/* Kartu 2: Mode Bikin Graf Sendiri */}
        <Card hoverEffect className="flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-400/20 text-teal-200 flex items-center justify-center border border-teal-300/30 group-hover:scale-105 group-hover:border-teal-300/50 transition-transform shadow-inner">
              <Shapes className="w-6 h-6" />
            </div>

            <div>
              <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-400/20 text-teal-200 border border-teal-300/35 mb-2">
                Interactive Graph Sandbox
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors">
                Bikin Graf Sendiri
              </h3>
              <p className="text-xs sm:text-sm text-blue-100/80 mt-2 leading-relaxed">
                Kanvas interaktif untuk meletakkan simpul titik baru, menarik garis sisi berbobot, menggeser simpul (drag and drop), serta menyaksikan proses algoritma TSP bekerja.
              </p>
            </div>
          </div>

          <div className="pt-6">
            <Link
              to="/custom"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 font-semibold text-white shadow-lg border border-white/25 backdrop-blur-md transition-all text-xs sm:text-sm cursor-pointer group-hover:border-teal-300/40"
            >
              <span>Mulai Bikin Graf</span>
              <Compass className="w-4 h-4" />
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}
