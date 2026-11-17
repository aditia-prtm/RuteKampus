import React, { useRef, useState, useCallback } from 'react';

/**
 * Kanvas Interaktif untuk Mode Bikin Graf Sendiri (Custom Graph Canvas).
 * Mendukung:
 * - Menambah simpul dengan klik kanvas.
 * - Menghubungkan dua simpul dengan sisi (edge) berbobot.
 * - Mode Hapus: langsung klik simpul atau garis sisi untuk menghapusnya.
 * - Menggeser (drag & drop) simpul.
 */
export default function InteractiveGraphCanvas({
  nodes,
  edges,
  currentMode = 'add-node', // 'add-node' | 'add-edge' | 'drag' | 'delete'
  selectedNodeForEdge,
  onSelectNodeForEdge,
  onAddNode,
  onUpdateNodePosition,
  onRemoveNode,
  onAddEdge,
  onRemoveEdge,
  onUpdateEdgeWeight,
  currentStep
}) {
  const svgRef = useRef(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const getSVGCoordinates = useCallback((e) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 600 / rect.width;
    const scaleY = 450 / rect.height;
    return {
      x: Math.round((e.clientX - rect.left) * scaleX),
      y: Math.round((e.clientY - rect.top) * scaleY)
    };
  }, []);

  const handleSvgClick = (e) => {
    if (draggingId || currentMode !== 'add-node') return;
    const { x, y } = getSVGCoordinates(e);
    if (x >= 30 && x <= 570 && y >= 30 && y <= 420) {
      onAddNode(x, y);
    }
  };

  const handleNodeMouseDown = (e, nodeId, nodeX, nodeY) => {
    e.stopPropagation();

    // Jika sedang dalam mode Hapus, langsung hapus simpul tersebut
    if (currentMode === 'delete') {
      onRemoveNode(nodeId);
      return;
    }

    if (currentMode === 'drag') {
      const { x, y } = getSVGCoordinates(e);
      setDraggingId(nodeId);
      setDragOffset({ x: x - nodeX, y: y - nodeY });
    } else if (currentMode === 'add-edge') {
      if (!selectedNodeForEdge) {
        onSelectNodeForEdge(nodeId);
      } else if (selectedNodeForEdge === nodeId) {
        onSelectNodeForEdge(null);
      } else {
        const u = nodeMap.get(selectedNodeForEdge);
        const v = nodeMap.get(nodeId);
        const defaultWeight = u && v ? Math.round(Math.hypot(u.x - v.x, u.y - v.y)) : 10;
        const inputWeight = window.prompt(
          `Masukkan bobot sisi (${selectedNodeForEdge} ↔ ${nodeId}):`,
          String(defaultWeight)
        );
        if (inputWeight !== null) {
          const w = parseFloat(inputWeight) || defaultWeight;
          onAddEdge(selectedNodeForEdge, nodeId, w);
        }
        onSelectNodeForEdge(null);
      }
    }
  };

  const handleEdgeClick = (e, edge) => {
    e.stopPropagation();

    // Jika sedang dalam mode Hapus, langsung hapus sisi tersebut
    if (currentMode === 'delete') {
      onRemoveEdge(edge.id);
      return;
    }

    // Jika diklik pada mode biasa, tampilkan opsi ubah/hapus
    const weight = edge.weight !== undefined ? edge.weight : 10;
    const act = window.prompt(
      `Sisi ${edge.from} ↔ ${edge.to} (Bobot: ${weight})\nKetik angka untuk ganti bobot, atau ketik 'hapus' untuk membuang sisi:`,
      String(weight)
    );
    if (act !== null) {
      if (act.trim().toLowerCase() === 'hapus') {
        onRemoveEdge(edge.id);
      } else {
        const newW = parseFloat(act);
        if (!isNaN(newW)) onUpdateEdgeWeight(edge.id, newW);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!draggingId) return;
    const { x, y } = getSVGCoordinates(e);
    const newX = Math.max(30, Math.min(570, x - dragOffset.x));
    const newY = Math.max(30, Math.min(420, y - dragOffset.y));
    onUpdateNodePosition(draggingId, newX, newY);
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  const nodeMap = new Map();
  for (const n of nodes) {
    nodeMap.set(n.id, n);
  }

  const highlightNodes = new Set(currentStep?.highlight?.nodes || []);
  const fullTour = currentStep?.data?.fullTour || currentStep?.data?.tour || [];
  const isDeleteMode = currentMode === 'delete';

  return (
    <div className="w-full h-full min-h-[420px] bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden flex flex-col shadow-inner">
      {/* Banner Keterangan Mode */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur border border-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg shadow flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isDeleteMode ? 'bg-rose-400' : 'bg-emerald-400'} animate-pulse`} />
          <span>
            {currentMode === 'add-node' && 'Mode Tambah Simpul: Klik bidang kanvas untuk menaruh simpul.'}
            {currentMode === 'add-edge' &&
              (selectedNodeForEdge
                ? `Pilih simpul kedua untuk menyambung dari [${selectedNodeForEdge}].`
                : 'Mode Sambung Sisi: Klik simpul pertama lalu klik simpul kedua.')}
            {currentMode === 'drag' && 'Mode Geser: Drag & drop simpul untuk memindahkan posisinya.'}
            {currentMode === 'delete' && 'Mode Hapus: Klik simpul atau garis sisi apa saja untuk langsung menghapusnya.'}
          </span>
        </div>
        <div className="bg-slate-900/90 backdrop-blur border border-slate-800 text-xs px-2.5 py-1.5 rounded-lg text-slate-400 font-mono">
          {nodes.length} Simpul • {edges.length} Sisi
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 600 450"
        onClick={handleSvgClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`w-full h-full select-none flex-1 ${
          currentMode === 'add-node'
            ? 'cursor-crosshair'
            : currentMode === 'drag'
            ? 'cursor-move'
            : currentMode === 'delete'
            ? 'cursor-not-allowed'
            : 'cursor-pointer'
        }`}
      >
        <defs>
          <pattern id="grid-custom" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.5" />
          </pattern>
          <filter id="glow-custom-graph" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <rect width="600" height="450" fill="url(#grid-custom)" />

        {/* 1. Sisi (Edges) yang Dibuat Pengguna */}
        {edges.map((edge) => {
          const u = nodeMap.get(edge.from);
          const v = nodeMap.get(edge.to);
          if (!u || !v) return null;

          const midX = (u.x + v.x) / 2;
          const midY = (u.y + v.y) / 2;
          const weight = edge.weight !== undefined ? edge.weight : Math.round(Math.hypot(u.x - v.x, u.y - v.y));

          return (
            <g
              key={edge.id || `${edge.from}-${edge.to}`}
              className="cursor-pointer group"
              onClick={(e) => handleEdgeClick(e, edge)}
            >
              {/* Garis invisibel tebal untuk mempermudah klik mouse */}
              <line
                x1={u.x}
                y1={u.y}
                x2={v.x}
                y2={v.y}
                stroke="transparent"
                strokeWidth={14}
              />
              <line
                x1={u.x}
                y1={u.y}
                x2={v.x}
                y2={v.y}
                stroke={isDeleteMode ? '#f43f5e' : '#475569'}
                strokeWidth={isDeleteMode ? 4 : 3}
                strokeLinecap="round"
                className="group-hover:stroke-rose-400 transition-all duration-150"
              />
              {/* Badge Bobot Sisi */}
              <g>
                <rect
                  x={midX - 16}
                  y={midY - 10}
                  width={32}
                  height={18}
                  rx={4}
                  fill={isDeleteMode ? '#881337' : '#0f172a'}
                  stroke={isDeleteMode ? '#f43f5e' : '#334155'}
                  strokeWidth={1}
                  className="group-hover:stroke-rose-400"
                />
                <text
                  x={midX}
                  y={midY + 3}
                  fill={isDeleteMode ? '#fecdd3' : '#94a3b8'}
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="font-mono select-none pointer-events-none"
                >
                  {weight}
                </text>
              </g>
            </g>
          );
        })}

        {/* 2. Rute Siklus Hamilton Bus yang Aktif (Garis Hijau) */}
        {fullTour.length > 1 &&
          fullTour.slice(0, -1).map((uId, idx) => {
            const u = nodeMap.get(uId);
            const v = nodeMap.get(fullTour[idx + 1]);
            if (!u || !v) return null;

            return (
              <line
                key={`tour-active-${uId}-${v.id}-${idx}`}
                x1={u.x}
                y1={u.y}
                x2={v.x}
                y2={v.y}
                stroke="#10b981"
                strokeWidth={5}
                strokeLinecap="round"
                opacity={0.9}
                className="transition-all duration-200 pointer-events-none"
              />
            );
          })}

        {/* 3. Simpul Interaktif */}
        {nodes.map((node) => {
          const isHighlighted = highlightNodes.has(node.id);
          const isSelected = selectedNodeForEdge === node.id;
          const isVisited = fullTour.includes(node.id);
          const isDragging = draggingId === node.id;

          let color = '#3b82f6';
          if (isInTour(node.id, fullTour)) color = '#10b981';
          if (isHighlighted) color = '#f59e0b';
          if (isSelected) color = '#38bdf8';
          if (isDeleteMode) color = '#f43f5e';

          return (
            <g
              key={node.id}
              className={
                currentMode === 'drag'
                  ? 'cursor-grab active:cursor-grabbing'
                  : currentMode === 'delete'
                  ? 'cursor-pointer hover:opacity-80'
                  : 'cursor-pointer'
              }
              onMouseDown={(e) => handleNodeMouseDown(e, node.id, node.x, node.y)}
              onContextMenu={(e) => {
                e.preventDefault();
                onRemoveNode(node.id);
              }}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={isDragging ? 22 : isSelected || isHighlighted ? 20 : 16}
                fill={color}
                stroke={isDeleteMode ? '#ffe4e6' : isSelected ? '#38bdf8' : '#0f172a'}
                strokeWidth={isDeleteMode ? 3 : isSelected ? 3 : 2}
                filter={isHighlighted || isSelected || isDragging ? 'url(#glow-custom-graph)' : undefined}
                className="transition-transform duration-100"
              />

              <text
                x={node.x}
                y={node.y + 4}
                fill="#ffffff"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
                className="font-sans select-none pointer-events-none"
              >
                {node.id}
              </text>

              {/* Tombol Hapus Cepat (Tanda Silang Merah) saat mouse hover */}
              <g
                className="opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveNode(node.id);
                }}
              >
                <circle cx={node.x + 14} cy={node.y - 14} r={8} fill="#f43f5e" />
                <text
                  x={node.x + 14}
                  y={node.y - 11}
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  ×
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function isInTour(nodeId, tour) {
  return tour && tour.includes(nodeId);
}
