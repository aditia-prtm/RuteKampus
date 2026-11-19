import React, { useMemo, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Trash2, Flag, Lock, Unlock } from 'lucide-react';
import { haversine } from '../../algorithms/geo.js';

// Format jarak dalam meter atau km
function formatDist(meters) {
  if (!meters) return '0 m';
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`;
  }
  return `${Math.round(meters)} m`;
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
function createNodeIcon(isWaypoint, isStartNode, isHighlighted, isSelectedForEdge, isDeleteMode, isInTour, tourColor = '#10b981') {
  let bg = isWaypoint ? '#64748b' : '#2563eb';
  if (isSelectedForEdge) bg = '#0284c7';
  else if (isStartNode) bg = '#8b5cf6';
  else if (isHighlighted) bg = '#f59e0b';
  else if (isInTour && !isWaypoint) bg = tourColor;
  else if (isDeleteMode) bg = '#f43f5e';

  // Simpul yang sedang dipilih untuk disambung akan membesar agar terlihat jelas
  const size = isSelectedForEdge ? 24 : isWaypoint ? 14 : isStartNode ? 22 : 18;
  const border = isSelectedForEdge
    ? '3px solid #38bdf8'
    : isStartNode
    ? '3px solid #c084fc'
    : isDeleteMode
    ? '2px solid #ffe4e6'
    : '2px solid #ffffff';

  const shadow = isSelectedForEdge
    ? '0 0 14px #38bdf8, 0 2px 8px rgba(0,0,0,0.6)'
    : '0 2px 6px rgba(0,0,0,0.45)';

  // Outer container dengan hit area 34px menjamin tikungan sangat mudah diklik
  return L.divIcon({
    className: 'custom-node-pin',
    html: `<div style="
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
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
      "></div>
    </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
}

// Subkomponen penangkap event klik pada kanvas peta
function MapClickHandler({ isEditing, editTool, onAddNode }) {
  useMapEvents({
    click(e) {
      if (!isEditing || editTool === 'connect' || editTool === 'delete' || editTool === 'move' || !onAddNode) return;
      const { lat, lng } = e.latlng;

      if (editTool === 'waypoint') {
        const label = window.prompt(
          'Nama Tikungan / Persimpangan Jalan (Waypoint):',
          'Tikungan'
        );
        if (label !== null) {
          onAddNode({ lat, lng }, label.trim(), 'waypoint');
        }
      } else if (editTool === 'place') {
        const label = window.prompt(
          'Nama Tempat / Gedung Tujuan Kampus:',
          'Gedung Baru'
        );
        if (label && label.trim()) {
          onAddNode({ lat, lng }, label.trim(), 'place');
        }
      }
    }
  });
  return null;
}

