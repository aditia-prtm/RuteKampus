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

// Aset Hero: Gambar Kampus Responsif & Awan
import awan1 from '../assets/hero/awan-1.png';
import awan2 from '../assets/hero/awan-2.png';
import awan3 from '../assets/hero/awan-3.png';
import awan4 from '../assets/hero/awan-4.png';
import awan5 from '../assets/hero/awan-5.png';
import unsriDesktopImg from '../assets/hero/unsri-desktop.png';
import unsriTabImg from '../assets/hero/unsri-tab.png';
import unsriMobileImg from '../assets/hero/unsri-mobile.png';

// Rombongan awan padat bertingkat persis seperti di referensi laporUNSRI
// Menjamin bagian bawah awan penuh padat menyatu ke belakang gedung tanpa ada celah kosong
function SmallCloudBank() {
  return (
    <div className="relative shrink-0 w-[2600px] lg:w-[3400px] h-[520px] sm:h-[600px] lg:h-[680px] pointer-events-none select-none">
      {/* Alas kabut awan lembut di dasar (menjamin tidak ada celah biru di belakang gedung) */}
      <div className="absolute inset-x-0 bottom-0 h-[260px] sm:h-[320px] bg-gradient-to-t from-white/45 via-white/25 to-transparent blur-2xl pointer-events-none" />

      {/* TIER 1: AWAN DASAR (Menempel dari dasar, mengisi penuh area bawah agar tidak ada celah kosong) */}
      <img
        src={awan2}
        alt="Awan Dasar 1"
        className="absolute left-[0px] bottom-[-20px] w-[550px] lg:w-[720px] object-contain opacity-85 select-none"
      />
      <img
        src={awan5}
        alt="Awan Dasar 2"
        className="absolute left-[360px] lg:left-[480px] bottom-[10px] w-[580px] lg:w-[760px] object-contain opacity-90 select-none"
      />
      <img
        src={awan4}
        alt="Awan Dasar 3"
        className="absolute left-[780px] lg:left-[1040px] bottom-[-15px] w-[560px] lg:w-[740px] object-contain opacity-85 select-none"
      />
      <img
        src={awan1}
        alt="Awan Dasar 4"
        className="absolute left-[1200px] lg:left-[1600px] bottom-[5px] w-[580px] lg:w-[760px] object-contain opacity-90 select-none"
      />
      <img
        src={awan3}
        alt="Awan Dasar 5"
        className="absolute left-[1620px] lg:left-[2160px] bottom-[-20px] w-[550px] lg:w-[720px] object-contain opacity-85 select-none"
      />
      <img
        src={awan5}
        alt="Awan Dasar 6"
        className="absolute left-[2050px] lg:left-[2720px] bottom-[10px] w-[600px] lg:w-[780px] object-contain opacity-90 select-none"
      />

      {/* TIER 2: AWAN TENGAH (Mengisi ketinggian transisi antara atap dan puncak awan) */}
      <img
        src={awan1}
        alt="Awan Tengah 1"
        className="absolute left-[80px] lg:left-[120px] bottom-[85px] sm:bottom-[115px] lg:bottom-[140px] w-[420px] lg:w-[560px] object-contain opacity-85 select-none"
      />
      <img
        src={awan4}
        alt="Awan Tengah 2"
        className="absolute left-[520px] lg:left-[700px] bottom-[95px] sm:bottom-[125px] lg:bottom-[150px] w-[440px] lg:w-[580px] object-contain opacity-88 select-none"
      />
      <img
        src={awan2}
        alt="Awan Tengah 3"
        className="absolute left-[960px] lg:left-[1300px] bottom-[80px] sm:bottom-[110px] lg:bottom-[135px] w-[450px] lg:w-[600px] object-contain opacity-85 select-none"
      />
      <img
        src={awan3}
        alt="Awan Tengah 4"
        className="absolute left-[1420px] lg:left-[1900px] bottom-[100px] sm:bottom-[130px] lg:bottom-[155px] w-[430px] lg:w-[570px] object-contain opacity-88 select-none"
      />
      <img
        src={awan4}
        alt="Awan Tengah 5"
        className="absolute left-[1880px] lg:left-[2500px] bottom-[90px] sm:bottom-[120px] lg:bottom-[145px] w-[460px] lg:w-[620px] object-contain opacity-85 select-none"
      />

      {/* TIER 3: AWAN PUNCAK KECIL (Diturunkan sedikit agar membingkai atap lebih pas persis laporUNSRI) */}
      <img
        src={awan2}
        alt="Awan Puncak 1"
        className="absolute left-[40px] lg:left-[60px] bottom-[195px] sm:bottom-[245px] lg:bottom-[300px] w-[280px] sm:w-[360px] lg:w-[460px] max-h-[170px] sm:max-h-[220px] lg:max-h-[270px] object-contain opacity-88 select-none"
      />
      <img
        src={awan3}
        alt="Awan Puncak 2"
        className="absolute left-[260px] lg:left-[360px] bottom-[215px] sm:bottom-[265px] lg:bottom-[320px] w-[260px] sm:w-[330px] lg:w-[420px] max-h-[150px] sm:max-h-[190px] lg:max-h-[240px] object-contain opacity-82 select-none"
      />
      <img
        src={awan5}
        alt="Awan Puncak 3"
        className="absolute left-[480px] lg:left-[660px] bottom-[205px] sm:bottom-[255px] lg:bottom-[310px] w-[300px] sm:w-[390px] lg:w-[490px] max-h-[170px] sm:max-h-[220px] lg:max-h-[270px] object-contain opacity-88 select-none"
      />
      <img
        src={awan1}
        alt="Awan Puncak 4"
        className="absolute left-[740px] lg:left-[1020px] bottom-[225px] sm:bottom-[275px] lg:bottom-[330px] w-[270px] sm:w-[350px] lg:w-[440px] max-h-[150px] sm:max-h-[200px] lg:max-h-[250px] object-contain opacity-82 select-none"
      />
      <img
        src={awan4}
        alt="Awan Puncak 5"
        className="absolute left-[980px] lg:left-[1340px] bottom-[210px] sm:bottom-[260px] lg:bottom-[315px] w-[290px] sm:w-[380px] lg:w-[480px] max-h-[160px] sm:max-h-[210px] lg:max-h-[260px] object-contain opacity-88 select-none"
      />
      <img
        src={awan2}
        alt="Awan Puncak 6"
        className="absolute left-[1240px] lg:left-[1700px] bottom-[220px] sm:bottom-[270px] lg:bottom-[325px] w-[280px] sm:w-[360px] lg:w-[460px] max-h-[160px] sm:max-h-[210px] lg:max-h-[260px] object-contain opacity-85 select-none"
      />
      <img
        src={awan3}
        alt="Awan Puncak 7"
        className="absolute left-[1500px] lg:left-[2060px] bottom-[205px] sm:bottom-[255px] lg:bottom-[310px] w-[260px] sm:w-[340px] lg:w-[430px] max-h-[150px] sm:max-h-[190px] lg:max-h-[240px] object-contain opacity-82 select-none"
      />
      <img
        src={awan5}
        alt="Awan Puncak 8"
        className="absolute left-[1740px] lg:left-[2380px] bottom-[225px] sm:bottom-[275px] lg:bottom-[330px] w-[310px] sm:w-[400px] lg:w-[500px] max-h-[170px] sm:max-h-[220px] lg:max-h-[270px] object-contain opacity-88 select-none"
      />
      <img
        src={awan1}
        alt="Awan Puncak 9"
        className="absolute left-[2040px] lg:left-[2780px] bottom-[210px] sm:bottom-[260px] lg:bottom-[315px] w-[280px] sm:w-[360px] lg:w-[450px] max-h-[150px] sm:max-h-[200px] lg:max-h-[250px] object-contain opacity-82 select-none"
      />
      <img
        src={awan4}
        alt="Awan Puncak 10"
        className="absolute left-[2320px] lg:left-[3140px] bottom-[215px] sm:bottom-[265px] lg:bottom-[320px] w-[290px] sm:w-[380px] lg:w-[480px] max-h-[160px] sm:max-h-[210px] lg:max-h-[260px] object-contain opacity-88 select-none"
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
          - Mobile & Tablet: Konten di tengah secara vertikal (justify-center)
          - Desktop: Konten di area atas diturunkan proporsional (lg:justify-start, lg:pt-36)
         ======================================================== */}
      <section className="relative w-full h-screen h-[100dvh] overflow-hidden bg-gradient-to-b from-[#031d3d] via-[#083768] via-55% to-[#145fa8] flex flex-col items-center justify-center lg:justify-start">
        {/* LAYER 1: LANGIT (Biru Langit Realistis dengan Gradasi Alami & Horizon Atmosphere Bloom) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#031d3d] via-[#083768] via-55% to-[#145fa8] z-0 select-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_65%_at_50%_65%,rgba(35,130,225,0.25),transparent_75%)] z-1 pointer-events-none select-none" />

        {/* LAYER 2: ROMBONGAN AWAN BERLAPIS MENYATU DARI DASAR HINGGA ATAP (ZERO GAP) */}
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none select-none overflow-hidden flex items-end">
          <motion.div
            className="flex w-max select-none"
            animate={{ x: ['-50%', '0%'] }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear',
              duration: 120
            }}
          >
            <SmallCloudBank />
            <SmallCloudBank />
          </motion.div>
        </div>

        {/* LAYER 3: GAMBAR KAMPUS UNSRI RESPONSIF (Desktop: unsri-desktop, Tab: unsri-tab, Mobile: unsri-mobile) */}
        <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none select-none w-full">
          <picture className="w-full h-auto block select-none pointer-events-none">
            {/* Desktop: >= 1024px */}
            <source media="(min-width: 1024px)" srcSet={unsriDesktopImg} />
            {/* Tablet: >= 640px */}
            <source media="(min-width: 640px)" srcSet={unsriTabImg} />
            {/* Mobile: default fallback */}
            <img
              src={unsriMobileImg}
              alt="Kampus Universitas Sriwijaya"
              className="w-full h-auto block select-none pointer-events-none"
            />
          </picture>
        </div>

        {/* LAYER 4: KONTEN TEKS & TOMBOL (Mobile & Tab: Vertikal Center; Desktop: Pas di Langit Atas) */}
        <div className="relative z-30 max-w-4xl mx-auto px-4 text-center space-y-3 sm:space-y-4 pt-0 lg:pt-36 select-text my-auto lg:my-0">
          {/* Heading persis gaya laporUNSRI: Font Poppins + Serif Italic */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow-xl leading-tight font-['Poppins',sans-serif]">
            Building a better campus,{' '}
            <span className="text-amber-400 italic font-serif font-normal text-3xl sm:text-4xl lg:text-5xl ml-1">
              together
            </span>
          </h1>

          {/* Subtitle font Poppins */}
          <p className="max-w-2xl mx-auto text-xs sm:text-sm lg:text-base text-slate-100/95 drop-shadow-md leading-relaxed font-lg">
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
