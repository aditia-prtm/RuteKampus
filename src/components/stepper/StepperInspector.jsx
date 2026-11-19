import React from 'react';
import ExplanationPanel from './ExplanationPanel.jsx';
import DataPanel from './DataPanel.jsx';

/**
 * StepperInspector
 * Kontainer inspeksi visualisasi algoritma:
 * 1. Penjelasan langkah aktif & konsep matematis di bagian atas.
 * 2. Data matriks jarak & kalkulasi heuristik Nearest Neighbor di bagian bawah.
 */
export default function StepperInspector({ currentStep }) {
  return (
    <div className="bg-gradient-to-b from-[#0e4984]/75 to-[#072f59]/90 border border-blue-300/25 rounded-2xl shadow-xl shadow-[#021c38]/40 backdrop-blur-md p-4 sm:p-5 flex flex-col gap-4">
      {/* 1. Penjelasan Langkah Utama & Konsep Matematis (Selalu Tampil) */}
      <ExplanationPanel currentStep={currentStep} />

      {/* Pembatas Visual Halus */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-300/20 to-transparent" />

      {/* 2. Bagian Detail Data Matriks & Analisis Nearest Neighbor */}
      <div>
        <DataPanel currentStep={currentStep} />
      </div>
    </div>
  );
}
