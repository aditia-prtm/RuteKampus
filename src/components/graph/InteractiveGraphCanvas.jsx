import React, { useRef, useState, useCallback, useMemo } from 'react';

/**
 * Kanvas Interaktif untuk Mode Bikin Graf Sendiri (Custom Graph Canvas).
 * Sistem Interaksi Intuitif Langsung:
 * 1. Klik area kosong kanvas = Menambah simpul baru.
 * 2. Klik simpul = Muncul menu tepat di dekat simpul dengan 2 pilihan: [🔗 Sambung] dan [🗑 Hapus].
 * 3. Drag simpul kapanpun untuk memindahkan posisi.
 * 4. Klik sisi / bobot = Mengedit bobot sisi (atau ketik 'hapus' untuk membuang sisi).
 */
export default function InteractiveGraphCanvas({
  nodes,
  edges,
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

  // State untuk drag node kapanpun
  const [draggingId, setDraggingId] = useState(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);

  // State untuk menu aksi simpul aktif (nodeId | null)
  const [activeNodeMenu, setActiveNodeMenu] = useState(null);

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

  const nodeMap = useMemo(() => {
    const map = new Map();
    for (const n of nodes) {
      map.set(n.id, n);
    }
    return map;
  }, [nodes]);

  // Klik kanvas kosong -> Tambah Simpul baru atau tutup menu aktif
  const handleSvgClick = (e) => {
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }

    // Jika menu sedang terbuka, klik kanvas kosong cukup menutup menu
    if (activeNodeMenu) {
      setActiveNodeMenu(null);
      return;
    }

    const { x, y } = getSVGCoordinates(e);
    if (x >= 35 && x <= 565 && y >= 35 && y <= 415) {
      onAddNode(x, y);
    }
  };

  // Pointer Down pada simpul -> Persiapan Drag
  const handleNodePointerDown = (e, nodeId, nodeX, nodeY) => {
    e.stopPropagation();
    const { x, y } = getSVGCoordinates(e);

    setDraggingId(nodeId);
    dragOffsetRef.current = { x: x - nodeX, y: y - nodeY };
    pointerStartRef.current = { x, y };
    hasDraggedRef.current = false;
  };

  // Pointer Move pada kanvas -> Menggeser node jika sedang drag
  const handlePointerMove = (e) => {
    if (!draggingId) return;

    const { x, y } = getSVGCoordinates(e);
    const dist = Math.hypot(x - pointerStartRef.current.x, y - pointerStartRef.current.y);

    if (dist > 4) {
      hasDraggedRef.current = true;
      if (activeNodeMenu) setActiveNodeMenu(null);
    }

    if (hasDraggedRef.current) {
      const newX = Math.max(30, Math.min(570, x - dragOffsetRef.current.x));
      const newY = Math.max(30, Math.min(420, y - dragOffsetRef.current.y));
      onUpdateNodePosition(draggingId, newX, newY);
    }
  };

  // Pointer Up -> Selesaikan drag
  const handlePointerUp = () => {
    setDraggingId(null);
  };

  // Klik pada simpul (dipanggil dari onClick elemen simpul dengan stopPropagation)
  const handleNodeClick = (e, nodeId) => {
    e.stopPropagation();

    // Jika user baru saja menggeser/drag simpul, jangan buka menu
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }

    // 1. Jika sedang dalam proses menyambungkan sisi
    if (selectedNodeForEdge) {
      if (selectedNodeForEdge === nodeId) {
        onSelectNodeForEdge(null);
      } else {
        const u = nodeMap.get(selectedNodeForEdge);
        const v = nodeMap.get(nodeId);
        const defaultWeight = u && v ? Math.round(Math.hypot(u.x - v.x, u.y - v.y)) : 10;
        const inputWeight = window.prompt(
          `Sambungkan Sisi: (${selectedNodeForEdge} ↔ ${nodeId})\nMasukkan bobot sisi (jarak):`,
          String(defaultWeight)
        );
        if (inputWeight !== null) {
          const w = parseFloat(inputWeight) || defaultWeight;
          onAddEdge(selectedNodeForEdge, nodeId, w);
        }
        onSelectNodeForEdge(null);
      }
      setActiveNodeMenu(null);
      return;
    }

    // 2. Tampilkan menu aksi tepat di dekat simpul: Sambung Sisi & Hapus Node
    setActiveNodeMenu((prev) => (prev === nodeId ? null : nodeId));
  };

  // Klik pada sisi atau badge bobot -> Mengedit bobot sisi atau menghapus
  const handleEdgeClick = (e, edge) => {
    e.stopPropagation();
    setActiveNodeMenu(null);

    const weight = edge.weight !== undefined ? edge.weight : 10;
    const act = window.prompt(
      `Edit Sisi (${edge.from} ↔ ${edge.to}) — Bobot saat ini: ${weight}\nMasukkan angka baru untuk ganti bobot, atau ketik 'hapus' untuk membuang sisi:`,
      String(weight)
    );
    if (act !== null) {
      if (act.trim().toLowerCase() === 'hapus') {
        onRemoveEdge(edge.id);
      } else {
        const newW = parseFloat(act);
        if (!isNaN(newW) && newW > 0) {
          onUpdateEdgeWeight(edge.id, Math.round(newW * 10) / 10);
        }
      }
    }
  };

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

  // Kumpulan edge kunci aktif (highlight saat dieksplorasi)
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

  return (
    <div className="w-full h-full min-h-[350px] bg-[#062648] rounded-2xl border border-blue-300/25 relative overflow-hidden flex flex-col shadow-xl shadow-[#021c38]/40 select-none">
      {/* Header Info Status Graf */}
      <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 right-2.5 sm:right-3 z-10 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 pointer-events-none">
        <div className="bg-[#0e4984]/95 backdrop-blur border border-blue-300/25 text-blue-100 text-[11px] sm:text-xs px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl shadow-md flex items-center gap-1.5 sm:gap-2">
          <span className="w-2 h-2 rounded-full shrink-0 bg-amber-400 animate-pulse" />
          <span className="truncate">
            {selectedNodeForEdge
              ? `Pilih simpul kedua untuk sisi dari [${selectedNodeForEdge}]`
              : 'Klik kanvas untuk tambah simpul • Klik simpul untuk opsi sambung/hapus'}
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
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-full flex-1 touch-none cursor-crosshair"
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

        {/* 1. Garis Sisi (Edges) Dasar */}
        {edges.map((edge) => {
          const u = nodeMap.get(edge.from);
          const v = nodeMap.get(edge.to);
          if (!u || !v) return null;

          const edgeKey = edge.from < edge.to ? `${edge.from}--${edge.to}` : `${edge.to}--${edge.from}`;
          const isHighlighted = highlightEdgeKeys.has(edgeKey);
          const isTourEdge = tourEdgeKeys.has(edgeKey);

          let strokeColor = '#475569';
          let strokeWidth = 2.5;
          let strokeOpacity = 0.55;

          const stepColor = currentStep?.data?.color || '#10b981';

          if (isHighlighted && !isTourEdge) {
            strokeColor = '#f59e0b';
            strokeWidth = 5;
            strokeOpacity = 1;
          } else if (isTourEdge) {
            strokeColor = stepColor;
            strokeWidth = 4.5;
            strokeOpacity = 0.95;
          }

          return (
            <g
              key={`edge-line-${edge.id || `${edge.from}-${edge.to}`}`}
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
                strokeWidth={18}
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
                className="group-hover:stroke-amber-400 group-hover:stroke-[4px] transition-all duration-150"
              />
            </g>
          );
        })}

        {/* 2. Rute Siklus Hamilton yang Aktif (Garis Hijau) */}
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
                stroke={currentStep?.data?.color || '#10b981'}
                strokeWidth={4.5}
                strokeLinecap="round"
                opacity={0.9}
                className="transition-all duration-200 pointer-events-none"
              />
            );
          })}

        {/* 3. Badge Bobot Sisi (Dirender SETELAH garis agar selalu di atas garis dan tidak pernah tertimpa) */}
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

          let badgeFill = '#051b36';
          let badgeStroke = '#1e4976';
          let badgeTextColor = '#94a3b8';

          const stepColor = currentStep?.data?.color || '#10b981';

          if (isHighlighted && !isTourEdge) {
            badgeFill = '#78350f';
            badgeStroke = '#f59e0b';
            badgeTextColor = '#fef08a';
          } else if (isTourEdge) {
            badgeFill = '#062648';
            badgeStroke = stepColor;
            badgeTextColor = '#ffffff';
          }

          return (
            <g
              key={`edge-badge-${edge.id || `${edge.from}-${edge.to}`}`}
              className="cursor-pointer group"
              onClick={(e) => handleEdgeClick(e, edge)}
            >
              <rect
                x={midX - 16}
                y={midY - 10}
                width={32}
                height={18}
                rx={5}
                fill={badgeFill}
                stroke={badgeStroke}
                strokeWidth={isHighlighted || isTourEdge ? 1.5 : 1}
                className="group-hover:stroke-amber-400 group-hover:scale-110 transition-transform origin-center"
              />
              <text
                x={midX}
                y={midY + 3.5}
                fill={badgeTextColor}
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                className="font-mono select-none pointer-events-none"
              >
                {weight}
              </text>
            </g>
          );
        })}

        {/* 4. Simpul Interaktif (Bisa di-drag kapanpun atau diklik untuk buka menu) */}
        {nodes.map((node) => {
          const isCurrentNode = (currentStep?.data?.from === node.id) || (currentStep?.data?.current === node.id);
          const isTargetNode = currentStep?.data?.to === node.id;
          const isHighlighted = highlightNodes.has(node.id);
          const isSelected = selectedNodeForEdge === node.id;
          const isVisited = currentTourNodes.includes(node.id);
          const isDragging = draggingId === node.id;
          const isMenuOpen = activeNodeMenu === node.id;

          let color = '#3b82f6';
          if (isVisited) color = currentStep?.data?.color || '#10b981';
          if (isHighlighted || isTargetNode) color = '#f59e0b';
          if (isCurrentNode) color = '#9333ea'; // Posisi node saat ini: Ungu Padat
          if (isSelected) color = '#0284c7';

          return (
            <g
              key={node.id}
              className="cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => handleNodePointerDown(e, node.id, node.x, node.y)}
              onClick={(e) => handleNodeClick(e, node.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                onRemoveNode(node.id);
              }}
            >
              {/* Lingkaran penanda seleksi saat menyambungkan edge (statis dan bersih) */}
              {isSelected && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={24}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                />
              )}

              {/* Lingkaran penanda saat menu aktif terbuka */}
              {isMenuOpen && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={25}
                  fill="none"
                  stroke="#facc15"
                  strokeWidth={2}
                />
              )}

              <circle
                cx={node.x}
                cy={node.y}
                r={isDragging ? 22 : isCurrentNode ? 22 : isSelected || isHighlighted ? 20 : isMenuOpen ? 20 : 16}
                fill={color}
                stroke={isCurrentNode ? '#f3e8ff' : isSelected ? '#38bdf8' : isMenuOpen ? '#facc15' : '#ffffff'}
                strokeWidth={isCurrentNode ? 3.5 : isSelected ? 3 : isMenuOpen ? 3 : 2}
                filter={isCurrentNode || isHighlighted || isSelected || isDragging ? 'url(#glow-custom-graph)' : undefined}
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
            </g>
          );
        })}

        {/* 4. Menu Aksi Simpul Tepat di Dekat Simpul: [🔗 Sambung] dan [🗑 Hapus] */}
        {activeNodeMenu && (() => {
          const targetNode = nodeMap.get(activeNodeMenu);
          if (!targetNode) return null;

          const isNearTop = targetNode.y < 85;
          const menuY = isNearTop ? targetNode.y + 26 : targetNode.y - 48;
          const menuX = Math.max(95, Math.min(505, targetNode.x));

          return (
            <g
              className="select-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drop shadow / glow box */}
              <rect
                x={menuX - 96}
                y={menuY - 4}
                width={192}
                height={40}
                rx={10}
                fill="#031528"
                stroke="#38bdf8"
                strokeWidth={1.5}
                filter="url(#glow-custom-graph)"
              />
              <rect
                x={menuX - 96}
                y={menuY - 4}
                width={192}
                height={40}
                rx={10}
                fill="#072343"
                stroke="#38bdf8"
                strokeWidth={1.5}
              />

              {/* Tombol 1: Sambung Sisi */}
              <g
                className="cursor-pointer group/btn1"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNodeForEdge(targetNode.id);
                  setActiveNodeMenu(null);
                }}
              >
                <rect
                  x={menuX - 90}
                  y={menuY + 2}
                  width={86}
                  height={28}
                  rx={7}
                  fill="#0284c7"
                  className="hover:fill-sky-400 transition-colors"
                />
                <text
                  x={menuX - 47}
                  y={menuY + 20}
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="pointer-events-none font-sans"
                >
                  🔗 Sambung
                </text>
              </g>

              {/* Tombol 2: Hapus Node */}
              <g
                className="cursor-pointer group/btn2"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveNode(targetNode.id);
                  setActiveNodeMenu(null);
                }}
              >
                <rect
                  x={menuX + 4}
                  y={menuY + 2}
                  width={86}
                  height={28}
                  rx={7}
                  fill="#e11d48"
                  className="hover:fill-rose-500 transition-colors"
                />
                <text
                  x={menuX + 47}
                  y={menuY + 20}
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="pointer-events-none font-sans"
                >
                  🗑 Hapus
                </text>
              </g>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
