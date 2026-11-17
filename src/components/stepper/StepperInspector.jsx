import React, { useState } from 'react';
import { Table, Code2 } from 'lucide-react';
import ExplanationPanel from './ExplanationPanel.jsx';
import DataPanel from './DataPanel.jsx';
import PseudocodePanel from './PseudocodePanel.jsx';

/**
 * StepperInspector
 * Kontainer inspeksi terpadu yang menampilkan:
 * 1. Penjelasan langkah aktif & konsep matematis di bagian atas.
 * 2. Detail data/matriks atau pseudocode di bagian bawah yang dapat di-toggle.
 * Mengatasi masalah area kosong berlebih dan tidak memerangkap scroll mouse.
 */
export default function StepperInspector({ currentStep }) {
  const [detailTab, setDetailTab] = useState('data'); // 'data' | 'pseudocode'

  return (
    <div className="bg-gradient-to-b from-[#0e4984]/75 to-[#072f59]/90 border border-blue-300/25 rounded-2xl shadow-xl shadow-[#021c38]/40 backdrop-blur-md p-4 sm:p-5 flex flex-col gap-4">
      {/* 1. Penjelasan Langkah Utama & Konsep Matematis (Selalu Tampil) */}
      <ExplanationPanel currentStep={currentStep} />

      {/* Pembatas Visual Halus */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-300/20 to-transparent" />

      {/* 2. Bagian Detail & Analisis Interaktif */}
      <div className="space-y-3">
        {/* Toggle Pilihan: Data & Matriks vs Pseudocode */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold text-blue-200/80 uppercase tracking-wider">
            Inspeksi Langkah:
          </span>

          <div className="flex items-center gap-1 p-1 bg-[#062648]/90 rounded-xl border border-blue-300/20 text-xs">
            <button
              type="button"
              onClick={() => setDetailTab('data')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                detailTab === 'data'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-blue-200/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Data & Matriks</span>
            </button>

            <button
              type="button"
              onClick={() => setDetailTab('pseudocode')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                detailTab === 'pseudocode'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-blue-200/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Pseudocode</span>
            </button>
          </div>
        </div>

        {/* Konten Aktif: Data atau Pseudocode */}
        <div>
          {detailTab === 'data' ? (
            <DataPanel currentStep={currentStep} />
          ) : (
            <PseudocodePanel currentStep={currentStep} />
          )}
        </div>
      </div>
    </div>
  );
}
