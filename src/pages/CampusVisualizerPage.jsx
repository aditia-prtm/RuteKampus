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
import CampusToolbar from '../components/features/campus/CampusToolbar.jsx';
import { AlertCircle } from 'lucide-react';

/**
 * CampusVisualizerPage
 * Visualisasi Siklus Hamilton Shuttle Bus di Kampus Unsri Bukit Besar Palembang.
 * Direfactor dengan arsitektur fitur modular dan styling selaras Hero.
 */
export default function CampusVisualizerPage() {
  const campusPreset = SAMPLE_GRAPHS[0]; // Unsri Bukit Besar Palembang
  const [startNodeId, setStartNodeId] = useState('');
  const [copied, setCopied] = useState(false);
  const [editTool, setEditTool] = useState('place'); // 'place' | 'waypoint' | 'connect' | 'move' | 'delete'

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

  // Eksekusi algoritma solveTSP murni
  const solverOutput = useMemo(() => {
    return solveTSP(currentGraph, effectiveStartNode);
  }, [currentGraph, effectiveStartNode]);

  const stepPlayer = useStepPlayer(solverOutput.steps || [], 1200);

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(editor.exportJSON());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectTool = (toolId) => {
    setEditTool(toolId);
    editor.setSelectedNodeForEdge(null);
  };

  return (
    <div className="flex-1 flex flex-col min-h-[calc(100vh-4rem)] bg-gradient-to-b from-[#093563] via-[#0a3a6b] to-[#072d54] p-4 sm:p-6 lg:p-8 font-['Poppins',sans-serif] text-white">
      {/* 1. Header Informasi & Kontrol Awal */}
      <CampusHeader
        placeNodes={placeNodes}
        waypointNodes={waypointNodes}
        edgeCount={currentGraph.edges.length}
        effectiveStartNode={effectiveStartNode}
        onStartNodeChange={setStartNodeId}
        isEditing={editor.isEditing}
        onToggleEdit={() => editor.setIsEditing(!editor.isEditing)}
        onCopyJSON={handleCopyJSON}
        copied={copied}
        onReset={() => editor.resetTo(campusPreset.nodes, campusPreset.edges)}
      />

      {/* 2. Sub-Toolbar Mode Edit */}
      {APP_CONFIG.ALLOW_CAMPUS_EDIT && editor.isEditing && (
        <CampusToolbar
          editTool={editTool}
          onSelectTool={handleSelectTool}
        />
      )}

      {/* Alert Error Graf */}
      {!solverOutput.ok && (
        <div className="mb-4 p-4 rounded-2xl bg-rose-500/15 border border-rose-400/30 text-rose-200 flex items-center gap-3 text-xs sm:text-sm shadow-lg">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <div>
            <strong>Gagal Membentuk Rute TSP:</strong> {solverOutput.error}
          </div>
        </div>
      )}

      {/* 3. Main Layout: Map & Stepper Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="h-[460px] sm:h-[540px] w-full">
            <LeafletMapView
              graph={currentGraph}
              currentStep={stepPlayer.currentStep}
              isEditing={APP_CONFIG.ALLOW_CAMPUS_EDIT && editor.isEditing}
              editTool={editTool}
              selectedNodeForEdge={editor.selectedNodeForEdge}
              startNodeId={effectiveStartNode}
              onSetStartNode={(id) => setStartNodeId(id)}
              onSelectNodeForEdge={editor.setSelectedNodeForEdge}
              onAddNode={editor.addNode}
              onUpdateNodePosition={editor.updateNodePosition}
              onRemoveNode={editor.removeNode}
              onAddEdge={editor.addEdge}
              onRemoveEdge={editor.removeEdge}
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
          <StepperInspector currentStep={stepPlayer.currentStep} />
        </div>
      </div>
    </div>
  );
}
