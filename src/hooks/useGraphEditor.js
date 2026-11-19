import { useState, useCallback } from 'react';

/**
 * Custom hook untuk mengelola penambahan, penggeseran, & penghapusan simpul dan sisi.
 * Mendukung simpul 'place' (tempat tujuan) dan 'waypoint' (tikungan/persimpangan).
 */
export function useGraphEditor(initialNodes = [], initialEdges = []) {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedNodeForEdge, setSelectedNodeForEdge] = useState(null);

  const resetTo = useCallback((newNodes, newEdges = []) => {
    setNodes(newNodes);
    setEdges(newEdges);
    setSelectedNodeForEdge(null);
  }, []);

  const addNode = useCallback((coords, label, type = 'place') => {
    const isGeo = coords.lat !== undefined;
    const count = nodes.length + 1;
    const defaultLabel = type === 'place' ? `Gedung ${count}` : `Tikungan ${count}`;
    const baseId = label && label.trim()
      ? label.trim().replace(/[^a-zA-Z0-9_-]/g, '_')
      : (type === 'place' ? `G_${count}` : `W_${count}`);

    // Pastikan ID simpul selalu unik meskipun beberapa tikungan memiliki label sama
    let uniqueId = baseId;
    let counter = 1;
    while (nodes.some((n) => n.id === uniqueId)) {
      uniqueId = `${baseId}_${counter++}`;
    }

    const newNode = {
      id: uniqueId,
      label: label && label.trim() ? label.trim() : defaultLabel,
      type, // 'place' atau 'waypoint'
      ...(isGeo
        ? {
            lat: Math.round(coords.lat * 100000) / 100000,
            lng: Math.round(coords.lng * 100000) / 100000
          }
        : {
            x: Math.round(coords.x),
            y: Math.round(coords.y)
          })
    };

    setNodes((prev) => [...prev, newNode]);
    return newNode;
  }, [nodes]);

  const updateNodePosition = useCallback((nodeId, latOrX, lngOrY) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== nodeId) return n;
        if (n.lat !== undefined) {
          return {
            ...n,
            lat: Math.round(latOrX * 100000) / 100000,
            lng: Math.round(lngOrY * 100000) / 100000
          };
        }
        return {
          ...n,
          x: Math.round(latOrX),
          y: Math.round(lngOrY)
        };
      })
    );
  }, []);

  const removeNode = useCallback((nodeId) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    // Hapus juga semua sisi yang terhubung dengan simpul yang dihapus
    setEdges((prev) => prev.filter((e) => e.from !== nodeId && e.to !== nodeId));
    if (selectedNodeForEdge === nodeId) {
      setSelectedNodeForEdge(null);
    }
  }, [selectedNodeForEdge]);

  const addEdge = useCallback((from, to, weight) => {
    if (!from || !to || from === to) return false;

    // Cek apakah sisi sudah ada
    const exists = edges.some(
      (e) => (e.from === from && e.to === to) || (e.from === to && e.to === from)
    );
    if (exists) return false;

    const newEdge = {
      id: `e_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      from,
      to,
      ...(typeof weight === 'number' ? { weight } : {})
    };

    setEdges((prev) => [...prev, newEdge]);
    return true;
  }, [edges]);

  const removeEdge = useCallback((edgeId) => {
    setEdges((prev) => prev.filter((e) => e.id !== edgeId));
  }, []);

  const updateEdgeWeight = useCallback((edgeId, weight) => {
    setEdges((prev) =>
      prev.map((e) => (e.id === edgeId ? { ...e, weight } : e))
    );
  }, []);

  const exportJSON = useCallback(() => {
    return JSON.stringify({ nodes, edges }, null, 2);
  }, [nodes, edges]);

  return {
    nodes,
    edges,
    isEditing,
    setIsEditing,
    selectedNodeForEdge,
    setSelectedNodeForEdge,
    addNode,
    updateNodePosition,
    removeNode,
    addEdge,
    removeEdge,
    updateEdgeWeight,
    resetTo,
    exportJSON
  };
}
