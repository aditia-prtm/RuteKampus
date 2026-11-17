import React from 'react';
import { Network, CheckCircle, Code2, BookOpen } from 'lucide-react';
import Card from '../../common/Card.jsx';
import Badge from '../../common/Badge.jsx';

export default function GraphTheorySection() {
  const assumptions = [
    'Graf Terhubung & Berbobot: Setiap ruas jalan kampus memiliki bobot jarak dalam meter berbasis koordinat nyata.',
    'Siklus Hamilton: Setiap fakultas/lokasi dikunjungi tepat satu kali sebelum kendaraan kembali ke titik keberangkatan awal.',
    'Heuristik Greedy (Nearest Neighbor): Menghasilkan rute awal secara cepat dengan selalu melangkah ke titik terdekat berikutnya.',
    'Optimasi 2-Opt (Local Search): Menghilangkan simpul sisi yang saling bersilangan untuk memperpendek total jarak tempuh rute.'
  ];

  return (
    <section className="space-y-8 pt-6 pb-8">
      <div className="text-center space-y-2">
        <Badge variant="amber" dot className="mx-auto">
          Materi Kuliah
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Landasan Teori <span className="text-amber-400 font-serif italic">Struktur Diskrit 2</span>
        </h2>
        <p className="text-xs sm:text-sm text-blue-200/70 max-w-xl mx-auto leading-relaxed">
          Penyelesaian Traveling Salesperson Problem (TSP) pada graf jalan menggunakan kombinasi algoritma konstruktif dan perbaikan lokal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Kolom Kiri: Prinsip Matematis */}
        <Card className="lg:col-span-7 space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Network className="w-4 h-4" />
              <span>Prinsip & Asumsi Model</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Formulasi Masalah Tur Bus Kampus
            </h3>
            <p className="text-xs text-blue-200/80 leading-relaxed">
              Diberikan himpunan simpul lokasi fasilitas kampus <code className="text-amber-300 font-mono">V</code> dan matriks jarak <code className="text-amber-300 font-mono">D[u][v]</code>. Algoritma mencari permutasi simpul <code className="text-blue-200 font-mono">T = (v_1, v_2, ..., v_n, v_1)</code> yang meminimalkan total bobot jarak perjalanan.
            </p>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-blue-900/40">
            {assumptions.map((text, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-blue-100/90 leading-relaxed">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Kolom Kanan: Rangkuman Alur Algoritma */}
        <Card className="lg:col-span-5 space-y-4 flex flex-col justify-between bg-gradient-to-b from-[#082a54]/90 to-[#03152c]/95">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Code2 className="w-4 h-4" />
              <span>Pipeline Algoritma</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Dua Tahap Solusi
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-blue-950/70 border border-blue-500/20 space-y-1">
              <div className="font-bold text-amber-300 flex items-center justify-between">
                <span>1. Matriks Jarak Jalan</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-900/60 text-blue-200">Floyd-Warshall</span>
              </div>
              <p className="text-blue-200/70 text-[11px] leading-relaxed">
                Menghitung lintasan terpendek antar seluruh pasangan fasilitas kampus dengan mempertimbangkan tikungan jalan nyata.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-950/70 border border-blue-500/20 space-y-1">
              <div className="font-bold text-amber-300 flex items-center justify-between">
                <span>2. Konstruksi Tur Awal</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-900/60 text-blue-200">Nearest Neighbor</span>
              </div>
              <p className="text-blue-200/70 text-[11px] leading-relaxed">
                Menyusun siklus awal dengan memilih lokasi terdekat berikutnya secara greedy hingga kembali ke terminal awal.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-950/70 border border-blue-500/20 space-y-1">
              <div className="font-bold text-teal-300 flex items-center justify-between">
                <span>3. Optimasi Persilangan</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-teal-900/60 text-teal-200">2-Opt Swap</span>
              </div>
              <p className="text-blue-200/70 text-[11px] leading-relaxed">
                Mendeteksi sisi rute yang saling berpotongan dan menukarnya untuk mendapatkan rute tur dengan total jarak terpendek.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
