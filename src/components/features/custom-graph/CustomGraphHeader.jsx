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
    <div className="mb-4 sm:mb-5 bg-gradient-to-r from-[#0e4984]/75 to-[#072f59]/90 border border-blue-300/25 backdrop-blur-md rounded-2xl p-3.5 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5 sm:gap-4 shadow-xl shadow-[#021c38]/40">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-white/10 border border-white/15 text-amber-400 shrink-0">
            <Shapes className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base lg:text-lg font-bold text-white tracking-tight leading-tight">
              Mode Bikin Graf Sendiri
            </h1>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-blue-200/80 mt-0.5 font-medium">
              <span>{nodeCount} Simpul</span>
              <span>•</span>
              <span>{edgeCount} Sisi Berbobot</span>
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-blue-300/20 hidden lg:block" />

        {/* Preset Graf Cepat (Bisa digeser horizontal di HP) */}
        <div className="flex items-center gap-1.5 bg-[#062648]/85 p-1 rounded-xl border border-blue-300/20 text-xs w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => onSelectPreset('triangle')}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg text-blue-200/90 hover:text-white hover:bg-white/10 transition cursor-pointer font-medium whitespace-nowrap shrink-0"
          >
            Segitiga (3)
          </button>
          <button
            onClick={() => onSelectPreset('square')}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg text-blue-200/90 hover:text-white hover:bg-white/10 transition cursor-pointer font-medium whitespace-nowrap shrink-0"
          >
            Persegi (4)
          </button>
          <button
            onClick={() => onSelectPreset('k5')}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg text-blue-200/90 hover:text-white hover:bg-white/10 transition cursor-pointer font-medium whitespace-nowrap shrink-0"
          >
            Pentagon (5)
          </button>
          <button
            onClick={onConnectAll}
            title="Hubungkan semua simpul dengan sisi berbobot Euclidean otomatis"
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-amber-300 hover:bg-amber-400/20 transition cursor-pointer font-semibold whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Hubungkan Semua</span>
          </button>
        </div>
      </div>

      {/* Start Node Selector & Clear */}
      <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end flex-wrap pt-1 md:pt-0 border-t md:border-t-0 border-blue-300/10">
        <div className="flex items-center gap-2 bg-[#062648]/85 px-3 py-1.5 rounded-xl border border-blue-300/25">
          <Flag className="w-3.5 h-3.5 text-amber-400" />
          <label htmlFor="start-custom" className="text-xs text-blue-100 font-medium whitespace-nowrap">
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
          className="flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-medium bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-400/30 transition cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Kosongkan</span>
        </button>
      </div>
    </div>
  );
}
