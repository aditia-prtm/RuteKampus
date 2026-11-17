import React from 'react';
import { Table, Sparkles } from 'lucide-react';

export default function DataPanel({ currentStep }) {
  if (!currentStep || !currentStep.data) return null;
  const { type, data } = currentStep;

  return (
    <div className="bg-gradient-to-b from-[#072449]/85 to-[#03152c]/90 border border-blue-500/20 rounded-2xl p-4 shadow-xl shadow-blue-950/40 text-white backdrop-blur-md">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-blue-900/50 text-xs font-semibold text-blue-200">
        <Table className="w-4 h-4 text-amber-400" />
        <span>Data & Analisis Algoritma TSP</span>
      </div>

      {/* 1. Tipe: Matriks Jarak */}
      {type === 'matrix' && data.distMatrix && (
        <div className="space-y-2 text-xs">
          <p className="text-[11px] text-blue-200/70">
            Matriks Jarak Lengkap (Meter) Antar Seluruh Titik:
          </p>
          <div data-lenis-prevent className="overflow-x-auto max-h-56 rounded-lg border border-blue-900/60">
            <table className="w-full text-center font-mono text-[11px]">
              <thead>
                <tr className="bg-[#03152c] text-blue-200">
                  <th className="p-1.5 border border-blue-900/50">Lokasi</th>
                  {data.nodeIds.map((id) => (
                    <th key={id} className="p-1.5 border border-blue-900/50">{id}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.nodeIds.map((u) => (
                  <tr key={u}>
                    <td className="p-1.5 bg-[#041a38] font-bold border border-blue-900/50 text-amber-300">{u}</td>
                    {data.nodeIds.map((v) => (
                      <td
                        key={v}
                        className={`p-1.5 border border-blue-950 ${
                          u === v ? 'text-blue-500/40' : 'text-blue-100'
                        }`}
                      >
                        {data.distMatrix[u]?.[v] ?? '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Tipe: Nearest Neighbor Step */}
      {type === 'nn-step' && data.candidates && (
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between text-[11px] text-blue-200/70">
            <span>Posisi Saat Ini: <strong className="text-amber-400 font-semibold">{data.from}</strong></span>
            <span>Jarak Tempuh: <strong className="text-white font-mono">{data.currentCost} m</strong></span>
          </div>

          <p className="text-[11px] text-blue-200/70">
            Kandidat Halte Belum Dikunjungi (Diurutkan dari Terdekat):
          </p>

          <div data-lenis-prevent className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {data.candidates.map((c, idx) => {
              const isChosen = c.node === data.to;
              return (
                <div
                  key={c.node}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition ${
                    isChosen
                      ? 'bg-amber-400/20 border-amber-400/50 text-amber-300 font-semibold shadow-sm'
                      : 'bg-[#031429]/60 border-blue-900/50 text-blue-200/70'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4 text-blue-400/50 font-mono text-[10px]">#{idx + 1}</span>
                    <span className="font-mono text-white">{c.node}</span>
                  </div>
                  <div className="font-mono text-right">
                    {c.distance} meter {isChosen && '★ Terpilih'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Tipe: 2-Opt Optimization */}
      {type === 'two-opt-step' && data.swappedNodes && (
        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 space-y-1">
            <div className="flex items-center gap-2 font-semibold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Pemotongan Persilangan Sisi Berhasil</span>
            </div>
            <p className="text-blue-100/80 text-[11px]">
              Menukar sisi yang saling bersilangan untuk membentuk lintasan paralel yang lebih pendek.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-[#041a38] border border-blue-900/50">
              <span className="text-[10px] text-blue-300/60 block">Jarak Dihemat</span>
              <span className="text-sm font-bold text-amber-400 font-mono">-{data.savedDistance} m</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#041a38] border border-blue-900/50">
              <span className="text-[10px] text-blue-300/60 block">Jarak Rute Baru</span>
              <span className="text-sm font-bold text-white font-mono">{data.currentTotalCost} m</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Tipe: Rute Akhir (Tour / Result) */}
      {(type === 'nn-complete' || type === 'result') && data.tour && (
        <div className="space-y-3 text-xs">
          <div>
            <span className="text-[11px] text-blue-200/70 block mb-1.5 font-medium">
              Urutan Singgah Bus Kampus (Siklus Hamilton):
            </span>
            <div className="p-3 bg-[#031429] border border-blue-500/30 rounded-xl font-mono text-amber-300 text-xs leading-relaxed break-words">
              {data.tour.join(' → ')}
            </div>
          </div>

          {type === 'result' && (
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-blue-900/50 text-center">
              <div className="p-2 rounded-xl bg-[#041a38] border border-blue-900/40">
                <span className="text-[10px] text-blue-300/60 block">Rute Awal</span>
                <span className="text-xs sm:text-sm font-bold text-blue-100 font-mono">{data.initialWeight} m</span>
              </div>
              <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/25">
                <span className="text-[10px] text-amber-300 block">Hemat 2-Opt</span>
                <span className="text-xs sm:text-sm font-bold text-amber-400 font-mono">-{data.savedWeight} m</span>
              </div>
              <div className="p-2 rounded-xl bg-[#133e75] border border-blue-400/40">
                <span className="text-[10px] text-blue-200 block">Jarak Optimal</span>
                <span className="text-xs sm:text-sm font-bold text-white font-mono">{data.totalWeight} m</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
