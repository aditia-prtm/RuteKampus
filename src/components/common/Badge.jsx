import React from 'react';

/**
 * Reusable Badge Component
 * Mengikuti palet University Blue UNSRI (#0a3a6b) + Amber/Gold.
 */
export default function Badge({
  children,
  variant = 'blue', // 'blue' | 'amber' | 'teal' | 'glass' | 'rose'
  className = '',
  dot = false,
  dotColor = ''
}) {
  const variantStyles = {
    blue: 'bg-[#083561]/90 border-blue-300/35 text-blue-100 shadow-sm',
    amber: 'bg-amber-400/15 border-amber-400/40 text-amber-300 shadow-sm',
    teal: 'bg-teal-500/15 border-teal-300/35 text-teal-200 shadow-sm',
    glass: 'bg-white/15 backdrop-blur-md border-white/25 text-white shadow-sm',
    rose: 'bg-rose-500/15 border-rose-400/35 text-rose-200 shadow-sm'
  };

  const defaultDotColors = {
    blue: 'bg-sky-400',
    amber: 'bg-amber-400',
    teal: 'bg-teal-400',
    glass: 'bg-amber-400',
    rose: 'bg-rose-400'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
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
