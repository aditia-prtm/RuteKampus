import React, { useRef, useState, useCallback, useMemo } from 'react';

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
    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    return {
      x: Math.round((clientX - rect.left) * scaleX),
      y: Math.round((clientY - rect.top) * scaleY)
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
  const currentTourNodes = useMemo(() => {
    if (!currentStep) return [];
    return (
      currentStep.data?.fullTour ||
      currentStep.data?.tour ||
      currentStep.data?.currentTour ||
      currentStep.data?.visited ||
      []
    );
  }, [currentStep]);

  // Kumpulan edge kunci aktif (highlight saat dieksplorasi/ditukar)
  const highlightEdgeKeys = useMemo(() => {
    const set = new Set();
    const rawEdges = currentStep?.highlight?.edges || [];
    for (const item of rawEdges) {
      if (typeof item === 'string') {
        const parts = item.split('-');
        if (parts.length === 2) {
          const [u, v] = parts;
          set.add(u < v ? `${u}--${v}` : `${v}--${u}`);
        }
      } else if (item && item.from && item.to) {
        const { from, to } = item;
        set.add(from < to ? `${from}--${to}` : `${to}--${from}`);
      }
    }
    if (currentStep?.data?.from && currentStep?.data?.to) {
      const u = currentStep.data.from;
      const v = currentStep.data.to;
      set.add(u < v ? `${u}--${v}` : `${v}--${u}`);
    }
    return set;
  }, [currentStep]);

  // Kumpulan edge tur (yang sudah dilalui/masuk ke dalam siklus)
  const tourEdgeKeys = useMemo(() => {
    const set = new Set();
    const rawEdges = currentStep?.data?.tourEdges || [];
    for (const item of rawEdges) {
      if (typeof item === 'string') {
        const parts = item.split('-');
        if (parts.length === 2) {
          const [u, v] = parts;
          set.add(u < v ? `${u}--${v}` : `${v}--${u}`);
        }
      }
    }
    if (currentTourNodes.length >= 2) {
      for (let i = 0; i < currentTourNodes.length - 1; i++) {
        const u = currentTourNodes[i];
        const v = currentTourNodes[i + 1];
        set.add(u < v ? `${u}--${v}` : `${v}--${u}`);
      }
    }
    return set;
  }, [currentStep, currentTourNodes]);

  const isDeleteMode = currentMode === 'delete';

  return (
    <div
      className="w-full h-full min-h-[420px] bg-[#062648] rounded-2xl border border-blue-300/25 relative overflow-hidden flex flex-col shadow-xl shadow-[#021c38]/40"
    >
      {/* Banner Keterangan Mode */}
      <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 right-2.5 sm:right-3 z-10 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 pointer-events-none">
        <div className="bg-[#0e4984]/95 backdrop-blur border border-blue-300/25 text-blue-100 text-[11px] sm:text-xs px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl shadow-md flex items-center gap-1.5 sm:gap-2 max-w-[calc(100%-6rem)] sm:max-w-none truncate">
          <span className={`w-2 h-2 rounded-full shrink-0 ${isDeleteMode ? 'bg-rose-400' : 'bg-amber-400'} animate-pulse`} />
          <span className="truncate">
            {currentMode === 'add-node' && 'Tambah Simpul: Klik kanvas untuk simpul baru.'}
            {currentMode === 'add-edge' &&
              (selectedNodeForEdge
                ? `Pilih simpul kedua dari [${selectedNodeForEdge}].`
                : 'Sambung Sisi: Klik simpul 1 lalu simpul 2.')}
            {currentMode === 'drag' && 'Mode Geser: Drag simpul untuk pindah posisi.'}
            {currentMode === 'delete' && 'Mode Hapus: Klik simpul/sisi untuk menghapus.'}
          </span>
        </div>
        <div className="bg-[#0e4984]/95 backdrop-blur border border-blue-300/25 text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-amber-300 font-mono font-medium shrink-0">
          {nodes.length} Simpul • {edges.length} Sisi
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 600 450"
        onClick={handleSvgClick}
        onPointerDown={(e) => {
          if (currentMode === 'add-node') handleSvgClick(e);
        }}
        onPointerMove={handleMouseMove}
        onPointerUp={handleMouseUp}
        onPointerCancel={handleMouseUp}
        className={`w-full h-full select-none flex-1 touch-none ${
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
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#0c2b54" strokeWidth="0.5" />
          </pattern>
          <filter id="glow-custom-graph" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <rect width="600" height="450" fill="url(#grid-custom)" />

        {/* 1. Sisi (Edges) yang Dibuat Pengguna dengan Visualisasi Warna Dinamis */}
        {edges.map((edge) => {
          const u = nodeMap.get(edge.from);
          const v = nodeMap.get(edge.to);
          if (!u || !v) return null;

          const midX = (u.x + v.x) / 2;
          const midY = (u.y + v.y) / 2;
          const weight = edge.weight !== undefined ? edge.weight : Math.round(Math.hypot(u.x - v.x, u.y - v.y));

          const edgeKey = edge.from < edge.to ? `${edge.from}--${edge.to}` : `${edge.to}--${edge.from}`;
          const isHighlighted = highlightEdgeKeys.has(edgeKey);
          const isTourEdge = tourEdgeKeys.has(edgeKey);

          let strokeColor = '#475569';
          let strokeWidth = 2.5;
          let strokeOpacity = 0.5;

          let badgeFill = '#051b36';
          let badgeStroke = '#1e4976';
          let badgeTextColor = '#94a3b8';

          if (isDeleteMode) {
            strokeColor = '#f43f5e';
            strokeWidth = 4;
            strokeOpacity = 0.85;
            badgeFill = '#881337';
            badgeStroke = '#f43f5e';
            badgeTextColor = '#fecdd3';
          } else if (isHighlighted) {
            strokeColor = '#f59e0b';
            strokeWidth = 5;
            strokeOpacity = 1;
            badgeFill = '#78350f';
            badgeStroke = '#f59e0b';
            badgeTextColor = '#fef08a';
          } else if (isTourEdge) {
            strokeColor = '#10b981';
            strokeWidth = 4;
            strokeOpacity = 0.95;
            badgeFill = '#064e3b';
            badgeStroke = '#10b981';
            badgeTextColor = '#a7f3d0';
          }

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
                strokeWidth={16}
              />
              <line
                x1={u.x}
                y1={u.y}
                x2={v.x}
                y2={v.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeOpacity={strokeOpacity}
                strokeLinecap="round"
                filter={isHighlighted ? 'url(#glow-custom-graph)' : undefined}
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
                  fill={badgeFill}
                  stroke={badgeStroke}
                  strokeWidth={isHighlighted || isTourEdge ? 1.5 : 1}
                  className="group-hover:stroke-rose-400 transition-colors"
                />
                <text
                  x={midX}
                  y={midY + 3}
                  fill={badgeTextColor}
                  fontSize="10"
                  fontWeight={isHighlighted ? '900' : 'bold'}
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
        {currentTourNodes.length > 1 &&
          currentTourNodes.slice(0, -1).map((uId, idx) => {
            const u = nodeMap.get(uId);
            const v = nodeMap.get(currentTourNodes[idx + 1]);
            if (!u || !v) return null;

            return (
              <line
                key={`tour-active-${uId}-${v.id}-${idx}`}
                x1={u.x}
                y1={u.y}
                x2={v.x}
                y2={v.y}
                stroke="#10b981"
                strokeWidth={4.5}
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
          const isVisited = currentTourNodes.includes(node.id);
          const isDragging = draggingId === node.id;

          let color = '#3b82f6';
          if (isVisited) color = '#10b981';
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
              onPointerDown={(e) => handleNodeMouseDown(e, node.id, node.x, node.y)}
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
