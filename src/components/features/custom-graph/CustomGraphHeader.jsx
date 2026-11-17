import React from 'react';
import { Shapes, Flag, Trash2, Sparkles } from 'lucide-react';

export default function CustomGraphHeader({
  nodeCount,
  edgeCount,
  nodes,
  effectiveStartNode,
  onStartNodeChange,
  onSelectPreset,
  onConnectAll,
  onClear
}) {
  return (
    <div className="mb-5 bg-gradient-to-r from-[#0e4984]/75 to-[#072f59]/90 border border-blue-300/25 backdrop-blur-md rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl shadow-[#021c38]/40">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-amber-400">
            <Shapes className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Mode Bikin Graf Sendiri
            </h1>
            <div className="flex items-center gap-2 text-xs text-blue-200/80 mt-0.5 font-medium">
              <span>{nodeCount} Simpul</span>
              <span>•</span>
              <span>{edgeCount} Sisi Berbobot</span>
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-blue-300/20 hidden lg:block" />

        {/* Preset Graf Cepat */}
        <div className="flex items-center gap-1.5 bg-[#062648]/85 p-1 rounded-xl border border-blue-300/20 text-xs">
          <button
            onClick={() => onSelectPreset('triangle')}
            className="px-3 py-1.5 rounded-lg text-blue-200/90 hover:text-white hover:bg-white/10 transition cursor-pointer font-medium"
          >
            Segitiga (3)
          </button>
          <button
            onClick={() => onSelectPreset('square')}
            className="px-3 py-1.5 rounded-lg text-blue-200/90 hover:text-white hover:bg-white/10 transition cursor-pointer font-medium"
          >
            Persegi (4)
          </button>
          <button
            onClick={() => onSelectPreset('k5')}
            className="px-3 py-1.5 rounded-lg text-blue-200/90 hover:text-white hover:bg-white/10 transition cursor-pointer font-medium"
          >
            Pentagon (5)
          </button>
          <button
            onClick={onConnectAll}
            title="Hubungkan semua simpul dengan sisi berbobot Euclidean otomatis"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-amber-300 hover:bg-amber-400/20 transition cursor-pointer font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Hubungkan Semua</span>
          </button>
        </div>
      </div>

      {/* Start Node Selector & Clear */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-[#062648]/85 px-3 py-1.5 rounded-xl border border-blue-300/25">
          <Flag className="w-3.5 h-3.5 text-amber-400" />
          <label htmlFor="start-custom" className="text-xs text-blue-100 font-medium">
            Simpul Awal:
          </label>
          <select
            id="start-custom"
            value={effectiveStartNode}
            onChange={(e) => onStartNodeChange(e.target.value)}
            className="bg-[#093563] border border-blue-300/30 text-amber-300 font-semibold text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
          >
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>
                Simpul {n.id}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onClear}
          title="Kosongkan Kanvas Graf"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-400/30 transition cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Kosongkan</span>
        </button>
      </div>
    </div>
  );
}
