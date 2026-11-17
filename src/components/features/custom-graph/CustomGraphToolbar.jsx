import React from 'react';
import { Plus, Link2, Move, Trash2 } from 'lucide-react';

export default function CustomGraphToolbar({
  currentMode,
  onSelectMode
}) {
  const tools = [
    { id: 'add-node', label: 'Tambah Simpul', icon: Plus },
    { id: 'add-edge', label: 'Sambung Sisi', icon: Link2 },
    { id: 'drag', label: 'Geser Simpul', icon: Move },
    { id: 'delete', label: 'Hapus', icon: Trash2 }
  ];

  return (
    <div className="mb-5 bg-gradient-to-r from-[#0e4984]/75 to-[#072f59]/90 border border-blue-300/25 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xl shadow-[#021c38]/40">
      <div className="flex items-center gap-2 text-white font-medium">
        <span className="font-semibold text-white">Alat Kanvas:</span>
        <div className="flex flex-wrap items-center gap-1.5 bg-[#062648]/85 p-1 rounded-xl border border-blue-300/20">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = currentMode === tool.id;
            const isDelete = tool.id === 'delete';
            return (
              <button
                key={tool.id}
                onClick={() => onSelectMode(tool.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
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
        {currentMode === 'add-node' && '● Klik pada area kanvas untuk menaruh simpul baru.'}
        {currentMode === 'add-edge' && '● Klik simpul pertama, lalu klik simpul kedua untuk menyambung sisi berbobot.'}
        {currentMode === 'drag' && '● Tarik (drag & drop) simpul mana saja untuk memindahkan koordinatnya.'}
        {currentMode === 'delete' && '✕ Klik simpul atau garis sisi mana saja untuk langsung menghapusnya.'}
      </div>
    </div>
  );
}
