import React from 'react';
import { Building2, GitBranch, Link2, Move, Trash2 } from 'lucide-react';

export default function CampusToolbar({
  editTool,
  onSelectTool
}) {
  const tools = [
    { id: 'place', label: 'Tambah Gedung', icon: Building2 },
    { id: 'waypoint', label: 'Tambah Tikungan', icon: GitBranch },
    { id: 'connect', label: 'Sambung Jalan', icon: Link2 },
    { id: 'move', label: 'Geser Simpul', icon: Move },
    { id: 'delete', label: 'Hapus', icon: Trash2 }
  ];

  return (
    <div className="mb-5 bg-gradient-to-r from-[#0e4984]/75 to-[#072f59]/90 border border-amber-400/35 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xl shadow-[#021c38]/40">
      <div className="flex items-center gap-2 text-amber-300 font-medium">
        <span className="font-semibold text-white">Alat Kelola:</span>
        <div className="flex flex-wrap items-center gap-1.5 bg-[#062648]/85 p-1 rounded-xl border border-blue-300/20">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = editTool === tool.id;
            const isDelete = tool.id === 'delete';
            return (
              <button
                key={tool.id}
                onClick={() => onSelectTool(tool.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                  isActive
                    ? isDelete
                      ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-950/40'
                      : 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-black/25'
                    : 'text-blue-200/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tool.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-blue-100/80 text-[11px] font-medium">
        {editTool === 'place' && '● Klik peta untuk menambah gedung tujuan baru.'}
        {editTool === 'waypoint' && '● Klik peta pada tikungan atau persimpangan rute bus.'}
        {editTool === 'connect' && '● Klik simpul pertama lalu klik simpul kedua untuk menyambung jalan.'}
        {editTool === 'move' && '● Tarik (drag & drop) simpul mana saja untuk memindahkan posisinya di peta.'}
        {editTool === 'delete' && '✕ Klik simpul atau garis jalan mana saja untuk langsung menghapusnya.'}
      </div>
    </div>
  );
}
