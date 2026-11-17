import React from 'react';
import { PSEUDOCODE } from '../../data/content.js';
import { Code2 } from 'lucide-react';

export default function PseudocodePanel({ currentStep }) {
  const activeLines = currentStep?.pseudocodeLines || [];

  return (
    <div className="bg-gradient-to-b from-[#072449]/85 to-[#03152c]/90 border border-blue-500/20 rounded-2xl p-4 shadow-xl shadow-blue-950/40 text-white backdrop-blur-md">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-blue-900/50 text-xs font-semibold text-blue-200">
        <Code2 className="w-4 h-4 text-amber-400" />
        <span>Pseudocode Algoritma TSP</span>
      </div>

      <div data-lenis-prevent className="font-mono text-xs space-y-1 overflow-x-auto">
        {PSEUDOCODE.map((item) => {
          const isActive = activeLines.includes(item.line);
          return (
            <div
              key={item.line}
              className={`flex items-start gap-3 px-2.5 py-1 rounded-lg transition-colors ${
                isActive
                  ? 'bg-amber-400/20 text-amber-300 font-semibold border-l-2 border-amber-400'
                  : 'text-blue-300/60 hover:text-blue-200'
              }`}
            >
              <span className="w-4 text-right text-blue-400/40 select-none">
                {item.line}
              </span>
              <pre className="font-mono whitespace-pre text-[11px]">{item.text}</pre>
            </div>
          );
        })}
      </div>
    </div>
  );
}
