import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

export default function StepControls({
  currentStepIndex,
  totalSteps,
  isPlaying,
  speed,
  onTogglePlay,
  onPrev,
  onNext,
  onRestart,
  onSpeedChange
}) {
  const progressPercent = totalSteps > 1
    ? ((currentStepIndex) / (totalSteps - 1)) * 100
    : 100;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg text-white">
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5 font-medium">
          <span>Langkah {currentStepIndex + 1} dari {totalSteps}</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-emerald-500 h-2 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onRestart}
            title="Ulangi dari Awal"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onPrev}
            disabled={currentStepIndex === 0}
            title="Langkah Sebelumnya"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 hover:text-white transition cursor-pointer"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={onTogglePlay}
            title={isPlaying ? 'Jeda (Pause)' : 'Putar Otomatis (Play)'}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-semibold text-white flex items-center gap-1.5 transition shadow cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span className="text-sm">Jeda</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span className="text-sm">Putar</span>
              </>
            )}
          </button>
          <button
            onClick={onNext}
            disabled={currentStepIndex >= totalSteps - 1}
            title="Langkah Berikutnya"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 hover:text-white transition cursor-pointer"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-400 mr-1 hidden sm:inline">Kecepatan:</span>
          {[
            { label: '0.5x', value: 2000 },
            { label: '1x', value: 1200 },
            { label: '2x', value: 600 }
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => onSpeedChange(item.value)}
              className={`px-2 py-1 rounded text-xs font-medium cursor-pointer transition ${
                speed === item.value
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
