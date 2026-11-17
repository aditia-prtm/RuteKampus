import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { APP_INFO } from '../data/content.js';
import {
  ArrowRight,
  CheckCircle2,
  Bus,
  Truck,
  Layers,
  MapPin,
  Shapes
} from 'lucide-react';

// Aset Hero: Menggunakan unsri-desktop.png (3840x1306 Full Width)
import awan1 from '../assets/hero/awan-1.png';
import awan2 from '../assets/hero/awan-2.png';
import awan3 from '../assets/hero/awan-3.png';
import awan4 from '../assets/hero/awan-4.png';
import awan5 from '../assets/hero/awan-5.png';
import unsriDesktopImg from '../assets/hero/unsri-desktop.png';

// 1. Rombongan Awan Depan (Padat, tebal, dan berlapis membentuk lautan awan kumulus)
function DenseCloudBankFront() {
  return (
    <div className="relative shrink-0 w-[3000px] lg:w-[4000px] h-[400px] sm:h-[480px] lg:h-[560px] pointer-events-none select-none">
      <img
        src={awan2}
        alt="Awan Depan 1"
        className="absolute left-[-40px] lg:left-[-60px] bottom-[25px] w-[680px] lg:w-[920px] object-contain opacity-90 select-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.15)]"
      />
      <img
        src={awan1}
        alt="Awan Depan 2"
        className="absolute left-[300px] lg:left-[420px] bottom-[15px] w-[620px] lg:w-[860px] object-contain opacity-85 select-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
      />
      <img
        src={awan5}
        alt="Awan Depan 3"
        className="absolute left-[640px] lg:left-[880px] bottom-[30px] w-[740px] lg:w-[1000px] object-contain opacity-90 select-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.16)]"
      />
      <img
        src={awan3}
        alt="Awan Depan 4"
        className="absolute left-[1020px] lg:left-[1400px] bottom-[15px] w-[580px] lg:w-[800px] object-contain opacity-85 select-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
      />
      <img
        src={awan4}
        alt="Awan Depan 5"
        className="absolute left-[1340px] lg:left-[1820px] bottom-[35px] w-[680px] lg:w-[920px] object-contain opacity-90 select-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.15)]"
      />
      <img
        src={awan2}
        alt="Awan Depan 6"
        className="absolute left-[1700px] lg:left-[2300px] bottom-[20px] w-[720px] lg:w-[960px] object-contain opacity-90 select-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.16)]"
      />
      <img
        src={awan1}
        alt="Awan Depan 7"
        className="absolute left-[2060px] lg:left-[2780px] bottom-[10px] w-[640px] lg:w-[880px] object-contain opacity-85 select-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
      />
      <img
        src={awan5}
        alt="Awan Depan 8"
        className="absolute left-[2420px] lg:left-[3260px] bottom-[30px] w-[760px] lg:w-[1040px] object-contain opacity-90 select-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.16)]"
      />
      <img
        src={awan3}
        alt="Awan Depan 9"
        className="absolute left-[2720px] lg:left-[3680px] bottom-[20px] w-[600px] lg:w-[820px] object-contain opacity-85 select-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.14)]"
      />
    </div>
  );
}

// 2. Rombongan Awan Belakang (Kedalaman atmosferik 3D, mengisi sela background agar realistis)
function DenseCloudBankBack() {
  return (
    <div className="relative shrink-0 w-[3000px] lg:w-[4000px] h-[360px] sm:h-[440px] lg:h-[500px] pointer-events-none select-none">
      <img
        src={awan4}
        alt="Awan Belakang 1"
        className="absolute left-[60px] lg:left-[80px] bottom-[40px] w-[620px] lg:w-[840px] object-contain opacity-65 select-none"
      />
      <img
        src={awan3}
        alt="Awan Belakang 2"
        className="absolute left-[480px] lg:left-[660px] bottom-[55px] w-[540px] lg:w-[740px] object-contain opacity-60 select-none"
      />
      <img
        src={awan1}
        alt="Awan Belakang 3"
        className="absolute left-[880px] lg:left-[1200px] bottom-[45px] w-[600px] lg:w-[820px] object-contain opacity-70 select-none"
      />
      <img
        src={awan2}
        alt="Awan Belakang 4"
        className="absolute left-[1280px] lg:left-[1740px] bottom-[60px] w-[660px] lg:w-[900px] object-contain opacity-65 select-none"
      />
      <img
        src={awan5}
        alt="Awan Belakang 5"
        className="absolute left-[1750px] lg:left-[2380px] bottom-[50px] w-[700px] lg:w-[940px] object-contain opacity-70 select-none"
      />
      <img
        src={awan4}
        alt="Awan Belakang 6"
        className="absolute left-[2200px] lg:left-[2980px] bottom-[40px] w-[640px] lg:w-[860px] object-contain opacity-60 select-none"
      />
      <img
        src={awan1}
        alt="Awan Belakang 7"
        className="absolute left-[2600px] lg:left-[3520px] bottom-[55px] w-[580px] lg:w-[800px] object-contain opacity-65 select-none"
      />
    </div>
  );
}

