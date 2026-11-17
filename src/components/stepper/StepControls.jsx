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
    <div className="bg-gradient-to-b from-[#072449]/85 to-[#03152c]/90 border border-blue-500/20 rounded-2xl p-4 shadow-xl shadow-blue-950/40 text-white backdrop-blur-md">
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center text-xs text-blue-200/70 mb-1.5 font-medium">
          <span>Langkah {currentStepIndex + 1} dari {totalSteps}</span>
          <span className="text-amber-300 font-bold font-mono">{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full bg-[#020e1d] rounded-full h-2 overflow-hidden border border-blue-900/50">
          <div
            className="bg-gradient-to-r from-blue-500 via-sky-400 to-amber-400 h-2 transition-all duration-300 rounded-full"
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
            className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-blue-100 hover:text-white border border-white/10 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onPrev}
            disabled={currentStepIndex === 0}
            title="Langkah Sebelumnya"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed text-blue-100 hover:text-white border border-white/10 transition cursor-pointer"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={onTogglePlay}
            title={isPlaying ? 'Jeda (Pause)' : 'Putar Otomatis (Play)'}
            className="px-4 py-2 rounded-xl bg-[#133e75] hover:bg-[#0f325e] font-semibold text-white flex items-center gap-1.5 transition shadow-lg shadow-blue-950/60 border border-blue-400/40 cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 text-amber-300" />
                <span className="text-sm font-semibold">Jeda</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span className="text-sm font-semibold">Putar</span>
              </>
            )}
          </button>
          <button
            onClick={onNext}
            disabled={currentStepIndex >= totalSteps - 1}
            title="Langkah Berikutnya"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed text-blue-100 hover:text-white border border-white/10 transition cursor-pointer"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1 bg-[#020e1d] p-1 rounded-xl border border-blue-900/50 text-xs">
          {[
            { label: '0.5x', val: 2000 },
            { label: '1x', val: 1200 },
            { label: '2x', val: 600 }
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => onSpeedChange(item.val)}
              className={`px-2 py-1 rounded-lg font-medium transition cursor-pointer ${
                speed === item.val
                  ? 'bg-[#133e75] text-amber-300 font-bold border border-blue-400/40'
                  : 'text-blue-300/70 hover:text-white hover:bg-white/5'
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
