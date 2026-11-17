import React, { useMemo } from 'react';

/**
 * Tampilan Graf Abstrak berbasis SVG untuk TSP.
 * Menampilkan simpul halte/fakultas dan lintasan Siklus Hamilton yang terbentuk.
 */
export default function AbstractGraphView({ graph, currentStep }) {
  const { nodes = [] } = graph;

  // Normalisasi koordinat simpul ke viewBox SVG (500x400)
  const nodePositions = useMemo(() => {
    const pos = new Map();
    if (nodes.length === 0) return pos;

    const width = 500;
    const height = 400;
    const padding = 60;

    const hasXY = nodes.some(n => typeof n.x === 'number' && typeof n.y === 'number');

    if (hasXY) {
      for (const node of nodes) {
        pos.set(node.id, {
          x: node.x ?? width / 2,
          y: node.y ?? height / 2
        });
      }
      return pos;
    }

    const hasLatLng = nodes.every(n => typeof n.lat === 'number' && typeof n.lng === 'number');
    if (hasLatLng && nodes.length > 1) {
      let minLat = Infinity, maxLat = -Infinity;
      let minLng = Infinity, maxLng = -Infinity;

      for (const n of nodes) {
        if (n.lat < minLat) minLat = n.lat;
        if (n.lat > maxLat) maxLat = n.lat;
        if (n.lng < minLng) minLng = n.lng;
        if (n.lng > maxLng) maxLng = n.lng;
      }

      const dLat = maxLat - minLat || 0.001;
      const dLng = maxLng - minLng || 0.001;

      for (const node of nodes) {
        const x = padding + ((node.lng - minLng) / dLng) * (width - 2 * padding);
        const y = height - padding - ((node.lat - minLat) / dLat) * (height - 2 * padding);
        pos.set(node.id, { x, y });
      }
      return pos;
    }

    // Circular layout default
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - padding;

    nodes.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
      pos.set(node.id, {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      });
    });

    return pos;
  }, [nodes]);

  const highlightNodes = new Set(currentStep?.highlight?.nodes || []);
  const currentTour = currentStep?.data?.tour || currentStep?.data?.visited || [];

  return (
    <div className="w-full h-full min-h-[380px] flex items-center justify-center bg-slate-950 rounded-xl border border-slate-800 p-4 relative overflow-hidden">
      <svg
        viewBox="0 0 500 400"
        className="w-full h-full max-h-[500px] select-none"
      >
        <defs>
          <filter id="glow-tsp" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Garis Tipis Penghubung Semua Simpul (Graf Lengkap) */}
        {nodes.map((u, i) =>
          nodes.slice(i + 1).map((v) => {
            const p1 = nodePositions.get(u.id);
            const p2 = nodePositions.get(v.id);
            if (!p1 || !p2) return null;
            return (
              <line
                key={`${u.id}-${v.id}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke="#1e293b"
                strokeWidth={1}
                strokeDasharray="3,3"
              />
            );
          })
        )}

        {/* 2. Rute Tur yang Sedang Terbentuk / Aktif */}
        {currentTour.length > 1 &&
          currentTour.slice(0, -1).map((uId, idx) => {
            const vId = currentTour[idx + 1];
            const p1 = nodePositions.get(uId);
            const p2 = nodePositions.get(vId);
            if (!p1 || !p2) return null;

            return (
              <line
                key={`tour-${uId}-${vId}-${idx}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke="#10b981"
                strokeWidth={3.5}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            );
          })}

        {/* 3. Simpul Lokasi (Fakultas / Halte) */}
        {nodes.map((node) => {
          const pos = nodePositions.get(node.id);
          if (!pos) return null;

          const isHighlighted = highlightNodes.has(node.id);
          const isVisited = currentTour.includes(node.id);

          let color = '#3b82f6'; // blue default
          if (isVisited) color = '#10b981'; // emerald if in tour
          if (isHighlighted) color = '#f59e0b'; // amber if currently focused

          return (
            <g key={node.id} className="cursor-pointer">
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isHighlighted ? 18 : 14}
                fill={color}
                stroke="#0f172a"
                strokeWidth={3}
                filter={isHighlighted ? 'url(#glow-tsp)' : undefined}
                className="transition-all duration-300"
              />
              <text
                x={pos.x}
                y={pos.y + 4}
                fill="#ffffff"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                className="font-sans select-none pointer-events-none"
              >
                {node.id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
