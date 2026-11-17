import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Trash2, Flag, Move } from 'lucide-react';
import { haversine } from '../../algorithms/geo.js';

// Format jarak dalam meter atau km
function formatDist(meters) {
  if (!meters) return '0 m';
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`;
  }
  return `${Math.round(meters)} m`;
}

// Buat custom circular pin icon untuk Leaflet Marker agar mendukung draggable
function createNodeIcon(isWaypoint, isStartNode, isHighlighted, isSelectedForEdge, isDeleteMode) {
  let bg = isWaypoint ? '#64748b' : '#2563eb';
  if (isStartNode) bg = '#8b5cf6';
  else if (isHighlighted) bg = '#f59e0b';
  else if (isSelectedForEdge) bg = '#38bdf8';
  else if (isDeleteMode) bg = '#f43f5e';

  const size = isWaypoint ? 12 : isStartNode || isSelectedForEdge ? 22 : 18;
  const border = isSelectedForEdge
    ? '3px solid #38bdf8'
    : isStartNode
    ? '3px solid #c084fc'
    : isDeleteMode
    ? '2px solid #ffe4e6'
    : '2px solid #ffffff';

  return L.divIcon({
    className: 'custom-node-pin',
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${bg};
      border: ${border};
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.45);
      cursor: grab;
      box-sizing: border-box;
      transition: transform 0.15s ease;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
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
          'Nama Tempat / Gedung / Halte Tujuan Bus:',
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
  const fullTour = currentStep?.data?.fullTour || currentStep?.data?.tour || [];

  // Rute garis Siklus Hamilton yang mengikuti jalan & waypoint
  const tourPolylinePositions = useMemo(() => {
    if (fullTour.length < 2) return [];
    const positions = [];
    for (const nodeId of fullTour) {
      const node = nodeMap.get(nodeId);
      if (node && typeof node.lat === 'number' && typeof node.lng === 'number') {
        positions.push([node.lat, node.lng]);
      }
    }
    return positions;
  }, [fullTour, nodeMap]);

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
      data-lenis-prevent
      className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-blue-300/25 shadow-xl shadow-[#021c38]/40 relative"
    >
      {/* Banner Keterangan Mode Edit (Responsif di HP) */}
      {isEditing && (
        <div className="absolute top-2.5 sm:top-3 left-12 sm:left-14 right-2.5 sm:right-auto z-[1000] bg-[#062648]/95 text-white px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 text-[11px] sm:text-xs font-semibold backdrop-blur border border-blue-300/30 max-w-[calc(100%-3.5rem)] sm:max-w-none truncate">
          {editTool === 'place' && (
            <span className="text-amber-300 truncate">● Klik peta untuk tambah Gedung/Tempat</span>
          )}
          {editTool === 'waypoint' && (
            <span className="text-blue-200 truncate">◆ Klik peta untuk tambah Tikungan/Jalan</span>
          )}
          {editTool === 'connect' && (
            <span className="text-sky-300 truncate">
              {selectedNodeForEdge
                ? `Pilih simpul ke-2 dari [${selectedNodeForEdge}]`
                : 'Klik simpul pertama untuk menarik jalan'}
            </span>
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
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler
          isEditing={isEditing}
          editTool={editTool}
          onAddNode={onAddNode}
        />

        {/* 1. Garis Jalan (Edges) */}
        {edges.map((edge) => {
          const u = nodeMap.get(edge.from);
          const v = nodeMap.get(edge.to);
          if (!u || !v || typeof u.lat !== 'number' || typeof v.lat !== 'number') return null;

          const weight = edge.weight || haversine(u, v);
          const isDeleteMode = isEditing && editTool === 'delete';

          return (
            <Polyline
              key={edge.id || `${edge.from}-${edge.to}`}
              positions={[
                [u.lat, u.lng],
                [v.lat, v.lng]
              ]}
              pathOptions={{
                color: isDeleteMode ? '#f43f5e' : '#475569',
                weight: isDeleteMode ? 5 : 3.5,
                opacity: isDeleteMode ? 0.8 : 0.6
              }}
              eventHandlers={{
                click: (e) => handleEdgeClick(e, edge.id)
              }}
            >
              <Tooltip sticky>
                <div className="font-sans text-xs">
                  <strong>Jalan: {u.label || u.id} ↔ {v.label || v.id}</strong>
                  <div>Jarak: <span className="font-mono font-bold">{formatDist(weight)}</span></div>
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

        {/* 2. Garis Rute Siklus Hamilton Bus (Mengikuti Jalan) */}
        {tourPolylinePositions.length > 1 && (
          <Polyline
            positions={tourPolylinePositions}
            pathOptions={{
              color: '#10b981',
              weight: 5.5,
              opacity: 0.95,
              lineCap: 'round',
              lineJoin: 'round'
            }}
          >
            <Tooltip sticky>
              <div className="font-sans text-xs font-bold text-emerald-700">
                Rute Shuttle Bus Kampus
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
          const isInTour = fullTour.includes(node.id);
          const isDeleteMode = isEditing && editTool === 'delete';

          const icon = createNodeIcon(
            isWaypoint,
            isStartNode,
            isHighlighted,
            isSelectedForEdge,
            isDeleteMode
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
                    <span className="text-emerald-600 block text-[10px]">(Tujuan Bus)</span>
                  )}
                  {isEditing && <span className="text-teal-600 block text-[10px]">Tarik (drag) untuk geser</span>}
                </div>
              </Tooltip>

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
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
