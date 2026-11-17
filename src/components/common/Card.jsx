import React from 'react';

/**
 * Reusable Card Container
 * Mengadopsi visual frosted navy dan border biru safir khas Hero RuteKampus.
 */
export default function Card({
  children,
  className = '',
  hoverEffect = false,
  variant = 'navy' // 'navy' | 'glass' | 'solid'
}) {
  const variantStyles = {
    navy: 'bg-gradient-to-b from-[#072449]/75 to-[#03152c]/85 border-blue-500/20 shadow-xl shadow-blue-950/50',
    glass: 'bg-white/[0.06] backdrop-blur-md border-white/15 shadow-lg shadow-black/20',
    solid: 'bg-[#061e3d] border-blue-900/40 shadow-md'
  };

  const hoverStyle = hoverEffect
    ? 'hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-900/30 hover:-translate-y-0.5 transition-all duration-300'
    : '';

  return (
    <div
      className={`rounded-2xl border backdrop-blur-sm p-6 sm:p-8 text-white ${
        variantStyles[variant] || variantStyles.navy
      } ${hoverStyle} ${className}`}
    >
      {children}
    </div>
  );
}
