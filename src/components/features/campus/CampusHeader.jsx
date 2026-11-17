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
    <div className="mb-5 bg-gradient-to-r from-[#0e4984]/75 to-[#072f59]/90 border border-blue-300/25 backdrop-blur-md rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl shadow-[#021c38]/40">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-amber-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Peta Kampus Unsri Bukit Besar Palembang
            </h1>
            <div className="flex items-center gap-2 text-xs text-blue-200/80 mt-0.5 font-medium">
              <span>{placeNodes.length} Fasilitas Kampus</span>
              <span>•</span>
              <span>{waypointNodes.length} Tikungan</span>
              <span>•</span>
              <span>{edgeCount} Ruas Jalan</span>
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-blue-300/20 hidden lg:block" />

        {/* Pemilihan Titik Keberangkatan Awal */}
        <div className="flex items-center gap-2 bg-[#062648]/85 px-3 py-1.5 rounded-xl border border-blue-300/25">
          <Flag className="w-3.5 h-3.5 text-amber-400" />
          <label htmlFor="start-node" className="text-xs text-blue-100 font-medium">
            Titik Berangkat:
          </label>
          <select
            id="start-node"
            value={effectiveStartNode}
            onChange={(e) => onStartNodeChange(e.target.value)}
            className="bg-[#093563] border border-blue-300/30 text-amber-300 font-semibold text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
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
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
              isEditing
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-black/25'
                : 'bg-white/10 hover:bg-white/15 text-white border border-white/20'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Selesai Edit' : 'Kelola Peta'}</span>
          </button>
        ) : (
          <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 text-blue-200/70 text-xs border border-white/10">
            <Lock className="w-3 h-3 text-amber-400" />
            <span>Peta Terkunci</span>
          </span>
        )}

        <button
          onClick={onCopyJSON}
          title="Salin Data Simpul & Jalan dalam Format JSON"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/15 text-white border border-white/20 cursor-pointer transition"
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
            className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-blue-200 hover:text-white border border-white/20 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
