import React, { useMemo, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Trash2, Flag, Lock, Unlock, Link2 } from 'lucide-react';
import { haversine } from '../../algorithms/geo.js';

// Format jarak selalu dalam kilometer (km) untuk mode kampus
function formatDist(meters) {
  if (!meters) return '0.00 km';
  const km = meters / 1000;
  return `${km.toFixed(2)} km`;
}

// Controller untuk mengunci / membuka pergerakan dan zoom peta
function MapLockController({ isLocked }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const container = map.getContainer();
    if (isLocked) {
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      if (container) {
        container.style.touchAction = 'pan-y';
      }
    } else {
      map.dragging.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
      if (container) {
        container.style.touchAction = 'none';
      }
    }
  }, [map, isLocked]);
  return null;
}

// Buat custom circular pin icon untuk Leaflet Marker agar mendukung draggable & klik yang mudah
function createNodeIcon(
  isWaypoint,
  isStartNode,
  isCurrentNode,
  isTargetNode,
  isHighlighted,
  isSelectedForEdge,
  isDeleteMode,
  isInTour,
  tourColor = '#10b981'
) {
  let bg = isWaypoint ? '#64748b' : '#2563eb';
  let size = isWaypoint ? 14 : 18;
  let border = '2px solid #ffffff';
  let shadow = '0 2px 6px rgba(0,0,0,0.45)';
  let isPulsing = false;

  if (isDeleteMode) {
    bg = '#f43f5e';
    border = '2px solid #ffe4e6';
  } else if (isSelectedForEdge) {
    bg = '#0284c7';
    size = 24;
    border = '3px solid #38bdf8';
    shadow = '0 0 14px #38bdf8, 0 2px 8px rgba(0,0,0,0.6)';
  } else if (isCurrentNode) {
    // Posisi Node Saat Ini Ditandai Warna Ungu
    bg = '#9333ea'; // Purple-600
    size = isWaypoint ? 20 : 24;
    border = '3px solid #f3e8ff';
    shadow = '0 0 16px #a855f7, 0 2px 8px rgba(0,0,0,0.6)';
    isPulsing = true;
  } else if (isTargetNode) {
    // Target pilihan berikutnya
    bg = '#f59e0b'; // Amber-500
    size = isWaypoint ? 18 : 22;
    border = '3px solid #fef3c7';
    shadow = '0 0 14px #f59e0b, 0 2px 8px rgba(0,0,0,0.6)';
  } else if (isHighlighted) {
    bg = '#f59e0b';
    size = isWaypoint ? 16 : 20;
    border = '2px solid #ffffff';
    shadow = '0 0 10px #f59e0b, 0 2px 6px rgba(0,0,0,0.5)';
  } else if (isInTour && !isWaypoint) {
    bg = tourColor;
    size = 18;
  } else if (isStartNode) {
    bg = '#8b5cf6';
    size = 20;
    border = '3px solid #e9d5ff';
  }

  // Outer container dengan hit area 36px
  return L.divIcon({
    className: 'custom-node-pin',
    html: `<div style="
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      cursor: pointer;
    ">
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${bg};
        border: ${border};
        border-radius: 50%;
        box-shadow: ${shadow};
        box-sizing: border-box;
        transition: all 0.15s ease;
        position: relative;
        z-index: 10;
      "></div>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
}

// Subkomponen penangkap event klik pada kanvas peta
function MapClickHandler({ isEditing, onAddNode }) {
  useMapEvents({
    click(e) {
      if (!isEditing || !onAddNode) return;
      const { lat, lng } = e.latlng;
      const label = window.prompt(
        'Tambah Simpul Baru di Peta:\nKetik nama gedung/tempat tujuan, atau ketik "tikungan" untuk persimpangan jalan:',
        'Gedung Baru'
      );
      if (label !== null && label.trim()) {
        const isWp = label.toLowerCase().includes('tikungan') || label.toLowerCase().includes('simpang');
        onAddNode({ lat, lng }, label.trim(), isWp ? 'waypoint' : 'place');
      }
    }
  });
  return null;
}

export default function LeafletMapView({
  graph,
  currentStep,
  isEditing = false,
  selectedNodeForEdge,
  startNodeId,
  onSetStartNode,
  onSelectNodeForEdge,
  onAddNode,
  onUpdateNodePosition,
  onRemoveNode,
  onAddEdge,
  onRemoveEdge,
  onUpdateEdgeWeight
}) {
  const { nodes = [], edges = [] } = graph;
  const [isLocked, setIsLocked] = useState(false);

  const nodeMap = useMemo(() => {
    const map = new Map();
    for (const node of nodes) {
      map.set(node.id, node);
    }
    return map;
  }, [nodes]);

  // Titik tengah default: Kampus Unsri Bukit Besar Palembang
  const center = useMemo(() => {
    if (nodes.length === 0) return [-2.9855, 104.7328];
    const avgLat = nodes.reduce((sum, n) => sum + (n.lat || 0), 0) / nodes.length;
    const avgLng = nodes.reduce((sum, n) => sum + (n.lng || 0), 0) / nodes.length;
    return [avgLat, avgLng];
  }, [nodes]);

  const highlightNodes = new Set(currentStep?.highlight?.nodes || []);
  const currentNodeId = currentStep?.data?.from || currentStep?.data?.current || null;
  const targetNodeId = currentStep?.data?.to || null;

  // Simpul-simpul tur yang telah dikunjungi atau terbentuk pada langkah ini
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

  // Rute garis Siklus Hamilton yang mengikuti jalan & waypoint
  const tourPolylinePositions = useMemo(() => {
    if (currentTourNodes.length < 2) return [];
    const positions = [];
    for (const nodeId of currentTourNodes) {
      const node = nodeMap.get(nodeId);
      if (node && typeof node.lat === 'number' && typeof node.lng === 'number') {
        positions.push([node.lat, node.lng]);
      }
    }
    return positions;
  }, [currentTourNodes, nodeMap]);

  const handleNodeClick = (e, nodeId) => {
    if (!isEditing) return;

    // Jika sedang dalam mode menyambung jalan
    if (selectedNodeForEdge) {
      L.DomEvent.stopPropagation(e);
      if (selectedNodeForEdge === nodeId) {
        onSelectNodeForEdge(null);
      } else {
        onAddEdge(selectedNodeForEdge, nodeId);
        onSelectNodeForEdge(null);
      }
    }
  };

  const handleEdgeClick = (e, edge) => {
    L.DomEvent.stopPropagation(e);
    if (!isEditing) return;

    const u = nodeMap.get(edge.from);
    const v = nodeMap.get(edge.to);
    const currentWeight = edge.weight !== undefined ? edge.weight : Math.round(haversine(u, v));

    const act = window.prompt(
      `Ubah Bobot/Jarak Jalan ${u?.label || edge.from} ↔ ${v?.label || edge.to} (meter):\nKetik angka baru, atau ketik 'hapus' untuk membuang jalan:`,
      String(currentWeight)
    );
    if (act !== null) {
      if (act.trim().toLowerCase() === 'hapus') {
        onRemoveEdge(edge.id);
      } else {
        const newW = parseFloat(act);
        if (!isNaN(newW) && newW > 0 && onUpdateEdgeWeight) {
          onUpdateEdgeWeight(edge.id, newW);
        }
      }
    }
  };

  return (
    <div
      {...(!isLocked ? { 'data-lenis-prevent': '' } : {})}
      className={`w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-blue-300/25 shadow-xl shadow-[#021c38]/40 relative ${
        isLocked ? 'touch-pan-y' : ''
      }`}
    >
      {/* Tombol Kunci / Buka Peta */}
      <button
        type="button"
        onClick={() => setIsLocked((prev) => !prev)}
        title={isLocked ? 'Buka Kunci Peta (Izinkan Geser & Zoom)' : 'Kunci Peta (Bekukan Peta)'}
        className={`absolute top-2.5 sm:top-3 right-2.5 sm:right-3 z-[40] flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl shadow-lg border text-xs font-semibold backdrop-blur transition-all duration-200 cursor-pointer ${
          isLocked
            ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-amber-500/25 hover:bg-amber-400'
            : 'bg-[#062648]/90 text-blue-100 border-blue-300/30 shadow-[#021c38]/40 hover:bg-[#0c3664] hover:text-white'
        }`}
      >
        {isLocked ? (
          <>
            <Lock className="w-3.5 h-3.5 text-slate-950 shrink-0" />
            <span className="hidden xs:inline sm:inline">Peta Terkunci</span>
            <span className="xs:hidden sm:hidden">Kunci</span>
          </>
        ) : (
          <>
            <Unlock className="w-3.5 h-3.5 text-blue-300 shrink-0" />
            <span className="hidden xs:inline sm:inline">Kunci Peta</span>
            <span className="xs:hidden sm:hidden">Bebas</span>
          </>
        )}
      </button>

      {/* Indikator Sambung Jalan Aktif pada Peta */}
      {isEditing && selectedNodeForEdge && (
        <div className="absolute top-2.5 sm:top-3 left-12 sm:left-14 right-24 sm:right-auto z-[1000] bg-sky-950/95 text-white px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 text-[11px] sm:text-xs font-semibold backdrop-blur border border-sky-400/50 max-w-[calc(100%-8rem)] sm:max-w-none truncate animate-pulse">
          <Link2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="text-sky-200 truncate">
            Menyambung dari: <strong className="text-white">[{selectedNodeForEdge}]</strong> (Klik simpul ke-2)
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectNodeForEdge(null);
            }}
            className="ml-1 text-[10px] bg-rose-500/90 hover:bg-rose-500 text-white px-2 py-0.5 rounded font-bold cursor-pointer transition"
          >
            Batal
          </button>
        </div>
      )}

      <MapContainer
        center={center}
        zoom={17}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[400px]"
        attributionControl={true}
      >
        <MapLockController isLocked={isLocked} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler
          isEditing={isEditing}
          onAddNode={onAddNode}
        />

        {/* 1. Garis Jalan (Edges) dengan Visualisasi Warna Dinamis & Klik untuk Edit Bobot */}
        {edges.map((edge) => {
          const u = nodeMap.get(edge.from);
          const v = nodeMap.get(edge.to);
          if (!u || !v || typeof u.lat !== 'number' || typeof v.lat !== 'number') return null;

          const weight = edge.weight || haversine(u, v);
          const edgeKey = edge.from < edge.to ? `${edge.from}--${edge.to}` : `${edge.to}--${edge.from}`;
          const isHighlighted = highlightEdgeKeys.has(edgeKey);
          const isTourEdge = tourEdgeKeys.has(edgeKey);

          let strokeColor = '#475569';
          let strokeWeight = 3.5;
          let strokeOpacity = 0.5;

          const stepColor = currentStep?.data?.color || '#10b981';

          if (isHighlighted && !isTourEdge) {
            strokeColor = '#f59e0b';
            strokeWeight = 6;
            strokeOpacity = 1;
          } else if (isTourEdge) {
            strokeColor = stepColor;
            strokeWeight = 4.5;
            strokeOpacity = 0.95;
          }

          return (
            <Polyline
              key={edge.id || `${edge.from}-${edge.to}`}
              positions={[
                [u.lat, u.lng],
                [v.lat, v.lng]
              ]}
              pathOptions={{
                color: strokeColor,
                weight: strokeWeight,
                opacity: strokeOpacity,
                lineCap: 'round',
                lineJoin: 'round'
              }}
              eventHandlers={{
                click: (e) => handleEdgeClick(e, edge)
              }}
            >
              <Tooltip sticky>
                <div className="font-sans text-xs">
                  <strong>Jalan: {u.label || u.id} ↔ {v.label || v.id}</strong>
                  <div>Jarak: <span className="font-mono font-bold">{formatDist(weight)}</span></div>
                  {isHighlighted && <div className="text-amber-500 font-bold">● Sedang Diperiksa / Aktif</div>}
                  {isTourEdge && !isHighlighted && <div className="font-bold" style={{ color: stepColor }}>✓ Bagian Rute Tur Kampus</div>}
                  {isEditing && <div className="text-sky-400 font-bold">Klik untuk ubah bobot / hapus</div>}
                </div>
              </Tooltip>
              <Popup>
                <div className="text-xs space-y-2 p-1 min-w-[170px]">
                  <div>
                    <strong>Ruas Jalan Kampus:</strong>
                    <div className="text-slate-700 font-medium">{u.label || u.id} ↔ {v.label || v.id}</div>
                    <div className="text-slate-500 font-mono text-[11px] mt-0.5">Jarak: {formatDist(weight)}</div>
                  </div>
                  {isEditing && (
                    <div className="space-y-1.5 pt-1 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={(e) => handleEdgeClick(e, edge)}
                        className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold cursor-pointer border border-blue-200 transition"
                      >
                        <span>Ubah Jarak / Bobot</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveEdge(edge.id)}
                        className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold cursor-pointer border border-rose-200 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus Jalan Ini</span>
                      </button>
                    </div>
                  )}
                </div>
              </Popup>
            </Polyline>
          );
        })}

        {/* 2. Garis Rute Siklus Hamilton (Mengikuti Jalan) */}
        {tourPolylinePositions.length > 1 && (
          <Polyline
            positions={tourPolylinePositions}
            pathOptions={{
              color: currentStep?.data?.color || '#10b981',
              weight: 5.5,
              opacity: 0.95,
              lineCap: 'round',
              lineJoin: 'round'
            }}
          >
            <Tooltip sticky>
              <div className="font-sans text-xs font-bold" style={{ color: currentStep?.data?.color || '#10b981' }}>
                Rute Tur Keliling Kampus ({tourPolylinePositions.length} Titik)
              </div>
            </Tooltip>
          </Polyline>
        )}

        {/* 3. Marker Simpul (Bisa di-drag kapanpun saat Mode Edit aktif) */}
        {nodes.map((node) => {
          if (typeof node.lat !== 'number' || typeof node.lng !== 'number') return null;

          const isWaypoint = node.type === 'waypoint';
          const isCurrentNode = currentNodeId === node.id;
          const isTargetNode = targetNodeId === node.id;
          const isHighlighted = highlightNodes.has(node.id);
          const isSelectedForEdge = selectedNodeForEdge === node.id;
          const isStartNode = startNodeId === node.id;
          const isInTour = currentTourNodes.includes(node.id);
          const stepColor = currentStep?.data?.color || '#10b981';

          const icon = createNodeIcon(
            isWaypoint,
            isStartNode,
            isCurrentNode,
            isTargetNode,
            isHighlighted,
            isSelectedForEdge,
            false,
            isInTour,
            stepColor
          );

          // Simpul bisa di-drag kapanpun saat mode edit aktif
          const canDrag = isEditing;

          return (
            <Marker
              key={node.id}
              position={[node.lat, node.lng]}
              draggable={canDrag}
              icon={icon}
              eventHandlers={{
                dragend: (e) => {
                  const { lat, lng } = e.target.getLatLng();
                  if (onUpdateNodePosition) {
                    onUpdateNodePosition(node.id, lat, lng);
                  }
                },
                click: (e) => handleNodeClick(e, node.id)
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div className="text-xs font-semibold">
                  {node.label || node.id}
                  {isCurrentNode && (
                    <span className="text-purple-400 font-bold block text-[10px]">
                      ● Posisi Saat Ini (Warna Ungu)
                    </span>
                  )}
                  {isTargetNode && !isCurrentNode && (
                    <span className="text-amber-400 font-bold block text-[10px]">
                      ● Target Kunjungan Terdekat
                    </span>
                  )}
                  {isStartNode && !isCurrentNode && (
                    <span className="text-purple-300 block text-[10px]">★ Titik Awal Pilihan</span>
                  )}
                  {isWaypoint ? (
                    <span className="text-slate-400 block text-[10px]">(Tikungan/Waypoint)</span>
                  ) : (
                    <span className="text-emerald-400 block text-[10px]">(Lokasi Tujuan)</span>
                  )}
                  {isEditing && <span className="text-teal-400 block text-[10px]">Tarik (drag) untuk geser</span>}
                </div>
              </Tooltip>

              <Popup>
                <div className="text-xs space-y-2 p-1 min-w-[170px]">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-slate-800">
                      <span>{node.label || node.id}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-normal ${
                        isWaypoint ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {isWaypoint ? 'Tikungan' : 'Gedung'}
                      </span>
                    </div>
                    <p className="text-slate-500 font-mono text-[10px] mt-0.5">
                      Lat: {node.lat.toFixed(5)}, Lng: {node.lng.toFixed(5)}
                    </p>
                  </div>

                  {/* 2 Pilihan Utama saat Mode Edit: Sambung Sisi & Hapus Node */}
                  {isEditing && (
                    <div className="pt-2 border-t border-slate-200 space-y-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectNodeForEdge(node.id)}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer text-xs shadow-sm transition"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        <span>Sambung Sisi / Jalan</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onRemoveNode(node.id)}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-semibold cursor-pointer text-xs transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus Node</span>
                      </button>
                    </div>
                  )}

                  {/* Tombol Jadikan Titik Awal */}
                  {!isWaypoint && onSetStartNode && (
                    <div className={isEditing ? 'pt-1.5 border-t border-slate-100' : ''}>
                      <button
                        type="button"
                        onClick={() => onSetStartNode(node.id)}
                        className={`w-full flex items-center justify-center gap-1.5 px-2 py-1 rounded text-xs font-semibold cursor-pointer border transition ${
                          isStartNode
                            ? 'bg-purple-100 text-purple-700 border-purple-300'
                            : 'bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border-slate-200'
                        }`}
                      >
                        <Flag className="w-3.5 h-3.5 text-purple-600" />
                        <span>{isStartNode ? 'Titik Awal Aktif' : 'Jadikan Titik Awal'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
