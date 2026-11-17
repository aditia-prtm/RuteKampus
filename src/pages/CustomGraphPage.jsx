import React, { useState, useMemo, useCallback } from 'react';
import { solveTSP } from '../algorithms/solveTSP.js';
import { useStepPlayer } from '../hooks/useStepPlayer.js';
import InteractiveGraphCanvas from '../components/graph/InteractiveGraphCanvas.jsx';
import StepControls from '../components/stepper/StepControls.jsx';
import ExplanationPanel from '../components/stepper/ExplanationPanel.jsx';
import PseudocodePanel from '../components/stepper/PseudocodePanel.jsx';
import DataPanel from '../components/stepper/DataPanel.jsx';
import {
  Plus,
  Link2,
  Move,
  Trash2,
  AlertCircle,
  Shapes,
  Sparkles,
  Flag
} from 'lucide-react';

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

export default function CustomGraphPage() {
  const [nodes, setNodes] = useState(PRESETS.square.nodes);
  const [edges, setEdges] = useState(PRESETS.square.edges);
  const [currentMode, setCurrentMode] = useState('add-node'); // 'add-node' | 'add-edge' | 'drag' | 'delete'
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

  // Pastikan simpul awal valid
  const effectiveStartNode = useMemo(() => {
    if (startNodeId && nodes.some((n) => n.id === startNodeId)) {
      return startNodeId;
    }
    return nodes[0]?.id || '';
  }, [startNodeId, nodes]);

  // Jalankan algoritma solveTSP
  const currentGraph = useMemo(() => ({ nodes, edges }), [nodes, edges]);

  const solverOutput = useMemo(() => {
    return solveTSP(currentGraph, effectiveStartNode);
  }, [currentGraph, effectiveStartNode]);

  const stepPlayer = useStepPlayer(solverOutput.steps || [], 1200);

  return (
    <div className="flex-1 flex flex-col min-h-[calc(100vh-4rem)] bg-slate-950 p-4 sm:p-6 lg:p-8">
      {/* Top Bar: Kontrol Preset & Aksi Kanvas */}
      <div className="mb-4 bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400">
              <Shapes className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                Mode Bikin Graf Sendiri (Simpul & Sisi Berbobot)
              </h2>
              <span className="text-[11px] text-slate-400">
                {nodes.length} Simpul • {edges.length} Sisi
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
            <button
              onClick={() => {
                setNodes(PRESETS.triangle.nodes);
                setEdges(PRESETS.triangle.edges);
              }}
              className="px-2.5 py-1 rounded text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            >
              Segitiga (3)
            </button>
            <button
              onClick={() => {
                setNodes(PRESETS.square.nodes);
                setEdges(PRESETS.square.edges);
              }}
              className="px-2.5 py-1 rounded text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            >
              Persegi (4)
            </button>
            <button
              onClick={() => {
                setNodes(PRESETS.k5.nodes);
                setEdges(PRESETS.k5.edges);
              }}
              className="px-2.5 py-1 rounded text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            >
              Pentagon (5)
            </button>
            <button
              onClick={handleConnectAll}
              title="Hubungkan semua simpul dengan sisi berbobot Euclidean otomatis"
              className="flex items-center gap-1 px-2.5 py-1 rounded text-xs text-teal-400 hover:bg-teal-500/10 transition cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Hubungkan Semua</span>
            </button>
          </div>
        </div>

        {/* Start Node Selector & Clear */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
            <Flag className="w-3.5 h-3.5 text-purple-400" />
            <label htmlFor="start-custom" className="text-xs text-slate-300 font-medium">
              Simpul Awal:
            </label>
            <select
              id="start-custom"
              value={effectiveStartNode}
              onChange={(e) => setStartNodeId(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-purple-300 font-semibold text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-400 cursor-pointer"
            >
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  Simpul {n.id}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleClear}
            title="Kosongkan Kanvas"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Kosongkan</span>
          </button>
        </div>
      </div>

      {/* Toolbar Pilihan Alat Mode Interaksi */}
      <div className="mb-4 bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-300 font-semibold">Alat Interaksi:</span>
          <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => {
                setCurrentMode('add-node');
                setSelectedNodeForEdge(null);
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs transition cursor-pointer ${
                currentMode === 'add-node'
                  ? 'bg-emerald-600 text-white font-semibold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>1. Tambah Simpul</span>
            </button>
            <button
              onClick={() => setCurrentMode('add-edge')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs transition cursor-pointer ${
                currentMode === 'add-edge'
                  ? 'bg-sky-600 text-white font-semibold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>2. Sambung Sisi & Beri Bobot</span>
            </button>
            <button
              onClick={() => {
                setCurrentMode('drag');
                setSelectedNodeForEdge(null);
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs transition cursor-pointer ${
                currentMode === 'drag'
                  ? 'bg-amber-600 text-white font-semibold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Move className="w-3.5 h-3.5" />
              <span>3. Geser Simpul (Drag)</span>
            </button>
            <button
              onClick={() => {
                setCurrentMode('delete');
                setSelectedNodeForEdge(null);
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs transition cursor-pointer ${
                currentMode === 'delete'
                  ? 'bg-rose-600 text-white font-semibold shadow'
                  : 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>4. Hapus Simpul/Sisi</span>
            </button>
          </div>
        </div>

        <div className="text-slate-400 text-[11px]">
          {currentMode === 'add-node' && 'Klik kanvas untuk membuat simpul baru.'}
          {currentMode === 'add-edge' && 'Klik simpul pertama, lalu klik simpul kedua dan masukkan bobotnya.'}
          {currentMode === 'drag' && 'Tarik simpul untuk memindahkan posisinya.'}
          {currentMode === 'delete' && 'Klik simpul atau garis sisi mana saja untuk langsung menghapusnya.'}
        </div>
      </div>

      {/* Warning jika graf belum terhubung atau simpul < 3 */}
      {!solverOutput.ok && (
        <div className="mb-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
          <div>
            <strong>Graf Belum Membentuk Siklus:</strong> {solverOutput.error}
          </div>
        </div>
      )}

      {/* Main Grid: Canvas (Kiri) & Stepper Panels (Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="h-[460px] sm:h-[520px] w-full">
            <InteractiveGraphCanvas
              nodes={nodes}
              edges={edges}
              currentMode={currentMode}
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

        <div className="lg:col-span-5 flex flex-col gap-4">
          <ExplanationPanel currentStep={stepPlayer.currentStep} />
          <DataPanel currentStep={stepPlayer.currentStep} />
          <PseudocodePanel currentStep={stepPlayer.currentStep} />
        </div>
      </div>
    </div>
  );
}
