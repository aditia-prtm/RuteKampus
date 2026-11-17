import React from 'react';
import { PSEUDOCODE } from '../../data/content.js';
import { Code2 } from 'lucide-react';

export default function PseudocodePanel({ currentStep }) {
  const activeLines = currentStep?.pseudocodeLines || [];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b border-blue-300/20 text-xs font-semibold text-blue-100">
        <Code2 className="w-4 h-4 text-amber-400" />
        <span>Pseudocode Logika TSP</span>
      </div>

      <div className="font-mono text-xs space-y-1 overflow-x-auto bg-[#062648]/85 p-3 rounded-xl border border-blue-300/20 max-h-80">
        {PSEUDOCODE.map((item) => {
          const isActive = activeLines.includes(item.line);
          return (
            <div
              key={item.line}
              className={`flex items-start gap-3 px-2 py-1 rounded-md transition-colors ${
                isActive
                  ? 'bg-amber-400/25 text-amber-300 font-semibold border-l-2 border-amber-400'
                  : 'text-blue-200/70 hover:text-white'
              }`}
            >
              <span className="w-4 text-right text-blue-300/40 select-none text-[11px]">
                {item.line}
              </span>
              <pre className="font-mono whitespace-pre text-[11px] leading-relaxed">{item.text}</pre>
            </div>
          );
        })}
      </div>
    </div>
  );
}
