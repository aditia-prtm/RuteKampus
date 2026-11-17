import React from 'react';
import { STEP_EXPLANATIONS } from '../../data/content.js';
import { Info } from 'lucide-react';

export default function ExplanationPanel({ currentStep }) {
  if (!currentStep) return null;

  const meta = STEP_EXPLANATIONS[currentStep.type] || {
    badge: 'Proses Algoritma',
    concept: currentStep.title,
    detail: currentStep.explanation
  };

  return (
    <div className="bg-gradient-to-b from-[#072449]/85 to-[#03152c]/90 border border-blue-500/20 rounded-2xl p-5 shadow-xl shadow-blue-950/40 text-white backdrop-blur-md">
      {/* Header Badge & Title */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
          {meta.badge}
        </span>
        <span className="text-xs text-blue-300/60 font-mono">
          ID: {currentStep.type}
        </span>
      </div>

      <h3 className="text-lg font-bold text-white mb-2">
        {currentStep.title}
      </h3>

      {/* Main Explanation */}
      <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed mb-4">
        {currentStep.explanation}
      </p>

      {/* Educational Concept Card */}
      <div className="p-3.5 bg-[#031429]/80 border border-blue-400/20 rounded-xl flex items-start gap-2.5 text-xs text-blue-200">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white block mb-0.5">
            Konsep Matematis: {meta.concept}
          </span>
          <span className="text-blue-300/70 leading-normal">
            {meta.detail}
          </span>
        </div>
      </div>
    </div>
  );
}
