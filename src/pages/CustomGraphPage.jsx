import React, { useState, useMemo, useCallback } from 'react';
import { solveTSP } from '../algorithms/solveTSP.js';
import { useStepPlayer } from '../hooks/useStepPlayer.js';
import InteractiveGraphCanvas from '../components/graph/InteractiveGraphCanvas.jsx';
import StepControls from '../components/stepper/StepControls.jsx';
import StepperInspector from '../components/stepper/StepperInspector.jsx';
import CustomGraphHeader from '../components/features/custom-graph/CustomGraphHeader.jsx';
import { AlertCircle } from 'lucide-react';

const PRESETS = {
  triangle: {
    nodes: [
      { id: 'A', x: 300, y: 90 },
      { id: 'B', x: 460, y: 340 },
      { id: 'C', x: 140, y: 340 }
    ],
    edges: [
      { id: 'e1', from: 'A', to: 'B', weight: 12 },
      { id: 'e2', from: 'B', to: 'C', weight: 16 },
      { id: 'e3', from: 'C', to: 'A', weight: 14 }
    ]
  },
  square: {
    nodes: [
      { id: 'A', x: 160, y: 110 },
      { id: 'B', x: 440, y: 110 },
      { id: 'C', x: 440, y: 350 },
      { id: 'D', x: 160, y: 350 }
    ],
    edges: [
      { id: 'e1', from: 'A', to: 'B', weight: 10 },
      { id: 'e2', from: 'B', to: 'C', weight: 10 },
      { id: 'e3', from: 'C', to: 'D', weight: 10 },
      { id: 'e4', from: 'D', to: 'A', weight: 10 },
      { id: 'e5', from: 'A', to: 'C', weight: 14 },
      { id: 'e6', from: 'B', to: 'D', weight: 15 }
    ]
  },
  k5: {
    nodes: [
      { id: 'A', x: 300, y: 80 },
      { id: 'B', x: 470, y: 200 },
      { id: 'C', x: 410, y: 370 },
      { id: 'D', x: 190, y: 370 },
      { id: 'E', x: 130, y: 200 }
    ],
    edges: [
      { id: 'e1', from: 'A', to: 'B', weight: 8 },
      { id: 'e2', from: 'B', to: 'C', weight: 9 },
      { id: 'e3', from: 'C', to: 'D', weight: 11 },
      { id: 'e4', from: 'D', to: 'E', weight: 7 },
      { id: 'e5', from: 'E', to: 'A', weight: 10 },
      { id: 'e6', from: 'A', to: 'C', weight: 14 },
      { id: 'e7', from: 'B', to: 'D', weight: 15 },
      { id: 'e8', from: 'C', to: 'E', weight: 12 }
    ]
  }
};

/**
 * CustomGraphPage
 * Sandbox pembuatan graf kustom interaktif (Simpul, Sisi Berbobot, Nearest Neighbor TSP).
 * Direfactor dengan arsitektur fitur modular dan styling selaras Hero.
 */
