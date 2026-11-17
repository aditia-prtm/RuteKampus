import React from 'react';

/**
 * Reusable Card Container
 * Mengadopsi visual frosted University Blue Unsri (#0a3a6b) dan border biru safir.
 */
export default function Card({
  children,
  className = '',
  hoverEffect = false,
  variant = 'navy' // 'navy' | 'glass' | 'solid'
}) {
  const variantStyles = {
    navy: 'bg-gradient-to-b from-[#0e4984]/65 to-[#072f59]/85 border-blue-300/25 shadow-xl shadow-[#031c38]/40',
    glass: 'bg-white/[0.08] backdrop-blur-md border-white/20 shadow-lg shadow-black/20',
    solid: 'bg-[#093563] border-blue-400/25 shadow-md'
  };

  const hoverStyle = hoverEffect
    ? 'hover:border-amber-400/50 hover:shadow-2xl hover:shadow-[#031c38]/50 hover:-translate-y-0.5 transition-all duration-300'
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
