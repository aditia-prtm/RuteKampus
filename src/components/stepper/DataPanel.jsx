import React from 'react';
import { Table, CheckCircle2 } from 'lucide-react';

export default function DataPanel({ currentStep }) {
  if (!currentStep || !currentStep.data) return null;
  const { type, data } = currentStep;
  const nodeLabels = data.nodeLabels || {};
  const getLabel = (id) => nodeLabels[id] || id;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b border-blue-300/20 text-xs font-semibold text-blue-100">
        <Table className="w-4 h-4 text-amber-400" />
        <span>Data & Analisis Algoritma Nearest Neighbor</span>
      </div>

      {/* 1. Tipe: Matriks Jarak */}
      {type === 'matrix' && data.distMatrix && (
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px] text-blue-200/80">
            <span>Matriks Jarak Terpendek (Meter) Antar Fasilitas:</span>
            <span className="text-[10px] text-amber-300 sm:hidden font-medium">Geser ↔</span>
          </div>
          <div className="overflow-x-auto max-h-72 rounded-xl border border-blue-300/20 bg-[#062648]/85">
            <table className="w-full text-center font-mono text-[11px]">
              <thead>
                <tr className="bg-[#093563] text-blue-100 border-b border-blue-300/20">
                  <th className="p-2 border-r border-blue-300/20 whitespace-nowrap text-left pl-3">Lokasi</th>
                  {data.nodeIds.map((id) => (
                    <th
                      key={id}
                      className="p-2 border-r border-blue-300/15 last:border-r-0 whitespace-nowrap"
                      title={id !== getLabel(id) ? `ID: ${id}` : undefined}
                    >
                      {getLabel(id)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.nodeIds.map((u) => (
                  <tr key={u} className="border-b border-blue-300/10 last:border-b-0">
                    <td
                      className="p-2 bg-[#093563]/60 font-bold border-r border-blue-300/20 text-amber-300 whitespace-nowrap text-left pl-3"
                      title={u !== getLabel(u) ? `ID: ${u}` : undefined}
                    >
                      {getLabel(u)}
                    </td>
                    {data.nodeIds.map((v) => (
                      <td
                        key={v}
                        className={`p-2 border-r border-blue-300/10 last:border-r-0 whitespace-nowrap ${
                          u === v ? 'text-blue-300/30' : 'text-blue-100'
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

      {/* 2. Tipe: Titik Awal Keberangkatan */}
      {type === 'nn-start' && (
        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-blue-500/15 border border-blue-400/30 text-blue-200 space-y-1">
            <span className="font-semibold text-white block">
              Inisialisasi Keberangkatan Tur
            </span>
            <p className="text-blue-100/90 text-[11px] leading-relaxed">
              Titik awal dipilih sebagai simpul awal tur keliling: <strong className="text-amber-400 font-mono font-bold">[{getLabel(data.current)}]</strong>. Kendaraan shuttle akan mengunjungi seluruh {data.unvisited?.length} lokasi lainnya sebelum kembali ke titik ini.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#062648]/85 border border-blue-300/20 text-center">
            <span className="text-[10px] text-blue-200/70 block">Lokasi Belum Dikunjungi</span>
            <span className="text-sm font-bold text-amber-400 font-mono">{data.unvisited?.length} Lokasi</span>
          </div>
        </div>
      )}

      {/* 3. Tipe: Nearest Neighbor Step */}
      {type === 'nn-step' && data.candidates && (
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#062648]/85 border border-blue-300/20 text-xs">
            <span className="text-blue-200/80">Posisi Saat Ini: <strong className="text-amber-400 font-semibold">{getLabel(data.from)}</strong></span>
            <span className="text-blue-200/80">Total Jarak Tempuh: <strong className="text-white font-mono">{data.currentCost} m</strong></span>
          </div>

          <p className="text-[11px] text-blue-200/80">
            Kandidat Lokasi Belum Dikunjungi (Diurutkan dari Terdekat):
          </p>

          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {data.candidates.map((c, idx) => {
              const isChosen = c.node === data.to;
              return (
                <div
                  key={c.node}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition ${
                    isChosen
                      ? 'bg-amber-400/20 border-amber-400/40 text-amber-300 font-semibold shadow-sm'
                      : 'bg-[#062648]/60 border-blue-300/15 text-blue-100/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4 text-blue-300/50 font-mono text-[10px]">#{idx + 1}</span>
                    <span className="font-mono text-white font-bold">{getLabel(c.node)}</span>
                    {c.node !== getLabel(c.node) && (
                      <span className="text-[10px] text-blue-300/50 font-mono">({c.node})</span>
                    )}
                  </div>
                  <div className="font-mono text-right flex items-center gap-1.5">
                    <span>{c.distance} meter</span>
                    {isChosen && (
                      <span className="inline-flex items-center gap-1 text-amber-300 font-bold ml-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Pilihan Terdekat</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Tipe: Rute Akhir (Tour / Result) */}
      {(type === 'nn-complete' || type === 'result') && data.tour && (
        <div className="space-y-3 text-xs">
          <div>
            <span className="text-[11px] text-blue-200/80 block mb-1.5 font-medium">
              Urutan Kunjungan Lokasi (Siklus Hamilton):
            </span>
            <div className="p-3 bg-[#062648]/85 border border-blue-300/20 rounded-xl font-mono text-amber-300 text-xs leading-relaxed break-words">
              {data.tour.map((id) => getLabel(id)).join(' → ')}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-2 border-t border-blue-300/20 text-center">
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#062648]/85 border border-blue-300/20">
              <span className="text-[10px] text-blue-200/70 block">Algoritma</span>
              <span className="text-[11px] sm:text-sm font-bold text-blue-100">Nearest Neighbor</span>
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold shadow-md shadow-black/25">
              <span className="text-[10px] text-slate-900 block font-semibold">Total Jarak Tur</span>
              <span className="text-[11px] sm:text-sm font-extrabold font-mono">{data.totalWeight || data.currentCost} m</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