export default function CustomGraphPage() {
  const [nodes, setNodes] = useState(PRESETS.square.nodes);
  const [edges, setEdges] = useState(PRESETS.square.edges);
  const [selectedNodeForEdge, setSelectedNodeForEdge] = useState(null);
  const [startNodeId, setStartNodeId] = useState('A');

  // Tambah simpul baru
  const handleAddNode = useCallback((x, y) => {
    setNodes((prev) => {
      const count = prev.length;
      let nextId;
      if (count < 26) {
        nextId = String.fromCharCode(65 + count);
      } else {
        nextId = `V${count + 1}`;
      }
      return [...prev, { id: nextId, x, y }];
    });
  }, []);

  const handleUpdateNodePosition = useCallback((id, x, y) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, x, y } : n))
    );
  }, []);

  const handleRemoveNode = useCallback((id) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.from !== id && e.to !== id));
    if (selectedNodeForEdge === id) setSelectedNodeForEdge(null);
  }, [selectedNodeForEdge]);

  const handleAddEdge = useCallback((from, to, weight) => {
    if (!from || !to || from === to) return;
    setEdges((prev) => {
      const exists = prev.some(
        (e) => (e.from === from && e.to === to) || (e.from === to && e.to === from)
      );
      if (exists) return prev;
      const newEdge = {
        id: `e_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        from,
        to,
        weight: Math.round(weight * 10) / 10
      };
      return [...prev, newEdge];
    });
  }, []);

  const handleRemoveEdge = useCallback((edgeId) => {
    setEdges((prev) => prev.filter((e) => e.id !== edgeId));
  }, []);

  const handleUpdateEdgeWeight = useCallback((edgeId, newWeight) => {
    setEdges((prev) =>
      prev.map((e) => (e.id === edgeId ? { ...e, weight: newWeight } : e))
    );
  }, []);

  const handleConnectAll = () => {
    const newEdges = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const u = nodes[i];
        const v = nodes[j];
        const dist = Math.round(Math.hypot(u.x - v.x, u.y - v.y));
        newEdges.push({
          id: `e_${u.id}_${v.id}`,
          from: u.id,
          to: v.id,
          weight: dist
        });
      }
    }
    setEdges(newEdges);
  };

  const handleClear = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNodeForEdge(null);
  };

  const handleSelectPreset = (key) => {
    if (PRESETS[key]) {
      setNodes(PRESETS[key].nodes);
      setEdges(PRESETS[key].edges);
      setSelectedNodeForEdge(null);
    }
  };

  // Pastikan simpul awal valid
  const effectiveStartNode = useMemo(() => {
    if (startNodeId && nodes.some((n) => n.id === startNodeId)) {
      return startNodeId;
    }
    return nodes[0]?.id || '';
  }, [startNodeId, nodes]);

  // Jalankan algoritma solveTSP (Nearest Neighbor)
  const currentGraph = useMemo(() => ({ nodes, edges }), [nodes, edges]);

  const solverOutput = useMemo(() => {
    return solveTSP(currentGraph, effectiveStartNode);
  }, [currentGraph, effectiveStartNode]);

  const stepPlayer = useStepPlayer(solverOutput.steps || [], 1200);

  return (
    <div className="flex-1 flex flex-col min-h-[calc(100svh-4rem)] bg-gradient-to-b from-[#093563] via-[#0a3a6b] to-[#072d54] p-3.5 sm:p-6 lg:p-8 font-['Poppins',sans-serif] text-white">
      {/* 1. Header Informasi & Preset */}
      <CustomGraphHeader
        nodeCount={nodes.length}
        edgeCount={edges.length}
        nodes={nodes}
        effectiveStartNode={effectiveStartNode}
        onStartNodeChange={setStartNodeId}
        onSelectPreset={handleSelectPreset}
        onConnectAll={handleConnectAll}
        onClear={handleClear}
      />

      {/* Status banner saat menyambungkan edge atau petunjuk interaksi intuitif */}
      {selectedNodeForEdge ? (
        <div className="mb-4 px-4 py-3 rounded-2xl bg-sky-500/20 border border-sky-400/40 text-sky-100 flex items-center justify-between gap-3 text-xs sm:text-sm shadow-lg animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping shrink-0" />
            <span>
              <strong>Menyambungkan Sisi:</strong> Klik simpul tujuan untuk membuat sisi dari simpul <strong className="text-amber-300">[{selectedNodeForEdge}]</strong>
            </span>
          </div>
          <button
            onClick={() => setSelectedNodeForEdge(null)}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold border border-white/20 transition cursor-pointer"
          >
            Batal
          </button>
        </div>
      ) : (
        <div className="mb-4 px-3.5 py-2.5 rounded-2xl bg-[#062648]/85 border border-blue-300/25 text-blue-100/90 flex items-center gap-2.5 text-xs shadow-md">
          <span className="text-amber-400 text-sm">💡</span>
          <span className="leading-relaxed">
            <strong>Cara Mengedit Graf:</strong> Klik area kosong kanvas untuk tambah simpul • Klik simpul untuk opsi sambung sisi / hapus • Drag simpul kapanpun untuk menggeser • Klik sisi untuk edit bobot.
          </span>
        </div>
      )}

      {/* Warning jika graf belum terhubung atau simpul < 3 */}
      {!solverOutput.ok && (
        <div className="mb-4 p-3.5 sm:p-4 rounded-2xl bg-amber-500/15 border border-amber-400/35 text-amber-200 flex items-center gap-3 text-xs sm:text-sm shadow-lg">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
          <div>
            <strong>Graf Belum Membentuk Siklus:</strong> {solverOutput.error}
          </div>
        </div>
      )}

      {/* 3. Main Layout: Canvas (Kiri) & Stepper Inspector (Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 flex-1 items-start">
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="h-[280px] sm:h-[370px] lg:h-[430px] w-full">
            <InteractiveGraphCanvas
              nodes={nodes}
              edges={edges}
              selectedNodeForEdge={selectedNodeForEdge}
              onSelectNodeForEdge={setSelectedNodeForEdge}
              onAddNode={handleAddNode}
              onUpdateNodePosition={handleUpdateNodePosition}
              onRemoveNode={handleRemoveNode}
              onAddEdge={handleAddEdge}
              onRemoveEdge={handleRemoveEdge}
              onUpdateEdgeWeight={handleUpdateEdgeWeight}
              currentStep={stepPlayer.currentStep}
            />
          </div>

          <StepControls
            currentStepIndex={stepPlayer.currentStepIndex}
            totalSteps={stepPlayer.totalSteps}
            isPlaying={stepPlayer.isPlaying}
            speed={stepPlayer.speed}
            onTogglePlay={stepPlayer.togglePlay}
            onPrev={stepPlayer.prevStep}
            onNext={stepPlayer.nextStep}
            onRestart={stepPlayer.restart}
            onSpeedChange={stepPlayer.setSpeed}
          />
        </div>

        <div className="lg:col-span-5 flex flex-col">
          <StepperInspector currentStep={stepPlayer.currentStep} isCampusMode={false} />
        </div>
      </div>
    </div>
  );
}
