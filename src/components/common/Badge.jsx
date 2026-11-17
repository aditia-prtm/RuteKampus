import React from 'react';

/**
 * Reusable Badge Component
 * Mengikuti palet Hero RuteKampus UNSRI (Royal Navy + Amber/Gold).
 */
export default function Badge({
  children,
  variant = 'blue', // 'blue' | 'amber' | 'teal' | 'glass' | 'rose'
  className = '',
  dot = false,
  dotColor = ''
}) {
  const variantStyles = {
    blue: 'bg-blue-950/70 border-blue-400/30 text-blue-200',
    amber: 'bg-amber-500/10 border-amber-400/30 text-amber-300',
    teal: 'bg-teal-500/10 border-teal-400/30 text-teal-300',
    glass: 'bg-white/10 backdrop-blur-md border-white/20 text-white',
    rose: 'bg-rose-500/10 border-rose-400/30 text-rose-300'
  };

  const defaultDotColors = {
    blue: 'bg-blue-400',
    amber: 'bg-amber-400',
    teal: 'bg-teal-400',
    glass: 'bg-amber-400',
    rose: 'bg-rose-400'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border shadow-sm transition-colors ${
        variantStyles[variant] || variantStyles.blue
      } ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColor || defaultDotColors[variant] || 'bg-amber-400'}`}
        />
      )}
      {children}
    </span>
  );
}
