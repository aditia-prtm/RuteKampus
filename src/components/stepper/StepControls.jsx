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
    <div className="bg-gradient-to-b from-[#0e4984]/75 to-[#072f59]/90 border border-blue-300/25 rounded-2xl p-4 sm:p-5 shadow-xl shadow-[#021c38]/40 text-white backdrop-blur-md">
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center text-xs text-blue-200/80 mb-1.5 font-medium">
          <span>Langkah {currentStepIndex + 1} dari {totalSteps}</span>
          <span className="text-amber-300 font-bold font-mono">{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full bg-[#062648] rounded-full h-2 overflow-hidden border border-blue-300/20">
          <div
            className="bg-gradient-to-r from-blue-400 via-sky-300 to-amber-400 h-2 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onRestart}
            title="Ulangi dari Awal"
            className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-blue-100 hover:text-white border border-white/15 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onPrev}
            disabled={currentStepIndex === 0}
            title="Langkah Sebelumnya"
            className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed text-blue-100 hover:text-white border border-white/15 transition cursor-pointer"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={onTogglePlay}
            title={isPlaying ? 'Jeda (Pause)' : 'Putar Otomatis (Play)'}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold flex items-center gap-2 transition shadow-md shadow-black/25 cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-slate-950" />
                <span className="text-xs sm:text-sm">Jeda</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span className="text-xs sm:text-sm">Putar</span>
              </>
            )}
          </button>
          <button
            onClick={onNext}
            disabled={currentStepIndex >= totalSteps - 1}
            title="Langkah Berikutnya"
            className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed text-blue-100 hover:text-white border border-white/15 transition cursor-pointer"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1 bg-[#062648] p-1 rounded-xl border border-blue-300/20 text-xs">
          {[
            { label: '0.5x', val: 2000 },
            { label: '1x', val: 1200 },
            { label: '2x', val: 600 }
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => onSpeedChange(item.val)}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                speed === item.val
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-blue-200/80 hover:text-white hover:bg-white/10'
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
