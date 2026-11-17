import React from 'react';
import { MapPin, Flag, PlusCircle, Lock, Copy, Check, RotateCcw } from 'lucide-react';
import { APP_CONFIG } from '../../../data/config.js';

export default function CampusHeader({
  placeNodes,
  waypointNodes,
  edgeCount,
  effectiveStartNode,
  onStartNodeChange,
  isEditing,
  onToggleEdit,
  onCopyJSON,
  copied,
  onReset
}) {
  return (
    <div className="mb-4 bg-gradient-to-r from-[#072449]/90 to-[#03152c]/95 border border-blue-500/20 backdrop-blur-md rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl shadow-blue-950/40">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-400/20 text-amber-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Peta Kampus Unsri Bukit Besar Palembang
            </h1>
            <div className="flex items-center gap-2 text-xs text-blue-200/70 mt-0.5">
              <span>{placeNodes.length} Fasilitas Kampus</span>
              <span>•</span>
              <span>{waypointNodes.length} Tikungan</span>
              <span>•</span>
              <span>{edgeCount} Ruas Jalan</span>
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-blue-900/50 hidden lg:block" />

        {/* Pemilihan Titik Keberangkatan Awal */}
        <div className="flex items-center gap-2 bg-[#041935]/80 px-3 py-1.5 rounded-xl border border-blue-400/25">
          <Flag className="w-3.5 h-3.5 text-amber-400" />
          <label htmlFor="start-node" className="text-xs text-blue-100 font-medium">
            Titik Berangkat:
          </label>
          <select
            id="start-node"
            value={effectiveStartNode}
            onChange={(e) => onStartNodeChange(e.target.value)}
            className="bg-[#072449] border border-blue-400/30 text-amber-300 font-semibold text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
          >
            {placeNodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.label || n.id}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Aksi: Kelola Peta, Salin JSON, Reset */}
      <div className="flex items-center gap-2">
        {APP_CONFIG.ALLOW_CAMPUS_EDIT ? (
          <button
            onClick={onToggleEdit}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${
              isEditing
                ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                : 'bg-[#133e75] hover:bg-[#0f325e] text-white border border-blue-400/30'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Selesai Edit' : 'Kelola Peta'}</span>
          </button>
        ) : (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-950/60 text-blue-300/70 text-xs border border-blue-900/50">
            <Lock className="w-3 h-3 text-amber-400" />
            <span>Peta Kampus Terkunci</span>
          </span>
        )}

        <button
          onClick={onCopyJSON}
          title="Salin Data Simpul & Jalan dalam Format JSON"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/15 text-blue-100 border border-white/15 cursor-pointer transition"
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
            title="Reset ke Titik & Jalan Bawaan Preset"
            className="p-2 rounded-full bg-white/10 hover:bg-white/15 text-blue-200 hover:text-white border border-white/15 cursor-pointer transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
