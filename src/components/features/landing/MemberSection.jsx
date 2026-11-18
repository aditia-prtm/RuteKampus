import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Users, Sparkles } from 'lucide-react';
import Card from '../../common/Card.jsx';
import Badge from '../../common/Badge.jsx';

// Data 4 Mahasiswa Pengembang (Tim Struktur Diskrit 2 UNSRI)
const MEMBERS = [
  {
    id: 1,
    tabLabel: 'RAFA',
    name: 'Rafa Rasyad Anfero',
    nim: '09021282530057',
    role: 'null',
    prodi: 'Teknik Informatika',
    faculty: 'Fakultas Ilmu Komputer, Universitas Sriwijaya',
    quote: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et.',
    avatarColor: 'from-blue-600 via-indigo-700 to-blue-900',
    initial: 'D1'
  },
  {
    id: 2,
    tabLabel: 'SABIL',
    name: 'Sabil Alaudin',
    nim: '09021282530121',
    role: 'null',
    prodi: 'Teknik Informatika',
    faculty: 'Fakultas Ilmu Komputer, Universitas Sriwijaya',
    quote: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et.',
    avatarColor: 'from-amber-500 via-amber-700 to-amber-950',
    initial: 'D2'
  },
  {
    id: 3,
    tabLabel: 'NAHES',
    name: 'Muhammad Syehan Fahrezi Prashya',
    nim: '09021282530051',
    role: 'null',
    prodi: 'Teknik Informatika',
    faculty: 'Fakultas Ilmu Komputer, Universitas Sriwijaya',
    quote: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et.',
    avatarColor: 'from-teal-500 via-teal-700 to-teal-950',
    initial: 'D3'
  },
  {
    id: 4,
    tabLabel: 'ADIT',
    name: 'M. Aditia Putra Pratama',
    nim: '09021282530045',
    role: 'null',
    prodi: 'Teknik Informatika',
    faculty: 'Fakultas Ilmu Komputer, Universitas Sriwijaya',
    quote: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et.',
    avatarColor: 'from-sky-600 via-blue-800 to-indigo-950',
    initial: 'AD'
  }
];

export default function MemberSection() {
  // Awalnya toggle belum ada yang diklik
  const [activeId, setActiveId] = useState(null);

  const activeMember = MEMBERS.find((m) => m.id === activeId) || null;

  return (
    <section className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <Badge variant="amber" dot className="mx-auto">
          Tim Pengembang
        </Badge>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-['Poppins',sans-serif]">
          Meet our <span className="text-amber-400 font-serif italic ml-1">developer</span>
        </h2>
        <p className="text-xs sm:text-sm text-blue-100/80 max-w-xl mx-auto leading-relaxed">
          Tim mahasiswa pengembang TourKampus Universitas Sriwijaya.
        </p>
      </div>

      {/* 4-Item Toggle Bar dengan Animasi Geser Menggunakan Framer Motion layoutId */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#072a50]/85 backdrop-blur-md p-1.5 rounded-2xl border border-blue-300/30 grid grid-cols-2 sm:grid-cols-4 gap-1.5 relative shadow-xl shadow-[#031c38]/50">
          {MEMBERS.map((member) => {
            const isActive = activeId === member.id;
            return (
              <button
                key={member.id}
                onClick={() => setActiveId((prev) => (prev === member.id ? null : member.id))}
                className={`relative py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2 z-10 ${
                  isActive ? 'text-white' : 'text-blue-100/75 hover:text-white'
                }`}
              >
                {/* Background Slider Aktif (Animasi meluncur halus dari toggle aktif lama ke toggle baru) */}
                {isActive && (
                  <motion.div
                    layoutId="activeMemberToggle"
                    className="absolute inset-0 bg-[#125396] border border-amber-400/60 rounded-xl shadow-lg shadow-[#021326]/60"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30
                    }}
                  />
                )}

                <span className="relative z-10 flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActive ? 'bg-amber-400' : 'bg-sky-300/50'
                    }`}
                  />
                  <span>{member.tabLabel}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Konten Informasi Member */}
      <div className="max-w-3xl mx-auto min-h-[260px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {activeMember ? (
            <motion.div
              key={activeMember.id}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full"
            >
              <Card className="flex flex-col sm:flex-row items-center sm:items-stretch gap-6 sm:gap-8 p-6 sm:p-8 bg-gradient-to-r from-[#0c447d]/90 to-[#072f59]/95 border-blue-300/30 shadow-2xl">
                {/* Sebelah Kiri: Foto / Avatar Developer */}
                <div className="shrink-0 flex flex-col items-center">
                  <div
                    className={`w-36 h-44 sm:w-44 sm:h-52 rounded-2xl bg-gradient-to-br ${activeMember.avatarColor} border-2 border-amber-400/50 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden group`}
                  >
                    {/* Efek aksen visual */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.2),transparent_70%)]" />

                    <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white text-xl font-extrabold tracking-wider mb-2 shadow-inner">
                      {activeMember.initial}
                    </div>

                    <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold px-2.5 py-0.5 rounded-full bg-black/40 border border-amber-400/40">
                      UNSRI 2026
                    </span>
                  </div>
                </div>

                {/* Sebelah Kanan: Informasi Nama + NIM + Detail */}
                <div className="flex-1 flex flex-col justify-center text-center sm:text-left space-y-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/35 mb-2">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{activeMember.role}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                      {activeMember.name}
                    </h3>

                    {/* NIM Ditebalkan dengan Font Monospace Berwarna Emas */}
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-1.5">
                      <span className="text-xs text-blue-100 font-semibold">NIM:</span>
                      <span className="text-sm font-mono font-bold text-amber-300 tracking-wider px-2.5 py-0.5 rounded-lg bg-[#052345] border border-amber-400/35 shadow-inner">
                        {activeMember.nim}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1 text-xs text-blue-100">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="font-medium">{activeMember.prodi}</span>
                    </div>
                    <div className="text-[11px] text-blue-200/80">
                      {activeMember.faculty}
                    </div>
                  </div>

                  <p className="text-xs text-blue-50/90 italic bg-[#062447]/75 p-3 rounded-xl border border-blue-400/25 leading-relaxed">
                    &ldquo;{activeMember.quote}&rdquo;
                  </p>
                </div>
              </Card>
            </motion.div>
          ) : (
            /* Tampilan Awal saat Belum Ada Toggle yang Dipilih */
            <motion.div
              key="empty-prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <div className="p-8 sm:p-12 text-center rounded-2xl border border-dashed border-blue-300/40 bg-[#083461]/45 backdrop-blur-sm space-y-3 shadow-lg">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                  <Users className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Pilih Salah Satu Developer di Atas
                  </h4>
                  <p className="text-xs text-blue-100/75 max-w-md mx-auto mt-1 leading-relaxed">
                    Klik tombol nama developer untuk menampilkan foto, nama lengkap, NIM, serta peran kontribusi dalam proyek ini.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
