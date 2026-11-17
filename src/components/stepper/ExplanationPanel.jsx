import React from 'react';
import { STEP_EXPLANATIONS } from '../../data/content.js';
import { Info, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ExplanationPanel({ currentStep }) {
  if (!currentStep) return null;

  const meta = STEP_EXPLANATIONS[currentStep.type] || {
    badge: 'Proses Algoritma',
    concept: currentStep.title,
    detail: currentStep.explanation
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg text-white">
      {/* Header Badge & Title */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          {meta.badge}
        </span>
        <span className="text-xs text-slate-400 font-mono">
          ID: {currentStep.type}
        </span>
      </div>

      <h3 className="text-lg font-bold text-slate-100 mb-2">
        {currentStep.title}
      </h3>

      {/* Main Explanation */}
      <p className="text-sm text-slate-300 leading-relaxed mb-4">
        {currentStep.explanation}
      </p>

      {/* Educational Concept Card */}
      <div className="p-3 bg-slate-800/70 border border-slate-700/60 rounded-lg flex items-start gap-2.5 text-xs text-slate-300">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200 block mb-0.5">
            Konsep Matematis: {meta.concept}
          </span>
          <span className="text-slate-400 leading-normal">
            {meta.detail}
          </span>
        </div>
      </div>
    </div>
  );
}