export default function LandingPage() {
  const icons = [Bus, Truck, Layers];

  return (
    <div className="flex-1 bg-slate-950 text-white flex flex-col font-['Poppins',sans-serif]">
      {/* ========================================================
          HERO SECTION (TEPAT 1 LAYAR PENUH / EXACT 100VH FIT)
          - h-screen & h-[100dvh]: pas persis tinggi layar device tanpa sisa
          - Di-scroll ke bawah langsung masuk ke section berikutnya
          - unsri-desktop.png: 100% full width menempel di dasar hero
          - Layer 4 (teks + cta) berada di lapisan paling depan
         ======================================================== */}
      <section className="relative w-full h-screen h-[100dvh] overflow-hidden select-none bg-gradient-to-b from-[#031d3d] via-[#083768] via-55% to-[#145fa8] flex flex-col justify-between">
        {/* LAYER 1: LANGIT (Biru Langit Realistis dengan Gradasi Alami & Horizon Atmosphere Bloom) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#031d3d] via-[#083768] via-55% to-[#145fa8] z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_65%_at_50%_65%,rgba(35,130,225,0.25),transparent_75%)] z-1 pointer-events-none" />

        {/* LAYER 2A: AWAN BELAKANG (Paralaks Atmosferik Lebih Lambat, duration 90s) */}
        <div className="absolute inset-x-0 bottom-[10vh] sm:bottom-[13vh] lg:bottom-[16vh] z-10 pointer-events-none overflow-hidden flex items-end">
          <motion.div
            className="flex w-max"
            animate={{ x: ['-50%', '0%'] }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear',
              duration: 90
            }}
          >
            <DenseCloudBankBack />
            <DenseCloudBankBack />
          </motion.div>
        </div>

        {/* LAYER 2B: AWAN DEPAN UTAMA (Lebih Padat & Bergerak Dinamis, duration 65s) */}
        <div className="absolute inset-x-0 bottom-[7vh] sm:bottom-[10vh] lg:bottom-[13vh] z-11 pointer-events-none overflow-hidden flex items-end">
          <motion.div
            className="flex w-max"
            animate={{ x: ['-50%', '0%'] }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear',
              duration: 65
            }}
          >
            <DenseCloudBankFront />
            <DenseCloudBankFront />
          </motion.div>
        </div>

        {/* LAYER 3: GAMBAR KAMPUS UNSRI DESKTOP (100% FULL WIDTH MENEMPEL DASAR, DI BELAKANG CONTENT) */}
        <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none w-full">
          <img
            src={unsriDesktopImg}
            alt="Kampus Universitas Sriwijaya"
            className="w-full h-auto block select-none pointer-events-none"
          />
        </div>

        {/* LAYER 4: KONTEN TEKS & TOMBOL DI DEPAN GAMBAR KAMPUS (z-30) */}
        <div className="relative z-30 max-w-4xl mx-auto px-4 text-center pt-20 sm:pt-24 lg:pt-28 space-y-3 sm:space-y-4">
          {/* Badge Topik */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium shadow-md">
            <span>Tugas Besar Struktur Diskrit 2</span>
            <span>•</span>
            <span className="text-amber-300 font-semibold">RuteKampus UNSRI</span>
          </div>

          {/* Heading persis gaya laporUNSRI: Font Poppins + Serif Italic */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-xl leading-tight font-['Poppins',sans-serif]">
            Building a better campus,{' '}
            <span className="text-amber-400 italic font-serif font-normal text-3xl sm:text-5xl lg:text-6xl ml-1">
              together
            </span>
          </h1>

          {/* Subtitle font Poppins */}
          <p className="max-w-2xl mx-auto text-xs sm:text-sm lg:text-base text-slate-100/95 drop-shadow-md leading-relaxed font-normal">
            Bantu wujudkan rute shuttle bus Universitas Sriwijaya yang lebih efisien dan terencana.
            Kelilingi setiap fasilitas kampus dengan jarak perjalanan paling minimum bersama kami.
          </p>

          {/* Tombol Aksi Persis Style LaporUNSRI */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/campus"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#133e75] hover:bg-[#0f325e] text-white font-semibold text-xs sm:text-sm shadow-2xl shadow-blue-950/80 border border-blue-400/40 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Buka Peta Kampus</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/custom"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/30 shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Bikin Graf Sendiri</span>
            </Link>
          </div>
        </div>

        {/* Dummy bottom spacer untuk menjaga flex layout seimbang */}
        <div className="relative z-30 h-10 pointer-events-none" />
      </section>

      {/* ========================================================
          BAGIAN KONTEN LANDING PAGE LAINNYA (LANGSUNG MUNCUL SAAT SCROLL)
         ======================================================== */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* 2 Pilihan Mode Utama */}
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
              Pilihan Mode Simulasi RuteKampus
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Jelajahi studi kasus nyata kampus atau buat graf Anda sendiri:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Kartu 1: Peta Kampus Unsri */}
            <div className="group relative p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/80 border border-slate-800 hover:border-emerald-500/60 shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 mb-2">
                    Studi Kasus Nyata
                  </div>
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                    Rute Kampus Unsri Palembang
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                    Simulasi rute shuttle bus antar fakultas (FK, FH, Fasilkom, Pascasarjana, dll.) di Kampus Unsri Bukit Besar Palembang di atas peta nyata OpenStreetMap.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  to="/campus"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-lg shadow-emerald-600/25 transition cursor-pointer text-sm"
                >
                  <span>Buka Peta Kampus</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Kartu 2: Buat Graf Sendiri */}
            <div className="group relative p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/80 border border-slate-800 hover:border-teal-500/60 shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20 group-hover:scale-110 transition-transform">
                  <Shapes className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 mb-2">
                    Interactive Sandbox
                  </div>
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-teal-300 transition-colors">
                    Mode Bikin Graf Sendiri
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                    Kanvas bebas untuk menaruh simpul baru, menyambung sisi berbobot, menggeser titik (drag & drop), dan melihat langsung bagaimana Siklus Hamilton terbentuk.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  to="/custom"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 font-bold text-white shadow-lg shadow-teal-600/25 transition cursor-pointer text-sm"
                >
                  <span>Bikin Graf Sendiri</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Penerapan di Dunia Nyata */}
        <div className="space-y-6 pt-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-200">
              Penerapan di Dunia Nyata
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Mengapa pencarian Siklus Hamilton (TSP) sangat krusial dalam operasional transportasi?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {APP_INFO.realWorldExamples.map((item, idx) => {
              const Icon = icons[idx % icons.length];
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg hover:border-slate-700 transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alur Pipeline Algoritma */}
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">
              Alur Penyelesaian Algoritma TSP (Pipeline)
            </h2>
            <p className="text-xs text-slate-400">
              Kombinasi Heuristik Konstruktif (Nearest Neighbor) dan Perbaikan Lokal (2-Opt):
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {[
              { step: '1', title: 'Matriks Jarak GPS', desc: 'Menghitung jarak antar seluruh simpul/lokasi.' },
              { step: '2', title: 'Terminal Keberangkatan', desc: 'Menetapkan titik awal sebagai start dan finish siklus.' },
              { step: '3', title: 'Heuristik Greedy (NN)', desc: 'Selalu memilih simpul terdekat berikutnya yang belum dikunjungi.' },
              { step: '4', title: 'Penutupan Siklus', desc: 'Setelah semua simpul dikunjungi, kembali ke titik awal.' },
              { step: '5', title: 'Optimasi 2-Opt', desc: 'Mengurai persilangan rute dengan menukar pasangan sisi.' },
              { step: '6', title: 'Rute Optimal Final', desc: 'Menghasilkan Siklus Hamilton dengan jarak tempuh minimum.' }
            ].map((s) => (
              <div key={s.step} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <span className="font-mono text-emerald-400 font-bold block mb-1">
                  Tahap {s.step}
                </span>
                <strong className="text-slate-200 block mb-1">{s.title}</strong>
                <span className="text-slate-400 leading-normal">{s.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Asumsi Model Matematika */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Asumsi Model Matematika dalam Aplikasi</span>
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
            {APP_INFO.assumptions.map((asm, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-800/30 p-2.5 rounded-lg border border-slate-800">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{asm}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
