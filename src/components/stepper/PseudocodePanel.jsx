import React from 'react';
import { PSEUDOCODE } from '../../data/content.js';
import { Code2 } from 'lucide-react';

export default function PseudocodePanel({ currentStep }) {
  const activeLines = currentStep?.pseudocodeLines || [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg text-white">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800 text-xs font-semibold text-slate-300">
        <Code2 className="w-4 h-4 text-emerald-400" />
        <span>Pseudocode Algoritma CPP</span>
      </div>

      <div data-lenis-prevent className="font-mono text-xs space-y-1 overflow-x-auto">
        {PSEUDOCODE.map((item) => {
          const isActive = activeLines.includes(item.line);
          return (
            <div
              key={item.line}
              className={`flex items-start gap-3 px-2 py-0.5 rounded transition-colors ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border-l-2 border-emerald-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <span className="w-4 text-right text-slate-600 select-none">
                {item.line}
              </span>
              <pre className="font-mono whitespace-pre">{item.text}</pre>
            </div>
          );
        })}
      </div>
    </div>
  );
}