export default function LeafletMapView({
  graph,
  currentStep,
  isEditing = false,
  editTool = 'place', // 'place' | 'waypoint' | 'connect' | 'move' | 'delete'
  selectedNodeForEdge,
  startNodeId,
  onSetStartNode,
  onSelectNodeForEdge,
  onAddNode,
  onUpdateNodePosition,
  onRemoveNode,
  onAddEdge,
  onRemoveEdge
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
    L.DomEvent.stopPropagation(e);
    if (!isEditing) return;

    if (editTool === 'delete') {
      onRemoveNode(nodeId);
      return;
    }

    if (editTool === 'connect') {
      if (!selectedNodeForEdge) {
        onSelectNodeForEdge(nodeId);
      } else if (selectedNodeForEdge === nodeId) {
        onSelectNodeForEdge(null);
      } else {
        onAddEdge(selectedNodeForEdge, nodeId);
        onSelectNodeForEdge(null);
      }
    }
  };

  const handleEdgeClick = (e, edgeId) => {
    L.DomEvent.stopPropagation(e);
    if (isEditing && editTool === 'delete') {
      onRemoveEdge(edgeId);
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
        className={`absolute top-2.5 sm:top-3 right-2.5 sm:right-3 z-[1000] flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl shadow-lg border text-xs font-semibold backdrop-blur transition-all duration-200 cursor-pointer ${
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

      {/* Banner Keterangan Mode Edit (Responsif di HP) */}
      {isEditing && (
        <div className="absolute top-2.5 sm:top-3 left-12 sm:left-14 right-24 sm:right-auto z-[1000] bg-[#062648]/95 text-white px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 text-[11px] sm:text-xs font-semibold backdrop-blur border border-blue-300/30 max-w-[calc(100%-8rem)] sm:max-w-none truncate">
          {editTool === 'place' && (
            <span className="text-amber-300 truncate">● Klik peta untuk tambah Gedung/Tempat</span>
          )}
          {editTool === 'waypoint' && (
            <span className="text-blue-200 truncate">◆ Klik peta untuk tambah Tikungan/Jalan</span>
          )}
          {editTool === 'connect' && (
            <div className="flex items-center gap-1.5 truncate">
              {selectedNodeForEdge ? (
                <>
                  <span className="text-amber-300 font-bold truncate">
                    [1/2] Terpilih: {selectedNodeForEdge}. Klik simpul atau tikungan ke-2!
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectNodeForEdge(null);
                    }}
                    className="ml-1 text-[10px] bg-rose-500/80 hover:bg-rose-500 text-white px-2 py-0.5 rounded font-bold cursor-pointer transition"
                  >
                    Batal
                  </button>
                </>
              ) : (
                <span className="text-sky-300 truncate">Klik simpul/tikungan pertama untuk menyambung jalan</span>
              )}
            </div>
          )}
          {editTool === 'move' && (
            <span className="text-blue-100 truncate">✥ Tarik simpul untuk pindah posisi</span>
          )}
          {editTool === 'delete' && (
            <span className="text-rose-300 truncate">✕ Klik simpul/garis untuk hapus</span>
          )}
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
          editTool={editTool}
          onAddNode={onAddNode}
        />

        {/* 1. Garis Jalan (Edges) dengan Visualisasi Warna Dinamis */}
        {edges.map((edge) => {
          const u = nodeMap.get(edge.from);
          const v = nodeMap.get(edge.to);
          if (!u || !v || typeof u.lat !== 'number' || typeof v.lat !== 'number') return null;

          const weight = edge.weight || haversine(u, v);
          const isDeleteMode = isEditing && editTool === 'delete';
          const edgeKey = edge.from < edge.to ? `${edge.from}--${edge.to}` : `${edge.to}--${edge.from}`;
          const isHighlighted = highlightEdgeKeys.has(edgeKey);
          const isTourEdge = tourEdgeKeys.has(edgeKey);

          let strokeColor = '#475569';
          let strokeWeight = 3.5;
          let strokeOpacity = 0.5;

          const stepColor = currentStep?.data?.color || '#10b981';

          if (isDeleteMode) {
            strokeColor = '#f43f5e';
            strokeWeight = 5;
            strokeOpacity = 0.85;
          } else if (isHighlighted && !isTourEdge) {
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
                click: (e) => handleEdgeClick(e, edge.id)
              }}
            >
              <Tooltip sticky>
                <div className="font-sans text-xs">
                  <strong>Jalan: {u.label || u.id} ↔ {v.label || v.id}</strong>
                  <div>Jarak: <span className="font-mono font-bold">{formatDist(weight)}</span></div>
                  {isHighlighted && <div className="text-amber-500 font-bold">● Sedang Diperiksa / Aktif</div>}
                  {isTourEdge && !isHighlighted && <div className="font-bold" style={{ color: stepColor }}>✓ Bagian Rute Tur Kampus</div>}
                  {isDeleteMode && <div className="text-rose-600 font-bold">Klik untuk hapus jalan</div>}
                </div>
              </Tooltip>
              <Popup>
                <div className="text-xs space-y-2 p-1">
                  <div>
                    <strong>Ruas Jalan:</strong>
                    <div className="text-slate-600">{u.label || u.id} ↔ {v.label || v.id}</div>
                    <div className="text-slate-500 font-mono text-[11px]">Jarak: {formatDist(weight)}</div>
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => onRemoveEdge(edge.id)}
                      className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold cursor-pointer border border-rose-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Ruas Jalan Ini</span>
                    </button>
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

        {/* 3. Marker Simpul (Mendukung Draggable saat Mode Edit) */}
        {nodes.map((node) => {
          if (typeof node.lat !== 'number' || typeof node.lng !== 'number') return null;

          const isWaypoint = node.type === 'waypoint';
          const isHighlighted = highlightNodes.has(node.id);
          const isSelectedForEdge = selectedNodeForEdge === node.id;
          const isStartNode = startNodeId === node.id;
          const isInTour = currentTourNodes.includes(node.id);
          const isDeleteMode = isEditing && editTool === 'delete';
          const stepColor = currentStep?.data?.color || '#10b981';

          const icon = createNodeIcon(
            isWaypoint,
            isStartNode,
            isHighlighted,
            isSelectedForEdge,
            isDeleteMode,
            isInTour,
            stepColor
          );

          // Simpul bisa di-drag saat mode edit aktif
          const canDrag = isEditing && (editTool === 'move' || editTool === 'place' || editTool === 'waypoint');

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
                  {isStartNode && <span className="text-purple-600 block text-[10px]">★ Titik Awal Pilihan</span>}
                  {isWaypoint ? (
                    <span className="text-slate-500 block text-[10px]">(Tikungan/Waypoint)</span>
                  ) : (
                    <span className="text-emerald-600 block text-[10px]">(Lokasi Tujuan)</span>
                  )}
                  {isEditing && <span className="text-teal-600 block text-[10px]">Tarik (drag) untuk geser</span>}
                </div>
              </Tooltip>

              {/* Popup informasi hanya muncul saat tidak dalam mode sambung/hapus agar tidak mengganggu klik */}
              {(!isEditing || (editTool !== 'connect' && editTool !== 'delete')) && (
                <Popup>
                  <div className="text-xs space-y-2 p-1 min-w-[150px]">
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

                    {/* Tombol Jadikan Titik Awal */}
                    {!isWaypoint && onSetStartNode && (
                      <button
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
                    )}

                    {/* Tombol Hapus Simpul */}
                    {isEditing && onRemoveNode && (
                      <button
                        onClick={() => onRemoveNode(node.id)}
                        className="w-full flex items-center justify-center gap-1.5 px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold cursor-pointer border border-rose-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus Simpul Ini</span>
                      </button>
                    )}
                  </div>
                </Popup>
              )}
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
