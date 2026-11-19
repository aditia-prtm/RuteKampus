import React, { useState, useMemo } from 'react';
import { SAMPLE_GRAPHS } from '../data/sampleGraphs.js';
import { solveTSP } from '../algorithms/solveTSP.js';
import { useStepPlayer } from '../hooks/useStepPlayer.js';
import { useGraphEditor } from '../hooks/useGraphEditor.js';
import { APP_CONFIG } from '../data/config.js';
import LeafletMapView from '../components/map/LeafletMapView.jsx';
import StepControls from '../components/stepper/StepControls.jsx';
import StepperInspector from '../components/stepper/StepperInspector.jsx';
import CampusHeader from '../components/features/campus/CampusHeader.jsx';
import { AlertCircle, Link2, X } from 'lucide-react';

/**
 * CampusVisualizerPage
 * Visualisasi Traveling Salesperson Problem (TSP) & Siklus Hamilton di Kampus Unsri Bukit Besar Palembang.
 * Direfactor dengan sistem interaksi intuitif langsung tanpa toolbar manual:
 * - Klik peta kosong: tambah simpul
 * - Klik simpul: opsi sambung sisi atau hapus node
 * - Klik jalan/sisi: edit bobot/jarak
 * - Drag simpul kapanpun saat mode edit aktif
 */
export default function CampusVisualizerPage() {
  const campusPreset = SAMPLE_GRAPHS[0]; // Unsri Bukit Besar Palembang
  const [startNodeId, setStartNodeId] = useState('');
  const [copied, setCopied] = useState(false);

  // Hook editor graf peta kampus
  const editor = useGraphEditor(campusPreset.nodes, campusPreset.edges || []);

  const currentGraph = useMemo(() => {
    return {
      ...campusPreset,
      nodes: editor.nodes,
      edges: editor.edges
    };
  }, [campusPreset, editor.nodes, editor.edges]);

  const placeNodes = currentGraph.nodes.filter((n) => n.type !== 'waypoint');
  const waypointNodes = currentGraph.nodes.filter((n) => n.type === 'waypoint');

  // Pastikan simpul awal yang dipilih valid
  const effectiveStartNode = useMemo(() => {
    if (startNodeId && placeNodes.some((p) => p.id === startNodeId)) {
      return startNodeId;
    }
    return placeNodes[0]?.id || '';
  }, [startNodeId, placeNodes]);

  // Eksekusi algoritma solveTSP murni (Nearest Neighbor)
  const solverOutput = useMemo(() => {
    return solveTSP(currentGraph, effectiveStartNode);
  }, [currentGraph, effectiveStartNode]);

  const stepPlayer = useStepPlayer(solverOutput.steps || [], 1200);

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(editor.exportJSON());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-[calc(100svh-4rem)] bg-gradient-to-b from-[#093563] via-[#0a3a6b] to-[#072d54] p-3.5 sm:p-6 lg:p-8 font-['Poppins',sans-serif] text-white">
      {/* 1. Header Informasi & Kontrol Awal */}
      <CampusHeader
        placeNodes={placeNodes}
        waypointNodes={waypointNodes}
        edgeCount={currentGraph.edges.length}
        effectiveStartNode={effectiveStartNode}
        onStartNodeChange={setStartNodeId}
        isEditing={editor.isEditing}
        onToggleEdit={() => {
          editor.setIsEditing(!editor.isEditing);
          editor.setSelectedNodeForEdge(null);
        }}
        onCopyJSON={handleCopyJSON}
        copied={copied}
        onReset={() => editor.resetTo(campusPreset.nodes, campusPreset.edges)}
      />

      {/* 2. Banner Status Mode Edit Interaktif Langsung */}
      {APP_CONFIG.ALLOW_CAMPUS_EDIT && editor.isEditing && (
        <div className="mb-4">
          {editor.selectedNodeForEdge ? (
            <div className="p-3 rounded-2xl bg-sky-500/20 border border-sky-400/40 text-sky-200 flex items-center justify-between text-xs shadow-lg backdrop-blur-sm animate-pulse">
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>
                  Sedang menyambung ruas jalan dari <strong className="text-white font-mono bg-sky-900/60 px-1.5 py-0.5 rounded border border-sky-400/40">[{editor.selectedNodeForEdge}]</strong>. Klik simpul tujuan untuk menyambung.
                </span>
              </div>
              <button
                type="button"
                onClick={() => editor.setSelectedNodeForEdge(null)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold cursor-pointer text-[11px] transition"
              >
                <X className="w-3.5 h-3.5" />
                <span>Batal</span>
              </button>
            </div>
          ) : (
            <div className="px-3.5 py-2.5 rounded-2xl bg-[#062648]/85 border border-blue-300/25 text-blue-100/90 flex items-center gap-2.5 text-xs shadow-md">
              <span className="text-amber-400 text-sm">💡</span>
              <span className="leading-relaxed">
                <strong>Mode Edit Aktif:</strong> Klik peta kosong untuk tambah gedung/tikungan • Klik simpul untuk opsi sambung/hapus • Tarik simpul untuk geser • Klik jalan untuk edit jarak.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Alert Error Graf */}
      {!solverOutput.ok && (
        <div className="mb-4 p-3.5 sm:p-4 rounded-2xl bg-rose-500/15 border border-rose-400/30 text-rose-200 flex items-center gap-3 text-xs sm:text-sm shadow-lg">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <div>
            <strong>Gagal Membentuk Rute TSP:</strong> {solverOutput.error}
          </div>
        </div>
      )}

      {/* 3. Main Layout: Map & Stepper Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 flex-1 items-start">
        <div className="lg:col-span-7 flex flex-col gap-3.5 sm:gap-4">
          <div className="h-[260px] sm:h-[350px] lg:h-[430px] w-full">
            <LeafletMapView
              graph={currentGraph}
              currentStep={stepPlayer.currentStep}
              isEditing={APP_CONFIG.ALLOW_CAMPUS_EDIT && editor.isEditing}
              selectedNodeForEdge={editor.selectedNodeForEdge}
              startNodeId={effectiveStartNode}
              onSetStartNode={(id) => setStartNodeId(id)}
              onSelectNodeForEdge={editor.setSelectedNodeForEdge}
              onAddNode={editor.addNode}
              onUpdateNodePosition={editor.updateNodePosition}
              onRemoveNode={editor.removeNode}
              onAddEdge={editor.addEdge}
              onRemoveEdge={editor.removeEdge}
              onUpdateEdgeWeight={editor.updateEdgeWeight}
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

        <div className="lg:col-span-5 w-full">
          <StepperInspector currentStep={stepPlayer.currentStep} isCampusMode={true} />
        </div>
      </div>
    </div>
  );
}
