import React, { useState, useMemo } from 'react';
import { SAMPLE_GRAPHS } from '../data/sampleGraphs.js';
import { solveTSP } from '../algorithms/solveTSP.js';
import { useStepPlayer } from '../hooks/useStepPlayer.js';
import { useGraphEditor } from '../hooks/useGraphEditor.js';
import { APP_CONFIG } from '../data/config.js';
import LeafletMapView from '../components/map/LeafletMapView.jsx';
import StepControls from '../components/stepper/StepControls.jsx';
import ExplanationPanel from '../components/stepper/ExplanationPanel.jsx';
import PseudocodePanel from '../components/stepper/PseudocodePanel.jsx';
import DataPanel from '../components/stepper/DataPanel.jsx';
import {
  AlertCircle,
  PlusCircle,
  Check,
  Copy,
  RotateCcw,
  Lock,
  MapPin,
  GitBranch,
  Link2,
  Building2,
  Trash2,
  Flag,
  Move
} from 'lucide-react';

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

  // Pastikan simpul awal yang dipilih valid (bebas simpul tujuan mana pun)
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

  return (
    <div className="flex-1 flex flex-col min-h-[calc(100vh-4rem)] bg-slate-950 p-4 sm:p-6 lg:p-8">
      {/* Top Bar: Info Kampus & Kontrol */}
      <div className="mb-4 bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                Peta Kampus Unsri Bukit Besar Palembang
              </h2>
              <span className="text-[11px] text-slate-400">
                {placeNodes.length} Lokasi Tujuan • {waypointNodes.length} Tikungan • {currentGraph.edges.length} Ruas Jalan
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          {/* Bebas Pilih Simpul Awal Mana Saja */}
          <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
            <Flag className="w-3.5 h-3.5 text-purple-400" />
            <label htmlFor="start-node" className="text-xs text-slate-300 font-medium">
              Titik Keberangkatan Awal:
            </label>
            <select
              id="start-node"
              value={effectiveStartNode}
              onChange={(e) => setStartNodeId(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-purple-300 font-semibold text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-400 cursor-pointer"
            >
              {placeNodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label || n.id}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons: Edit Mode & Export */}
        <div className="flex items-center gap-2">
          {APP_CONFIG.ALLOW_CAMPUS_EDIT ? (
            <button
              onClick={() => editor.setIsEditing(!editor.isEditing)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                editor.isEditing
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{editor.isEditing ? 'Selesai Edit' : 'Mode Kelola Peta'}</span>
            </button>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/80 text-slate-400 text-xs border border-slate-700">
              <Lock className="w-3 h-3" />
              <span>Peta Kampus Terkunci</span>
            </span>
          )}

          <button
            onClick={handleCopyJSON}
            title="Salin Data Simpul & Jalan dalam Format JSON"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin JSON Peta</span>
              </>
            )}
          </button>

          {APP_CONFIG.ALLOW_CAMPUS_EDIT && (
            <button
              onClick={() => editor.resetTo(campusPreset.nodes, campusPreset.edges)}
              title="Reset ke Titik & Jalan Bawaan Preset"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 cursor-pointer transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Toolbar Sub-Alat saat Mode Edit Aktif */}
      {APP_CONFIG.ALLOW_CAMPUS_EDIT && editor.isEditing && (
        <div className="mb-4 bg-slate-900/90 border border-amber-500/40 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-300 font-medium">
            <span>Alat Edit:</span>
            <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => {
                  setEditTool('place');
                  editor.setSelectedNodeForEdge(null);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition cursor-pointer ${
                  editTool === 'place'
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3 h-3" />
                <span>1. Tambah Gedung</span>
              </button>
              <button
                onClick={() => {
                  setEditTool('waypoint');
                  editor.setSelectedNodeForEdge(null);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition cursor-pointer ${
                  editTool === 'waypoint'
                    ? 'bg-amber-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GitBranch className="w-3 h-3" />
                <span>2. Tambah Tikungan</span>
              </button>
              <button
                onClick={() => {
                  setEditTool('connect');
                  editor.setSelectedNodeForEdge(null);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition cursor-pointer ${
                  editTool === 'connect'
                    ? 'bg-sky-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Link2 className="w-3 h-3" />
                <span>3. Sambung Jalan</span>
              </button>
              <button
                onClick={() => {
                  setEditTool('move');
                  editor.setSelectedNodeForEdge(null);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition cursor-pointer ${
                  editTool === 'move'
                    ? 'bg-teal-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Move className="w-3 h-3" />
                <span>4. Geser Simpul</span>
              </button>
              <button
                onClick={() => {
                  setEditTool('delete');
                  editor.setSelectedNodeForEdge(null);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition cursor-pointer ${
                  editTool === 'delete'
                    ? 'bg-rose-600 text-white font-semibold'
                    : 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10'
                }`}
              >
                <Trash2 className="w-3 h-3" />
                <span>5. Hapus</span>
              </button>
            </div>
          </div>
          <div className="text-slate-400 text-[11px]">
            {editTool === 'place' && 'Klik peta untuk membuat gedung tujuan bus.'}
            {editTool === 'waypoint' && 'Klik peta pada tikungan/persimpangan jalan.'}
            {editTool === 'connect' && 'Klik simpul pertama, lalu klik simpul kedua untuk menarik jalan.'}
            {editTool === 'move' && 'Tarik (drag & drop) simpul mana saja untuk menggeser letaknya di peta.'}
            {editTool === 'delete' && 'Klik simpul atau garis jalan mana saja untuk langsung menghapusnya.'}
          </div>
        </div>
      )}

      {/* Error jika graf jalan belum terhubung atau simpul kurang */}
      {!solverOutput.ok && (
        <div className="mb-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <div>
            <strong>Gagal Membentuk Rute TSP:</strong> {solverOutput.error}
          </div>
        </div>
      )}

      {/* Main Grid: Map (Kiri) & Stepper Panels (Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="h-[460px] sm:h-[520px] w-full">
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

        <div className="lg:col-span-5 flex flex-col gap-4">
          <ExplanationPanel currentStep={stepPlayer.currentStep} />
          <DataPanel currentStep={stepPlayer.currentStep} />
          <PseudocodePanel currentStep={stepPlayer.currentStep} />
        </div>
      </div>
    </div>
  );
}
