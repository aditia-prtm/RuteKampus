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
    <div className="space-y-4">
      {/* Header Badge & Title */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/35">
          {meta.badge}
        </span>
        <span className="text-xs text-blue-200/60 font-mono">
          ID: {currentStep.type}
        </span>
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
          {currentStep.title}
        </h3>
        <p className="text-xs sm:text-sm text-blue-100/85 leading-relaxed mt-2">
          {currentStep.explanation}
        </p>
      </div>

      {/* Educational Concept Card */}
      <div className="p-3.5 bg-[#062648]/85 border border-blue-300/20 rounded-xl flex items-start gap-2.5 text-xs text-blue-100">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white block mb-0.5">
            Konsep Matematis: {meta.concept}
          </span>
          <span className="text-blue-200/75 leading-relaxed">
            {meta.detail}
          </span>
        </div>
      </div>
    </div>
  );
}
