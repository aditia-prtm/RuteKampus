import React from 'react';
import { Table, ListOrdered, Sparkles, CheckCircle2 } from 'lucide-react';

export default function DataPanel({ currentStep }) {
  if (!currentStep || !currentStep.data) return null;
  const { type, data } = currentStep;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg text-white">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800 text-xs font-semibold text-slate-300">
        <Table className="w-4 h-4 text-emerald-400" />
        <span>Data & Analisis Algoritma TSP</span>
      </div>

      {/* 1. Tipe: Matriks Jarak */}
      {type === 'matrix' && data.distMatrix && (
        <div className="space-y-2 text-xs">
          <p className="text-[11px] text-slate-400">
            Matriks Jarak Lengkap (Meter) Antar Seluruh Titik:
          </p>
          <div className="overflow-x-auto max-h-56">
            <table className="w-full text-center border border-slate-800 font-mono text-[11px]">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300">
                  <th className="p-1 border border-slate-700">Lokasi</th>
                  {data.nodeIds.map((id) => (
                    <th key={id} className="p-1 border border-slate-700">{id}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.nodeIds.map((u) => (
                  <tr key={u}>
                    <td className="p-1 bg-slate-800/50 font-bold border border-slate-700 text-slate-200">{u}</td>
                    {data.nodeIds.map((v) => (
                      <td
                        key={v}
                        className={`p-1 border border-slate-800 ${
                          u === v ? 'text-slate-600' : 'text-slate-300'
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
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Posisi Saat Ini: <strong className="text-emerald-400">{data.from}</strong></span>
            <span>Jarak Tempuh: <strong className="text-white font-mono">{data.currentCost} m</strong></span>
          </div>

          <p className="text-[11px] text-slate-400">
            Kandidat Halte Belum Dikunjungi (Diurutkan dari Terdekat):
          </p>

          <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
            {data.candidates.map((c, idx) => {
              const isChosen = c.node === data.to;
              return (
                <div
                  key={c.node}
                  className={`p-2 rounded border flex items-center justify-between text-xs ${
                    isChosen
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-semibold'
                      : 'bg-slate-800/40 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4 text-slate-500 font-mono text-[10px]">#{idx + 1}</span>
                    <span className="font-mono text-slate-200">{c.node}</span>
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
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1">
            <div className="flex items-center gap-2 font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Pemotongan Persilangan Sisi Berhasil</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              Menukar sisi yang bersilangan untuk membentuk lintasan paralel yang lebih pendek.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 rounded bg-slate-800/60 border border-slate-700/50">
              <span className="text-[10px] text-slate-400 block">Jarak Dihemat</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">-{data.savedDistance} m</span>
            </div>
            <div className="p-2 rounded bg-slate-800/60 border border-slate-700/50">
              <span className="text-[10px] text-slate-400 block">Jarak Rute Baru</span>
              <span className="text-sm font-bold text-white font-mono">{data.currentTotalCost} m</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Tipe: Rute Akhir (Tour / Result) */}
      {(type === 'nn-complete' || type === 'result') && data.tour && (
        <div className="space-y-3 text-xs">
          <div>
            <span className="text-[11px] text-slate-400 block mb-1 font-medium">
              Urutan Singgah Bus Kampus (Siklus Hamilton):
            </span>
            <div className="p-2.5 bg-slate-800/80 border border-slate-700/70 rounded-lg font-mono text-emerald-300 text-xs leading-relaxed break-words">
              {data.tour.join(' → ')}
            </div>
          </div>

          {type === 'result' && (
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
              <div className="p-2 rounded bg-slate-800/50">
                <span className="text-[10px] text-slate-400 block">Rute Awal (Greedy)</span>
                <span className="text-xs sm:text-sm font-bold text-slate-300 font-mono">{data.initialWeight} m</span>
              </div>
              <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[10px] text-emerald-300 block">Hemat 2-Opt</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-400 font-mono">-{data.savedWeight} m</span>
              </div>
              <div className="p-2 rounded bg-teal-500/20 border border-teal-500/40">
                <span className="text-[10px] text-teal-300 block">Jarak Optimal</span>
                <span className="text-xs sm:text-sm font-bold text-teal-300 font-mono">{data.totalWeight} m</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
