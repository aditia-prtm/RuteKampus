import React from 'react';
import { MapPin, Flag, PlusCircle, Lock, Copy, Check, RotateCcw } from 'lucide-react';
import { APP_CONFIG } from '../../../data/config.js';

export default function CampusHeader({
  placeNodes,
  waypointNodes,
  edgeCount,
  effectiveStartNode,
  onStartNodeChange,
  algorithm = 'nearest-neighbor',
  onAlgorithmChange,
  isEditing,
  onToggleEdit,
  onCopyJSON,
  copied,
  onReset
}) {
  return (
    <div className="mb-4 sm:mb-5 bg-gradient-to-r from-[#0e4984]/75 to-[#072f59]/90 border border-blue-300/25 backdrop-blur-md rounded-2xl p-3.5 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5 sm:gap-4 shadow-xl shadow-[#021c38]/40">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-white/10 border border-white/15 text-amber-400 shrink-0">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base lg:text-lg font-bold text-white tracking-tight leading-tight">
              Peta Kampus Unsri Bukit Besar
            </h1>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-blue-200/80 mt-0.5 font-medium flex-wrap">
              <span>{placeNodes.length} Fasilitas</span>
              <span>•</span>
              <span>{waypointNodes.length} Tikungan</span>
              <span>•</span>
              <span>{edgeCount} Ruas Jalan</span>
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-blue-300/20 hidden lg:block" />

        {/* Pemilihan Titik Keberangkatan Awal */}
        <div className="flex items-center gap-2 bg-[#062648]/85 px-3 py-1.5 rounded-xl border border-blue-300/25 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-1.5 shrink-0">
            <Flag className="w-3.5 h-3.5 text-amber-400" />
            <label htmlFor="start-node" className="text-xs text-blue-100 font-medium whitespace-nowrap">
              Titik Berangkat:
            </label>
          </div>
          <select
            id="start-node"
            value={effectiveStartNode}
            onChange={(e) => onStartNodeChange(e.target.value)}
            className="bg-[#093563] border border-blue-300/30 text-amber-300 font-semibold text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer max-w-[160px] sm:max-w-none truncate"
          >
            {placeNodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.label || n.id}
              </option>
            ))}
          </select>
        </div>

        {/* Pilihan Algoritma: Nearest Neighbor vs Brute Force */}
        {onAlgorithmChange && (
          <div className="flex items-center gap-1 bg-[#062648]/85 p-1 rounded-xl border border-blue-300/25 w-full sm:w-auto justify-center">
            <button
              type="button"
              onClick={() => onAlgorithmChange('nearest-neighbor')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                algorithm === 'nearest-neighbor'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-blue-200 hover:text-white'
              }`}
              title="Heuristik Greedy (Cepat, efisien untuk n > 8)"
            >
              Nearest Neighbor
            </button>
            <button
              type="button"
              disabled={placeNodes.length > 8}
              onClick={() => onAlgorithmChange('brute-force')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                algorithm === 'brute-force'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : placeNodes.length > 8
                  ? 'text-blue-300/40 cursor-not-allowed opacity-60'
                  : 'text-blue-200 hover:text-white cursor-pointer'
              }`}
              title={
                placeNodes.length > 8
                  ? `Brute Force dinonaktifkan (n = ${placeNodes.length} > 8) untuk mencegah browser crash`
                  : 'Brute Force Eksak (100% Minimum mutlak, mencoba semua siklus)'
              }
            >
              <span>Brute Force</span>
              {placeNodes.length > 8 && (
                <span className="text-[9px] bg-rose-500/25 text-rose-300 px-1 py-0.5 rounded font-mono">n&gt;8</span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Aksi: Kelola Peta, Salin JSON, Reset */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-start md:justify-end flex-wrap pt-1 md:pt-0 border-t md:border-t-0 border-blue-300/10">
        {APP_CONFIG.ALLOW_CAMPUS_EDIT ? (
          <button
            onClick={onToggleEdit}
            className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
              isEditing
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-black/25'
                : 'bg-white/10 hover:bg-white/15 text-white border border-white/20'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Selesai Edit' : 'Kelola Peta'}</span>
          </button>
        ) : (
          <span className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-white/5 text-blue-200/70 text-xs border border-white/10">
            <Lock className="w-3 h-3 text-amber-400" />
            <span>Peta Terkunci</span>
          </span>
        )}

        <button
          onClick={onCopyJSON}
          title="Salin Data Simpul & Jalan dalam Format JSON"
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/15 text-white border border-white/20 cursor-pointer transition"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300 font-semibold">Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Salin JSON</span>
            </>
          )}
        </button>

        {APP_CONFIG.ALLOW_CAMPUS_EDIT && onReset && (
          <button
            onClick={onReset}
            title="Kembalikan Peta ke Preset Awal"
            className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/15 text-blue-200 hover:text-white border border-white/20 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
